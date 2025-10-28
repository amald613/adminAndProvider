import { Page, Locator, expect } from "@playwright/test";

interface AddUserOptions {
  name: string;
  email: string;
  password: string;
  role: string;
  company?: string;
  cancel?: boolean;
}

export class AdminPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly themeButton: Locator;
  readonly searchInput: Locator;
  readonly roleFilter: Locator;
  readonly addUserButton: Locator;
  readonly emailCol: Locator;
  readonly tableRows: Locator;
  readonly roleCol: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole("textbox", { name: "email" });
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole("button", { name: "submit" });
    this.themeButton = page.getByRole("button", { name: "Toggle theme" });
    this.searchInput = page.getByRole("textbox", { name: "Search email..." });
    this.roleFilter = page.getByRole("combobox");
    this.addUserButton = page.getByRole("button", { name: "Add a user" });
    this.emailCol = page.locator("//tbody/tr/td[1]");
    this.tableRows = page.locator("//tbody/tr");
    this.roleCol = page.locator("//tbody/tr/td[4]");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async rolesFilter(roleName: string, maxRetries = 3) {
    console.log(`Filtering by role: ${roleName}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to filter by role: ${roleName}`);
        await expect(this.roleFilter).toBeEnabled({ timeout: 10000 });
        await this.roleFilter.click({ timeout: 10000 });

        const option = this.page.getByRole("option", { name: roleName, exact: true });
        await expect(option.first()).toBeVisible({ timeout: 5000 });
        await option.first().click();

        await this.page.waitForTimeout(3000);

        const allRoles = await this.roleCol.allTextContents();
        const filteredRoles = allRoles.filter(role => role && role.trim() !== "");

        if (filteredRoles.length === 0 && attempt < maxRetries) {
          console.log(`No results found, retrying...`);
          continue;
        }

        if (filteredRoles.length === 0) {
          throw new Error(`❌ No role values found after filtering by "${roleName}"`);
        }

        let allMatch = true;
        for (const role of filteredRoles) {
          if (!role.includes(roleName)) {
            console.log(`❌ Mismatch found: Row contains "${role}" instead of "${roleName}"`);
            allMatch = false;
            break;
          }
        }

        if (!allMatch && attempt < maxRetries) {
          console.log(`Role mismatch detected, retrying...`);
          continue;
        }

        if (!allMatch) {
          throw new Error(`❌ Not all rows match the filter "${roleName}"`);
        }

        console.log(`✅ All rows correctly filtered by role: ${roleName}`);
        return;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Attempt ${attempt} failed: ${errorMessage}`);

        if (attempt === maxRetries) {
          throw error;
        }
        await this.page.waitForTimeout(2000);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async searchEmail(emailKeyword: string, maxRetries = 2): Promise<number> {
    console.log(`Searching email containing: "${emailKeyword}"`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.searchInput.clear({ timeout: 5000 });
        await this.searchInput.fill(emailKeyword, { timeout: 5000 });
        await this.page.waitForTimeout(2000);
        const rowsCount = await this.tableRows.count();
        console.log(`🔍 Found ${rowsCount} row(s) for "${emailKeyword}"`);
        return rowsCount;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Attempt ${attempt} to search email failed: ${errorMessage}`);
        if (attempt === maxRetries) {
          throw error;
        }
        await this.page.waitForTimeout(1000);
      }
    }
    return 0;
  }

  async addUser({ name, email, password, role, company, cancel }: AddUserOptions, maxRetries = 3) {
    console.log(`Adding user: ${name}, email: ${email}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to add user: ${name}`);
        await expect(this.addUserButton).toBeEnabled({ timeout: 10000 });
        await this.addUserButton.click({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        await this.page.getByRole("textbox", { name: "Name" }).fill(name);
        await this.page.getByRole("textbox", { name: "Email" }).fill(email);
        await this.page.getByRole("textbox", { name: "Password" }).fill(password);

        const roleCombobox = this.page.getByRole("combobox", { name: "Role" });
        await expect(roleCombobox).toBeEnabled({ timeout: 5000 });
        await roleCombobox.click();
        const roleOption = this.page.getByRole("option", { name: role, exact: true });
        await expect(roleOption).toBeVisible({ timeout: 5000 });
        await roleOption.click();

        if (company) {
          const companyCombobox = this.page.getByRole("combobox", { name: "Select with search and button" });
          await expect(companyCombobox).toBeEnabled({ timeout: 5000 });
          await companyCombobox.click();
          const companyOption = this.page.getByRole("option", { name: company });
          await expect(companyOption).toBeVisible({ timeout: 5000 });
          await companyOption.click();
        }

        if (cancel) {
          const cancelButton = this.page.getByRole("button", { name: "Cancel" });
          await expect(cancelButton).toBeEnabled({ timeout: 5000 });
          await cancelButton.click();
          console.log(`❌ User creation canceled`);
        } else {
          const createButton = this.page.getByRole("button", { name: "Create User" });
          await expect(createButton).toBeEnabled({ timeout: 5000 });
          await createButton.click();
          console.log(`✅ User "${name}" created successfully`);
          await this.page.waitForTimeout(3000);
        }

        return;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`Attempt ${attempt} to add user failed: ${errorMessage}`);
        if (attempt === maxRetries) {
          throw error;
        }
        await this.page.waitForTimeout(2000);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async createAndVerifyUser() {
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@gmail.com`;
    const testName = `Test User ${timestamp}`;
    console.log(`🧪 Testing with email: ${testEmail}`);
    await this.addUser({
      name: testName,
      email: testEmail,
      password: "Test@123",
      role: "Scribe",
      company: "Pennhealth",
    });
    const resultsCount = await this.searchEmail(testEmail);
    if (resultsCount > 0) {
      console.log(`✅ TEST PASSED: Found user with email "${testEmail}"`);
      return true;
    } else {
      console.log(`❌ TEST FAILED: No user found with email "${testEmail}"`);
      return false;
    }
  }

  async createAndDeleteUser() {
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@gmail.com`;
    const testName = `Test User ${timestamp}`;
    console.log(`🧪 Starting TP007 - Create and delete user test`);
    console.log(`🧪 Testing with email: ${testEmail}`);
    await this.addUser({
      name: testName,
      email: testEmail,
      password: "Test@123",
      role: "Scribe",
      company: "Pennhealth",
    });
    const initialResults = await this.searchEmail(testEmail);
    console.log(`📋 Initial search results: ${initialResults} user(s) found`);
    if (initialResults === 0) {
      console.log(`❌ User creation failed - no user found`);
      return false;
    }
    await this.deleteUserWithoutRefresh(testEmail);
    await this.page.reload();
    await this.page.waitForTimeout(2000);
    const finalResults = await this.searchEmail(testEmail);
    console.log(`📋 Final search results after deletion: ${finalResults} user(s) found`);
    const testPassed = initialResults === 1 && finalResults === 0;
    if (testPassed) {
      console.log(`✅ TP007 PASSED: User deletion successful`);
      console.log(`   Before deletion: ${initialResults} user → After deletion: ${finalResults} users`);
    } else {
      console.log(`❌ TP007 FAILED: User deletion verification failed`);
      console.log(`   Expected: 1 user before → 0 users after`);
      console.log(`   Actual: ${initialResults} user before → ${finalResults} users after`);
    }
    return testPassed;
  }

  async deleteUserWithoutRefresh(email: string) {
    console.log(`🗑️ Attempting to delete user: ${email}`);
    await this.searchEmail(email);
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Open menu' }).first().click();
    await this.page.getByText('Delete User').click();
    await this.page.getByRole('button', { name: 'Delete User' }).click();
    await this.page.waitForTimeout(3000);
    console.log(`✅ User deletion completed for: ${email}`);
  }

  async updateUserRole(email: string, newRole: string) {
    console.log(`🔄 Updating role for user: ${email} to: ${newRole}`);
    await this.searchEmail(email);
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('button', { name: 'Open menu' }).first().click();
    await this.page.getByText('Update Role').click();
    await this.page.getByRole('combobox', { name: 'Select Role' }).click();
    await this.page.getByRole('option', { name: newRole, exact: true }).click();
    await this.page.getByRole('button', { name: 'Update Role' }).click();
    await this.page.waitForTimeout(3000);
    console.log(`✅ Role updated to: ${newRole}`);
  }

  async getUserRole(email: string): Promise<string> {
    console.log(`🔍 Getting role for user: ${email}`);
    await this.searchEmail(email);
    await this.page.waitForTimeout(2000);
    const roleCell = this.page.locator("//tbody/tr/td[4]").first();
    await expect(roleCell).toBeVisible();
    const roleText = await roleCell.textContent();
    const trimmedRole = roleText?.trim() || '';
    console.log(`📋 Current role: ${trimmedRole}`);
    return trimmedRole;
  }

  async createUserAndUpdateRole() {
    const timestamp = Date.now();
    const testEmail = `testuser${timestamp}@gmail.com`;
    const testName = `Test User ${timestamp}`;
    console.log(`🧪 Starting TP006 - Create user and update role test`);
    console.log(`🧪 Testing with email: ${testEmail}`);
    await this.addUser({
      name: testName,
      email: testEmail,
      password: "Test@123",
      role: "Scribe",
      company: "Pennhealth",
    });
    const initialRole = await this.getUserRole(testEmail);
    console.log(`📋 Initial role: ${initialRole}`);
    await this.updateUserRole(testEmail, "Admin");
    const updatedRole = await this.getUserRole(testEmail);
    console.log(`📋 Updated role: ${updatedRole}`);
    await this.updateUserRole(testEmail, "Scribe");
    const finalRole = await this.getUserRole(testEmail);
    console.log(`📋 Final role: ${finalRole}`);
    const testPassed = initialRole === "Scribe" && updatedRole === "Admin" && finalRole === "Scribe";
    if (testPassed) {
      console.log(`✅ TP006 PASSED: Role update workflow successful`);
      console.log(`   Initial: ${initialRole} → Updated: ${updatedRole} → Final: ${finalRole}`);
    } else {
      console.log(`❌ TP006 FAILED: Role update workflow failed`);
      console.log(`   Expected: Scribe → Admin → Scribe`);
      console.log(`   Actual: ${initialRole} → ${updatedRole} → ${finalRole}`);
    }
    return testPassed;
  }
}
