import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly combinedError: Locator;
  readonly doctorDashboardText: Locator;
  readonly scribeDashboardText: Locator;
  readonly forgotPassword: Locator;
  readonly forgotPasswordMessage: Locator;
  readonly passwordEyeButton: Locator

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.locator('input[name="password"]');
    this.passwordEyeButton = page.locator('[id="«Riqhtrlb»-form-item"]').getByRole('button');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    // Field-specific error messages
    this.emailError = page.getByText('Invalid email format');
    this.passwordError = page.getByText('Password must be at least 8');

    // Combined error message when both fields are valid format but credentials are incorrect
    this.combinedError = page.getByText('Invalid email or password');


    // this.doctorDashboardText = page.getByRole('button', { name: 'Record' });
    this.doctorDashboardText = page.getByRole('heading', { name: 'Application error: a server-' });

    this.forgotPassword = page.getByText('Forgot your password?');
    this.forgotPasswordMessage = page.getByText('Check your email for the reset password link');


  }

  async goto() {
    await this.page.goto("https://appv2.ezyscribe.com");
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }
  async clickPasswordEyeButton(password: string){
    await this.passwordInput.fill(password);
    await this.passwordEyeButton.click();
    expect(this.passwordInput).toHaveValue(password);
  }


  // Error message getters
  async getEmailErrorMessage() {
    return await this.emailError.innerText().catch(() => "");
  }

  async getPasswordErrorMessage() {
    return await this.passwordError.innerText().catch(() => "");
  }

 async getCombinedErrorMessage() {
  await this.page.waitForLoadState("networkidle");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await expect(this.combinedError).toBeVisible({ timeout: 5000 });
      return await this.combinedError.innerText();
    } catch (err) {
      if (attempt === 0) {
        // Retry once
        await this.submitButton.click();
        await this.page.waitForTimeout(1000); // small buffer
      } else {
        throw err; // give up after 2nd failure
      }
    }
  }

  return "";
}



  async isDoctorDashboardVisible() {
    return this.doctorDashboardText.isVisible();
  }

  async isScribeDashboardVisible() {
    return this.doctorDashboardText.isVisible();
  }

  async ForgotPassword(email:string){
    await this.page.goto('https://appv2.ezyscribe.com');
    await this.page.waitForLoadState("networkidle");
    await this.emailInput.fill(email);
    await this.forgotPassword.click();
    await expect(this.forgotPasswordMessage).toBeVisible();
  }
}
