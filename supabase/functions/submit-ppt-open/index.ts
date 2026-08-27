import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const team_name_input = normalizeString(formData.get('team_name'));
    const team_no_input = normalizeString(formData.get('team_no'));
    const problem_statement = normalizeString(formData.get('problem_statement'));
    const ps_title = normalizeString(formData.get('ps_title'));
    const category = normalizeString(formData.get('category'));
    const domain = normalizeString(formData.get('domain'));
    const solution_title = normalizeString(formData.get('solution_title'));
    const organization = normalizeString(formData.get('organization'));
    const ppt_file = formData.get('ppt_file');

    if (!team_name_input || !team_no_input || !problem_statement || !ps_title || !category || !domain || !solution_title || !ppt_file) {
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

    // Lookup Team by Name (Case-insensitive)
    const { data: teamData, error: teamError } = await supabaseClient
      .from('teams')
      .select('id, team_name')
      .ilike('team_name', team_name_input)
      .limit(1)
      .single();

    if (teamError || !teamData) {
      throw new Error('Team not found in our database. Please ensure you entered the exact Team Name you registered with.');
    }

    const teamUuid = teamData.id;

    // 3. Upload File Deterministically
    const sanitizedName = ppt_file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `presentations/${teamUuid}/${sanitizedName}`;
    
    // Clean up any existing files in this team's directory to avoid orphans
    const { data: existingFiles } = await supabaseClient.storage
      .from('sih_presentations')
      .list(`presentations/${teamUuid}`);
      
    if (existingFiles && existingFiles.length > 0) {
      const filesToRemove = existingFiles.map(f => `presentations/${teamUuid}/${f.name}`);
      await supabaseClient.storage.from('sih_presentations').remove(filesToRemove);
    }
    
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
            team_no: team_no_input,
            problem_statement,
            ps_title,
            category,
            domain,
            solution_title,
            organization,
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
      { headers: errHeaders, status: 200 }
    );
  }
});
