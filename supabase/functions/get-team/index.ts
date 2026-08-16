// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5174',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadStr);

  if (Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  return payload.team_uuid;
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: participants, error } = await supabaseClient
      .from('participants')
      .select('*')
      .eq('team_id', teamUuid)
      .order('is_leader', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch participants: ' + error.message);
    }

    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ participants }), { headers, status: 200 });
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
