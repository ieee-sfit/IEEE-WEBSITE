import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

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

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch teams created on or after August 18th
    const { data: teams, error } = await supabaseClient
      .from('teams')
      .select('*, participants(*)')
      .gte('created_at', '2026-08-18T00:00:00Z');

    if (error) {
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }

    if (!teams || teams.length === 0) {
      return new Response(JSON.stringify({ message: 'No teams found' }), { status: 200 });
    }

    // HARDCODED TO ENSURE IT WORKS
    const mailDispatcherUrl = 'https://script.google.com/macros/s/AKfycbxfBzwMWKvjbrS1DHjKHGqiz-Fs2cbdqskCWx8HA1PYOEDxIzdrsWBFi3VpnZRnlDVQpA/exec';
    const mailDispatcherKey = '3K9fP2mV7xL1qW8nB4rY6tC5hM2dJ9vK';

    const results = [];

    for (const team of teams) {
      const secret = await generateTeamSecret(team.id);
      const leader = team.participants.find((p: any) => p.is_leader);

      if (!leader) {
        results.push({ team: team.team_name, status: 'No leader' });
        continue;
      }

      try {
        const response = await fetch(mailDispatcherUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dispatcherSecret: mailDispatcherKey,
            teamId: team.team_id,
            teamName: team.team_name,
            secret: secret,
            leader: leader
          })
        });

        const respText = await response.text();
        let respJson;
        try { respJson = JSON.parse(respText); } catch(e) {}

        if (response.ok && respJson?.success === true) {
          results.push({ team: team.team_name, status: 'Success' });
        } else {
          results.push({ team: team.team_name, status: `Failed: HTTP ${response.status} - ${respText}` });
        }
      } catch (err: any) {
        results.push({ team: team.team_name, status: `Error: ${err.message}` });
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
