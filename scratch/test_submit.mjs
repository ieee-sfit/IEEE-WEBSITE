import fs from 'fs';
import crypto from 'crypto';

const SUPABASE_URL = 'https://jbmjhynetvzcbuyzyjhc.supabase.co';

async function testE2E() {
  console.log('1. Registering dummy team...');
  const formData = new FormData();
  formData.append('registration_request_id', crypto.randomUUID());
  formData.append('team_name', `E2E_Test_${Date.now()}`);
  formData.append('payee_upi_id', 'test@upi');
  
  fs.writeFileSync('dummy_receipt.pdf', 'dummy pdf content');
  const receiptBlob = new Blob([fs.readFileSync('dummy_receipt.pdf')], { type: 'application/pdf' });
  formData.append('payment_receipt', receiptBlob, 'dummy_receipt.pdf');
  
  const randomSuffix = Date.now().toString().slice(-4);
  const participants = Array.from({length: 6}).map((_, i) => ({
      name: `Member ${i}`,
      email: `member${randomSuffix}${i}@example.com`,
      phone: '1234567890',
      gender: i === 5 ? 'Female' : 'Male', // At least one female
      branch: 'INFT',
      year: 'TE',
      pid: `PID${randomSuffix}${i}`
  }));
  formData.append('participants', JSON.stringify(participants));

  const regRes = await fetch(`${SUPABASE_URL}/functions/v1/register-team`, {
    method: 'POST',
    body: formData
  });
  const regData = await regRes.json();
  
  if (!regData.success) {
      console.error('Registration failed:', regData);
      return;
  }
  
  console.log('2. Logging in...');
  const loginRes = await fetch(`${SUPABASE_URL}/functions/v1/login-team`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_id: regData.team_id, secret: regData.secret })
  });
  
  const loginData = await loginRes.json();
  
  if (!loginData.success) {
    console.error('Login failed');
    return;
  }
  
  console.log('3. Submitting project...');
  const submitDataForm = new FormData();
  submitDataForm.append('problem_statement', 'SIH26041');
  submitDataForm.append('ps_title', 'AR-Based Vocational Training Simulator');
  submitDataForm.append('category', 'Software');
  submitDataForm.append('domain', 'Smart Education');
  submitDataForm.append('solution_title', 'EduSim 3000');
  
  fs.writeFileSync('dummy_ppt.pdf', 'dummy presentation content');
  const pptBlob = new Blob([fs.readFileSync('dummy_ppt.pdf')], { type: 'application/pdf' });
  submitDataForm.append('ppt_file', pptBlob, 'dummy_ppt.pdf');
  
  const submitRes = await fetch(`${SUPABASE_URL}/functions/v1/submit-ppt`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${loginData.token}`
    },
    body: submitDataForm
  });
  
  const submitData = await submitRes.json();
  console.log('Submit Result:', submitData);
}

testE2E();
