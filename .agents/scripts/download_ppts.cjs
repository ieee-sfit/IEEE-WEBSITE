require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in ./.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const downloadDir = path.join(__dirname, '../../downloads/navkriti_ppts');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  console.log("Fetching submissions from database...");
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select('team_id, ppt_file_path, teams(team_id)'); // teams(team_id) gets the NAV-123456 ID

  if (error) {
    console.error("Error fetching submissions:", error);
    return;
  }

  console.log(`Found ${submissions.length} submissions.`);

  for (const sub of submissions) {
    if (!sub.ppt_file_path) continue;

    const navTeamId = sub.teams?.team_id || sub.team_id; // Fallback to uuid if relation fails
    // Assuming format requested is downloading to folder named by Team ID or prefixed
    // Let's prefix the file with the Team ID: NAV-123456_presentation.pptx
    
    // Extract original filename from path
    const parts = sub.ppt_file_path.split('/');
    const originalName = parts[parts.length - 1];
    
    // Some paths might already include the team id, but we'll enforce a clean format
    // Clean up filename to prevent issues
    const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${navTeamId}_${safeName}`;
    const destPath = path.join(downloadDir, fileName);

    console.log(`Downloading ${fileName}...`);
    
    // Generate signed URL (valid for 60 seconds is enough to start download)
    const { data: urlData, error: urlError } = await supabase
      .storage
      .from('sih_presentations')
      .createSignedUrl(sub.ppt_file_path, 60);

    if (urlError || !urlData?.signedUrl) {
      console.error(`Failed to get URL for ${sub.ppt_file_path}:`, urlError);
      continue;
    }

    try {
      await downloadFile(urlData.signedUrl, destPath);
      console.log(`Successfully saved ${fileName}`);
    } catch (downloadErr) {
      console.error(`Error downloading ${fileName}:`, downloadErr);
    }
  }

  console.log(`\nAll downloads complete. Files saved to: ${downloadDir}`);
}

main();
