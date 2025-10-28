export function generateUniqueEmail(base: string = 'testuser'): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${base}.${timestamp}.${randomString}@gmail.com`;
}

export function generateTestUserName(base: string = 'Test User'): string {
  const timestamp = Date.now();
  return `${base} ${timestamp}`;
}

export function waitForNetworkIdle(page: any, timeout: number = 5000): Promise<void> {
  return new Promise((resolve) => {
    let timeoutId: NodeJS.Timeout;
    
    const checkIdle = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(resolve, timeout);
    };
    
    page.on('request', checkIdle);
    page.on('response', checkIdle);
    
    // Initial check
    checkIdle();
  });
}

export async function takeScreenshot(page: any, testName: string): Promise<void> {
  const screenshotPath = `test-results/screenshots/${testName}-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot saved: ${screenshotPath}`);
}