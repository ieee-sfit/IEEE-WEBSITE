import * as ftp from 'basic-ftp';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as readline from 'readline';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function deploy() {
  console.log('\n🚀 Starting Deployment Process...\n');

  // Step 1: Confirm with user
  const answer = await new Promise(resolve => {
    rl.question('Are you sure you want to build and deploy to production? (y/N): ', resolve);
  });

  if (answer.toLowerCase() !== 'y') {
    console.log('\n❌ Deployment cancelled.');
    rl.close();
    process.exit(0);
  }

  // Step 2: Build the project
  console.log('\n🔨 Building the project...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful!\n');
  } catch (err) {
    console.error('\n❌ Build failed. Aborting deployment.');
    rl.close();
    process.exit(1);
  }

  // Step 3: Deploy via FTP
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const remotePath = process.env.FTP_REMOTE_PATH || 'public_html'; // e.g., 'public_html/navkriti' or '/'

  if (!host || !user || !password) {
    console.error('\n❌ FTP Credentials missing in .env.local!');
    console.error('Make sure FTP_HOST, FTP_USER, and FTP_PASSWORD are set.');
    rl.close();
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = true; // Set to false if you don't want verbose logs

  console.log('🌐 Connecting to FTP server...');
  try {
    await client.access({
      host: host,
      user: user,
      password: password,
      secure: false // Set to true if FTPS is supported
    });

    console.log('✅ Connected! Uploading files...');
    
    // Ensure the remote directory exists
    await client.ensureDir(remotePath);
    
    // Clear the remote directory first (optional, but recommended to avoid stale files)
    // await client.clearWorkingDir();
    
    // Upload the dist folder contents
    await client.uploadFromDir('dist');
    
    console.log('\n🎉 Deployment Successful!');
  } catch (err) {
    console.error('\n❌ Deployment Failed:', err);
  } finally {
    client.close();
    rl.close();
  }
}

deploy();
