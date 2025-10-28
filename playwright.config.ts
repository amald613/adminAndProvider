import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4,
  globalSetup: 'config/global-setup.ts',
  globalTeardown: 'config/global-teardown.ts',

  use: {
    actionTimeout: 15000,
    navigationTimeout: 60000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    storageState: 'playwright/.auth/user.json',
  },

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['github'],
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});