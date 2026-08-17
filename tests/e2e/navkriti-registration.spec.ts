import { test, expect } from '@playwright/test';
import { generateTeam } from '../utils/generateTeam';
import path from 'path';

test.describe('Navkriti Registration Fuzzer', () => {
  test.setTimeout(60000);
  test('should successfully complete a registration workflow and catch any page/network errors', async ({ page }) => {
    const failures: any[] = [];

    // Aggressive Event Listeners
    page.on("pageerror", (error) => {
      failures.push({ type: "pageerror", message: error.message });
      console.error(`❌ PAGE ERROR: ${error.message}`);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        failures.push({ type: "console", message: message.text() });
        console.error(`❌ CONSOLE ERROR: ${message.text()}`);
      }
    });

    page.on("requestfailed", (request) => {
      failures.push({ type: "requestfailed", url: request.url(), error: request.failure()?.errorText });
      console.error(`❌ REQUEST FAILED: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    page.on("response", (response) => {
      if (response.status() >= 500) {
        failures.push({ type: "http", status: response.status(), url: response.url() });
        console.error(`❌ HTTP ERROR: ${response.status()} on ${response.url()}`);
      }
    });

    // 1. Navigate to Registration Page
    await page.goto('/navkriti');

    // Click the Register Team tab to mount the form
    await page.getByRole('button', { name: /Register Team/i }).click();

    // Let's ensure the page has loaded by checking for the main title
    await expect(page.getByRole('heading', { name: 'Team Registration' })).toBeVisible();

    // 2. Generate Fake Team
    const testRunId = Math.floor(Math.random() * 10000);
    const fakeTeam = generateTeam(testRunId);
    // Explicitly set the leader's email as requested with a unique tag
    fakeTeam.members[0].email = `betamalescara+${testRunId}@gmail.com`;

    // 3. Fill Team Details
    await page.fill('input#team-name', fakeTeam.teamName);

    // 4. Fill 6 Participants
    for (let i = 0; i < 6; i++) {
      const member = fakeTeam.members[i];
      await page.fill(`input#name-${i}`, member.name);
      await page.fill(`input#email-${i}`, member.email);
      await page.fill(`input#pid-${i}`, member.pid);
      await page.fill(`input#phone-${i}`, member.phone);
      await page.selectOption(`select#gender-${i}`, member.gender);
      await page.selectOption(`select#branch-${i}`, member.branch);
      await page.selectOption(`select#year-${i}`, member.year);
    }

    // 5. Upload Fake Payment Receipt
    // The input is hidden, so we need to set the files directly on the input element
    const fileUpload = page.locator('input#file-upload');
    await fileUpload.setInputFiles('./tests/fixtures/test-receipt.png');

    // 6. Tick Checkboxes & Fill Additional Info
    // SIH agreement checkbox
    await page.check('input#sih-agreement');
    // Payee UPI ID
    await page.fill('input#payeeUpiId', `autotest${testRunId}@ybl`);

    // 7. Submit Form
    await page.click('button[type="submit"]');

    // 8. Verify Success or Failures
    // Wait for the success UI to appear
    try {
      await expect(page.getByText('Registration successful')).toBeVisible({ timeout: 10000 });
      await expect(page.getByText('Your Official Team ID')).toBeVisible();
      await expect(page.getByText('Submission Secret').first()).toBeVisible();
      
      console.log(`✅ AUTOTEST #${testRunId} REGISTRATION SUCCESSFUL`);
      
      // Extract credentials
      const teamId = await page.locator('.text-4xl.font-extrabold').nth(0).innerText();
      const secret = await page.locator('.text-4xl.font-extrabold').nth(1).innerText();
      
      console.log(`🔑 Credentials Extracted - ID: ${teamId}, Secret: ${secret}`);

      // 9. Navigate to Portal and Log In
      await page.goto('/navkriti/portal');
      await expect(page.getByRole('heading', { name: 'Team Portal Login' })).toBeVisible();

      await page.fill('input[placeholder="e.g. NAV-123456"]', teamId);
      await page.fill('input[placeholder="Enter your secret"]', secret);
      await page.click('button[type="submit"]');

      // Verify successful login
      await expect(page.getByRole('heading', { name: 'Team Dashboard' })).toBeVisible({ timeout: 10000 });
      console.log(`✅ AUTOTEST #${testRunId} LOGIN SUCCESSFUL`);

    } catch (e) {
      console.error(`❌ AUTOTEST #${testRunId} FAILED. Taking screenshot...`);
      await page.screenshot({ path: `tests/artifacts/run-${testRunId}-failure.png` });
      throw e;
    }

    // Fail the test if our aggressive listeners caught anything
    expect(failures).toEqual([]);
  });
});
