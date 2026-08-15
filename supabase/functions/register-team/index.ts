// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const registration_request_id = formData.get('registration_request_id');
    const team_name = formData.get('team_name');
    const payment_receipt = formData.get('payment_receipt');
    const participantsDataRaw = formData.get('participants');

    if (!registration_request_id || !team_name || !payment_receipt || !participantsDataRaw) {
      throw new Error('Missing required fields');
    }

    const participantsData = JSON.parse(participantsDataRaw.toString());
    
    // Server-side validation
    if (participantsData.length !== 6) {
      throw new Error('Team must have exactly 6 members');
    }

    const femaleCount = participantsData.filter((m: any) => m.gender === 'Female').length;
    if (femaleCount < 1) {
      throw new Error('Team must have at least one female participant according to SIH rules.');
    }

    // Process file
    if (!(payment_receipt instanceof File)) {
      throw new Error('payment_receipt must be a file');
    }
    
    if (payment_receipt.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // 1. Generate Secret and Team ID server-side
    const secret = Math.random().toString(36).substring(2, 8).toUpperCase();
    const team_id = `NAV-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Upload file to Supabase Storage
    const fileExt = payment_receipt.name.split('.').pop();
    const fileName = `${Date.now()}_${team_name.toString().replace(/\s+/g, '_')}.${fileExt}`;
    
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
      p_team_id: team_id,
      p_team_name: team_name,
      p_submission_secret_hash: secret, // Store raw for now
      p_payment_receipt_path: payment_receipt_path,
      p_participants: participantsData.map((m: any, idx: number) => ({
        is_leader: idx === 0,
        pid: m.pid,
        email: m.email,
        name: m.name,
        phone: m.phone,
        gender: m.gender,
        branch: m.branch,
        year: m.year
      })),
    });

    if (error) {
      console.error('RPC Error:', error);
      // Clean up the uploaded file if DB insert fails
      await supabaseClient.storage.from('payment_receipts').remove([payment_receipt_path]);

      if (error.code === '23505') { // Postgres unique_violation
          if (error.message.includes('teams_registration_request_id_key')) {
              return new Response(
                JSON.stringify({ success: true, message: 'Already registered (Idempotent success)', team_id, secret }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
              );
          }
      }
      throw error;
    }

    // 4. Dispatch Email (Placeholder)
    // await fetch('https://api.resend.com/emails', ...)

    return new Response(
      JSON.stringify({ success: true, team_id, secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Function Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
