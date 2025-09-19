import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ScreenshotUtils } from "../utils/screenshot";
import { logger } from "../utils/logger";
import loginData from "../fixtures/users.json";

test.describe("Login Tests", () => {
  const MAX_RETRIES = 3;

  for (const data of loginData) {
    test(`Login Test - ${data.TCID}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      let attempt = 0;
      let lastError: Error | null = null;

      while (attempt < MAX_RETRIES) {
        attempt++;
        try {
          await loginPage.goto();
          logger.info(`[${data.TCID}] Attempt ${attempt}: Navigated to login page`);

          await loginPage.enterEmail(data.Email);
          await loginPage.enterPassword(data.Password);
          await loginPage.submit();
          logger.info(`[${data.TCID}] Attempt ${attempt}: Submitted login with email: ${data.Email}`);

          // Check for "Too many requests" - wait and retry
          const tooManyRequests = page.getByText('Too many requests. Please try');
          if (await tooManyRequests.isVisible().catch(() => false)) {
            logger.warn(`[${data.TCID}] Too many requests detected. Waiting 5 seconds before retry...`);
            await page.waitForTimeout(5000);
            continue;
          }

          // Normal assertions
          switch (data.ExpectedResult) {
            case "success_doctor":
            case "success_scribe":
              await expect(page).toHaveURL(/https:\/\/appv2\.ezyscribe\.com\/tasks/, { timeout: 30000 });
              logger.info(`[${data.TCID}] ✅ Login successful`);
              lastError = null; // passed, reset error
              break;

            case "emailError":
              const emailError = await loginPage.getEmailErrorMessage();
              expect(emailError).not.toBe("");
              break;

            case "passwordError":
              const passwordError = await loginPage.getPasswordErrorMessage();
              expect(passwordError).not.toBe("");
              break;

            case "combinedError":

              const combinedError = await loginPage.getCombinedErrorMessage();
              expect(combinedError).not.toBe("");
              break;
          }

          // test passed, exit retry loop
          break;

        } catch (err) {
          logger.error(`[${data.TCID}] ❌ Test failed on attempt ${attempt}: ${err.message}`);
          lastError = err as Error;
        }
      }

      // After all attempts, if still failed, take screenshot and throw error
      if (lastError) {
        await ScreenshotUtils.capture(page, `${data.TCID}_Failed_AllAttempts`);
        throw lastError;
      }
    });
  }
  test('TC014 - Forgot Password', async ({page})=>{
  const loginPage = new LoginPage(page);
  await loginPage.ForgotPassword("testprovid@gmail.com");

  })
  test('TC015 - Click Password Eye Button', async ({page})=>{
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.clickPasswordEyeButton("12345678");
  console.log(`Input password value is ${await loginPage.passwordInput.inputValue()}`);
  const inputType = await loginPage.passwordInput.getAttribute("type");
  console.log(`Password input type is: ${inputType}`);
  })
});