// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5174', // Must be specific for credentials
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
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
  return hashHex.substring(0, 8).toUpperCase();
}

async function createSessionToken(teamUuid: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyString = Deno.env.get('NAVKRITI_HMAC_SECRET');
  if (!keyString) throw new Error('NAVKRITI_HMAC_SECRET not set');
  
  const keyData = encoder.encode(keyString);
  const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  
  const payload = JSON.stringify({ team_uuid: teamUuid, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }); // 7 days
  const payloadB64 = btoa(payload).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payloadB64));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  return `${payloadB64}.${sigB64}`;
}

serve(async (req) => {
  // We need to mirror the origin for CORS with credentials to work
  const origin = req.headers.get('Origin');
  const headers = new Headers(corsHeaders);
  if (origin) {
      headers.set('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const team_id = body.team_id?.trim();
    const secret = body.secret?.trim();

    if (!team_id || !secret) {
      throw new Error('Team ID and Secret are required');
    }

    const { data, error } = await supabaseClient
      .from('teams')
      .select('id, team_id')
      .eq('team_id', team_id)
      .single();

    if (error || !data) {
      throw new Error('Invalid Team ID or Secret');
    }

    const expectedSecret = await generateTeamSecret(data.id);
    
    // Constant time comparison
    if (expectedSecret.length !== secret.length) {
        throw new Error('Invalid Team ID or Secret');
    }
    
    let mismatch = 0;
    for (let i = 0; i < expectedSecret.length; i++) {
        mismatch |= (expectedSecret.charCodeAt(i) ^ secret.charCodeAt(i));
    }

    if (mismatch !== 0) {
      throw new Error('Invalid Team ID or Secret');
    }

    // Auth Success! Create session
    const token = await createSessionToken(data.id);
    
    headers.set('Content-Type', 'application/json');

    return new Response(
      JSON.stringify({ success: true, team_uuid: data.id, token }),
      { headers, status: 200 }
    );
  } catch (error: any) {
    // Re-instantiate headers in catch block
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
