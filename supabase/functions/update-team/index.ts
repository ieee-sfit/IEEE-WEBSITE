// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5174',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyString = Deno.env.get('NAVKRITI_HMAC_SECRET');
  if (!keyString) throw new Error('Secret not configured');

  const keyData = encoder.encode(keyString);
  const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );

  const parts = token.split('.');
  if (parts.length !== 2) throw new Error('Invalid token format');

  const payloadB64 = parts[0];
  const sigB64 = parts[1];

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payloadB64));
  const expectedSigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  if (sigB64 !== expectedSigB64) {
    throw new Error('Invalid signature');
  }

  let b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) {
    b64 += '=';
  }
  const payloadStr = atob(b64);
  const payload = JSON.parse(payloadStr);

  if (Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  return payload.team_uuid;
}

function normalizeString(str: any): string {
    return typeof str === 'string' ? str.trim() : '';
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const headers = new Headers(corsHeaders);
  if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    const teamUuid = await verifyToken(token);

    const body = await req.json();
    let { participants } = body;

    if (!participants || !Array.isArray(participants) || participants.length !== 6) {
      throw new Error('Team must have exactly 6 members');
    }

    // Normalize participant data
    participants = participants.map((m: any, idx: number) => {
        const email = normalizeString(m.email).toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Invalid email for participant ${idx + 1}`);
        if (!/^\d{10}$/.test(normalizeString(m.phone))) throw new Error(`Phone number must be exactly 10 digits for participant ${idx + 1}`);

        return {
            team_id: teamUuid,
            is_leader: idx === 0,
            pid: normalizeString(m.pid),
            email: email,
            name: normalizeString(m.name),
            phone: normalizeString(m.phone),
            gender: normalizeString(m.gender),
            branch: normalizeString(m.branch),
            year: normalizeString(m.year)
        };
    });

    const femaleCount = participants.filter((m: any) => m.gender === 'Female').length;
    if (femaleCount < 1) {
      throw new Error('Team must have at least one female participant according to SIH rules.');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete existing participants
    const { error: deleteError } = await supabaseClient
      .from('participants')
      .delete()
      .eq('team_id', teamUuid);

    if (deleteError) {
      throw new Error('Failed to update participants: ' + deleteError.message);
    }

    // Insert new participants
    const { error: insertError } = await supabaseClient
      .from('participants')
      .insert(participants);

    if (insertError) {
      throw new Error('Failed to insert updated participants: ' + insertError.message);
    }

    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: true, message: 'Team details updated successfully' }), { headers, status: 200 });
  } catch (error: any) {
    const origin = req.headers.get('Origin');
    const errHeaders = new Headers(corsHeaders);
    if (origin) errHeaders.set('Access-Control-Allow-Origin', origin);
    errHeaders.set('Content-Type', 'application/json');

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: errHeaders, status: 400 }
    );
  }
});
