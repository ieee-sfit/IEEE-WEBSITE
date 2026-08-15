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

    const formData = await req.formData();
    const team_id = formData.get('team_id');
    const secret = formData.get('secret');
    const ppt_file = formData.get('ppt_file');

    if (!team_id || !secret || !ppt_file) {
      throw new Error('Missing required fields');
    }

    // Authenticate
    const { data: teamData, error: authError } = await supabaseClient
      .from('teams')
      .select('id, submission_secret_hash')
      .eq('team_id', team_id)
      .single();

    if (authError || !teamData || teamData.submission_secret_hash !== secret) {
      throw new Error('Invalid Team ID or Secret');
    }

    // Process file
    if (!(ppt_file instanceof File)) {
      throw new Error('ppt_file must be a file');
    }

    if (!ppt_file.name.endsWith('.pptx')) {
      throw new Error('Only .pptx files are allowed.');
    }

    if (ppt_file.size > 15 * 1024 * 1024) {
      throw new Error('File size exceeds 15MB limit');
    }

    const fileExt = ppt_file.name.split('.').pop();
    const fileName = `${team_id}_${Date.now()}.${fileExt}`;
    const filePath = `presentations/${fileName}`;

    // Upload
    const { error: uploadError } = await supabaseClient.storage
      .from('sih_presentations')
      .upload(filePath, ppt_file);

    if (uploadError) {
      throw new Error('Failed to upload presentation: ' + uploadError.message);
    }

    // Update submissions table (upsert based on team_id)
    const { error: dbError } = await supabaseClient
      .from('submissions')
      .upsert({
        team_id: teamData.id,
        ppt_file_path: filePath,
        status: 'SUBMITTED',
        updated_at: new Date().toISOString()
      }, { onConflict: 'team_id' });

    if (dbError) {
      throw new Error('Failed to record submission in database: ' + dbError.message);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Presentation uploaded successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
