// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateTeamSecret(teamUuid: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyString = Deno.env.get('NAVKRITI_HMAC_SECRET');
  if (!keyString) throw new Error('NAVKRITI_HMAC_SECRET not set');
  
  const keyData = encoder.encode(keyString);
  const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  
  const data = encoder.encode(teamUuid);
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return an 8-character string (32 bits of entropy from the hash)
  return hashHex.substring(0, 8).toUpperCase();
}

function normalizeString(str: any): string {
    return typeof str === 'string' ? str.trim() : '';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Enforce Registration Deadline
    const closeDateStr = Deno.env.get('NAVKRITI_REGISTRATION_CLOSE');
    if (closeDateStr) {
        const closeDate = new Date(closeDateStr).getTime();
        if (Date.now() > closeDate) {
            throw new Error('Registration is officially closed.');
        }
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const registration_request_id = formData.get('registration_request_id');
    const raw_team_name = formData.get('team_name');
    const payment_receipt = formData.get('payment_receipt');
    const payee_upi_id = formData.get('payee_upi_id');
    const participantsDataRaw = formData.get('participants');

    if (!registration_request_id || !raw_team_name || !payment_receipt || !payee_upi_id || !participantsDataRaw) {
      throw new Error('Missing required fields');
    }

    const team_name = normalizeString(raw_team_name);
    const normalized_payee_upi_id = normalizeString(payee_upi_id);
    
    if (!normalized_payee_upi_id.includes('@')) {
        throw new Error('Invalid Payee UPI ID format');
    }

    let participantsData = JSON.parse(participantsDataRaw.toString());
    
    if (participantsData.length !== 6) {
      throw new Error('Team must have exactly 6 members');
    }

    // Normalize participant data
    participantsData = participantsData.map((m: any, idx: number) => {
        const email = normalizeString(m.email).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email for participant ${idx + 1}`);
        if (!/^\d{10}$/.test(normalizeString(m.phone))) throw new Error(`Phone number must be exactly 10 digits for participant ${idx + 1}`);
        
        const branch = normalizeString(m.branch);
        const validBranches = ['CMPN', 'INFT', 'EXTC', 'ELEC', 'MECH', 'ECS', 'AIML'];
        if (!validBranches.includes(branch)) throw new Error(`Invalid branch for participant ${idx + 1}`);
        
        const year = normalizeString(m.year);
        const validYears = ['FE', 'SE', 'TE', 'BE'];
        if (!validYears.includes(year)) throw new Error(`Invalid year for participant ${idx + 1}`);
        
        const pid = normalizeString(m.pid).toUpperCase();
        if (!pid) throw new Error(`PID cannot be empty for participant ${idx + 1}`);

        return {
            is_leader: idx === 0,
            pid: pid,
            email: email,
            name: normalizeString(m.name),
            phone: normalizeString(m.phone),
            gender: normalizeString(m.gender),
            branch: normalizeString(m.branch),
            year: normalizeString(m.year)
        };
    });

    const femaleCount = participantsData.filter((m: any) => m.gender === 'Female').length;
    if (femaleCount < 1) {
      throw new Error('Team must have at least one female participant according to SIH rules.');
    }

    const pids = participantsData.map((m: any) => m.pid);
    if (new Set(pids).size !== 6) {
      throw new Error('All 6 members must have unique PIDs.');
    }

    const emails = participantsData.map((m: any) => m.email);
    if (new Set(emails).size !== 6) {
      throw new Error('All 6 members must have unique emails.');
    }

    if (!(payment_receipt instanceof File)) {
      throw new Error('payment_receipt must be a file');
    }
    
    // Strict MIME type checking
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(payment_receipt.type)) {
      throw new Error('Invalid payment receipt format. Please upload a JPG, PNG, or PDF.');
    }

    if (payment_receipt.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // 1. Generate secure random Team ID
    const randomBytes = new Uint8Array(3); // 6 hex chars
    crypto.getRandomValues(randomBytes);
    const teamIdHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    const p_team_id = `NAV-${teamIdHex}`;

    // 2. Upload file to Supabase Storage
    const fileExt = payment_receipt.name.split('.').pop();
    const fileName = `${Date.now()}_${team_name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
    
    const { error: uploadError } = await supabaseClient.storage
      .from('payment_receipts')
      .upload(`receipts/${fileName}`, payment_receipt);

    if (uploadError) {
      throw new Error('Failed to upload payment receipt: ' + uploadError.message);
    }

    const payment_receipt_path = `receipts/${fileName}`;

    // 3. Call the RPC function using the Service Role key
    const { data, error } = await supabaseClient.rpc('register_team', {
      p_registration_request_id: registration_request_id,
      p_team_id: p_team_id,
      p_team_name: team_name,
      p_payment_receipt_path: payment_receipt_path,
      p_payee_upi_id: normalized_payee_upi_id,
      p_participants: participantsData,
    });

    if (error) {
      console.error('RPC Error:', error);
      await supabaseClient.storage.from('payment_receipts').remove([payment_receipt_path]);
      
      let friendlyMessage = error.message;
      if (friendlyMessage.includes('participants_email_key') || friendlyMessage.includes('unique constraint') && friendlyMessage.includes('email')) {
          friendlyMessage = 'One or more emails are already registered with another team.';
      } else if (friendlyMessage.includes('participants_pid_key') || friendlyMessage.includes('unique constraint') && friendlyMessage.includes('pid')) {
          friendlyMessage = 'One or more PIDs are already registered with another team.';
      } else if (friendlyMessage.includes('teams_team_name_key') || friendlyMessage.includes('unique constraint') && friendlyMessage.includes('team_name')) {
          friendlyMessage = 'This team name is already taken. Please choose another one.';
      }
      
      throw new Error(friendlyMessage);
    }

    // data contains { success: true, team_uuid, team_id, is_duplicate }
    const actual_team_uuid = data.team_uuid;
    const actual_team_id = data.team_id;

    if (data.is_duplicate) {
      await supabaseClient.storage.from('payment_receipts').remove([payment_receipt_path]);
    }

    // 4. Generate Deterministic Secret
    const secret = await generateTeamSecret(actual_team_uuid);

    // 5. Fire Mail Dispatcher
    if (!data.is_duplicate) {
      const mailDispatcherUrl = 'https://script.google.com/macros/s/AKfycbxfBzwMWKvjbrS1DHjKHGqiz-Fs2cbdqskCWx8HA1PYOEDxIzdrsWBFi3VpnZRnlDVQpA/exec';
      const mailDispatcherKey = '3K9fP2mV7xL1qW8nB4rY6tC5hM2dJ9vK';
      
      if (mailDispatcherUrl && mailDispatcherKey) {
          const dispatchEmail = async () => {
            try {
              const response = await fetch(mailDispatcherUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dispatcherSecret: mailDispatcherKey,
                    teamId: actual_team_id,
                    teamName: team_name,
                    secret: secret,
                    leader: participantsData[0]
                })
              });
              if (!response.ok) {
                console.error('Mail dispatcher returned:', response.status);
              }
            } catch (error) {
              console.error('Mail dispatcher failed:', error);
            }
          };
          
          await dispatchEmail();
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        team_id: actual_team_id, 
        secret: secret,
        message: data.is_duplicate ? 'Already registered (Idempotent success)' : 'Registration successful'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Function Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
