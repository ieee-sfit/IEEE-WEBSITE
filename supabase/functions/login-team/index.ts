import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { team_id, secret } = body;

    if (!team_id || !secret) {
      throw new Error('Team ID and Secret are required');
    }

    const { data, error } = await supabaseClient
      .from('teams')
      .select('id, team_id, submission_secret_hash')
      .eq('team_id', team_id)
      .single();

    if (error || !data) {
      // Generic response to avoid enumerating valid team IDs
      throw new Error('Invalid Team ID or Secret');
    }

    if (data.submission_secret_hash !== secret) {
      throw new Error('Invalid Team ID or Secret');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
