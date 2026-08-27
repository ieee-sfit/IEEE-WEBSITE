import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const [teams, participants, psDrafts, submissions] = await Promise.all([
      supabaseClient.from('teams').select('*'),
      supabaseClient.from('participants').select('*'),
      supabaseClient.from('ps_drafts').select('*'),
      supabaseClient.from('submissions').select('*')
    ]);
    return new Response(
      JSON.stringify({
        teams: teams.data,
        participants: participants.data,
        psDrafts: psDrafts.data,
        submissions: submissions.data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    });
  }
});
