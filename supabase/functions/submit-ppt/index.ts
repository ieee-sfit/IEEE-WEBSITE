// @ts-nocheck
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5174',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

async function verifySessionToken(token: string): Promise<string> {
  const [payloadB64, sigB64] = token.split('.');
  if (!payloadB64 || !sigB64) throw new Error('Invalid token format');

  const encoder = new TextEncoder();
  const keyString = Deno.env.get('NAVKRITI_HMAC_SECRET');
  if (!keyString) throw new Error('NAVKRITI_HMAC_SECRET not set');

  const keyData = encoder.encode(keyString);
  const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );

  // Decode signature
  const sigStr = atob(sigB64.replace(/-/g, '+').replace(/_/g, '/'));
  const sigBytes = new Uint8Array(sigStr.length);
  for (let i = 0; i < sigStr.length; i++) sigBytes[i] = sigStr.charCodeAt(i);

  const isValid = await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, encoder.encode(payloadB64));
  if (!isValid) throw new Error('Invalid session signature');

  const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadStr);

  if (Date.now() > payload.exp) {
      throw new Error('Session expired');
  }

  return payload.team_uuid;
}

function getToken(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function normalizeString(str: any): string {
    return typeof str === 'string' ? str.trim() : '';
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const headers = new Headers(corsHeaders);
  if (origin) headers.set('Access-Control-Allow-Origin', origin);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    // 1. Enforce Submission Timeline
    const openDateStr = Deno.env.get('NAVKRITI_SUBMISSION_OPEN');
    if (openDateStr) {
        const openDate = new Date(openDateStr).getTime();
        if (Date.now() < openDate) {
            throw new Error('Submissions are not open yet.');
        }
    }

    const closeDateStr = Deno.env.get('NAVKRITI_SUBMISSION_CLOSE');
    if (closeDateStr) {
        const closeDate = new Date(closeDateStr).getTime();
        if (Date.now() > closeDate) {
            throw new Error('Submission deadline has passed.');
        }
    }

    // 2. Authentication
    const token = getToken(req);
    if (!token) {
        throw new Error('Unauthorized: No session token provided');
    }
    const teamUuid = await verifySessionToken(token);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const problem_statement = normalizeString(formData.get('problem_statement'));
    const domain = normalizeString(formData.get('domain'));
    const solution_title = normalizeString(formData.get('solution_title'));
    const summary = normalizeString(formData.get('summary'));
    const ppt_file = formData.get('ppt_file');

    if (!problem_statement || !domain || !solution_title || !summary || !ppt_file) {
      throw new Error('All submission fields (including PPT) are required.');
    }

    if (!(ppt_file instanceof File)) {
      throw new Error('ppt_file must be a valid file');
    }

    const validTypes = [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
        'application/vnd.ms-powerpoint', // ppt
        'application/pdf'
    ];
    if (!validTypes.includes(ppt_file.type)) {
        throw new Error('Invalid file format. Only PPT, PPTX, or PDF files are allowed.');
    }

    if (ppt_file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    // 3. Upload File Deterministically
    const fileExt = ppt_file.name.split('.').pop();
    const filePath = `presentations/${teamUuid}/current.${fileExt}`;
    
    // upsert: true ensures we don't accumulate garbage. The old 'current.ext' is overwritten.
    const { error: uploadError } = await supabaseClient.storage
      .from('sih_presentations')
      .upload(filePath, ppt_file, { upsert: true });

    if (uploadError) {
      throw new Error('Failed to upload presentation: ' + uploadError.message);
    }

    // 4. Upsert Database Record
    const { error: dbError } = await supabaseClient
        .from('submissions')
        .upsert({
            team_id: teamUuid,
            problem_statement,
            domain,
            solution_title,
            summary,
            ppt_file_path: filePath,
            updated_at: new Date().toISOString()
        }, { onConflict: 'team_id' });

    if (dbError) {
        await supabaseClient.storage.from('sih_presentations').remove([filePath]);
        throw new Error('Database error: ' + dbError.message);
    }

    headers.set('Content-Type', 'application/json');
    return new Response(
      JSON.stringify({ success: true, message: 'Submission successfully saved!' }),
      { headers, status: 200 }
    );
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
