// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('🔐 Starting global authentication setup...');
  
  await page.goto('https://appv2.ezyscribe.com');
  
  // Login
  await page.getByRole('textbox', { name: 'email' }).fill('deepeshm@pennhealthinfo.com');
  await page.locator('input[type="password"]').fill('Pennhealth@0925');
  await page.getByRole('button', { name: 'submit' }).click();
  
  // Wait for login to complete and dashboard to load
  await page.waitForTimeout(5000);
  
  // Verify login was successful by checking if we're redirected from login page
  if (page.url().includes('login') || page.url() === 'https://appv2.ezyscribe.com/') {
    throw new Error('Global authentication failed - check credentials');
  }
  
  // Save authentication state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  await browser.close();
  
  console.log('✅ Global authentication setup completed');
}

export default globalSetup;