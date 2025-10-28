import { test, expect } from "@playwright/test";
import { AdminPage } from "../pages/AdminPage";

function generateUniqueEmail(base: string) {
  const timestamp = Date.now();
  return `${base}+${timestamp}@gmail.com`;
}

test.describe("Task Admin Dashboard tests", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await page.goto("https://appv2.ezyscribe.com/admin/dashboard/users");
    await expect(page.getByRole('button', { name: 'Add a user' })).toBeVisible({ timeout: 15000 });
  });

  test("TP001 - role filter", async () => {
    await adminPage.rolesFilter("Admin");
  });

  test("TP002 - email search", async () => {
    const resultsCount = await adminPage.searchEmail("gmail.com");
    expect(resultsCount).toBeGreaterThan(0);
  });

  test("TP003 - add user", async () => {
    const uniqueEmail = generateUniqueEmail("testuser");
    await adminPage.addUser({
      name: "Test User",
      email: uniqueEmail,
      password: "Secure@123",
      role: "Admin",
      company: "Pennhealth",
    });
    const resultsCount = await adminPage.searchEmail(uniqueEmail);
    expect(resultsCount).toBeGreaterThan(0);
  });

  test("TP004 - add user cancel", async () => {
    const uniqueEmail = generateUniqueEmail("canceluser");
    await adminPage.addUser({
      name: "Cancel User",
      email: uniqueEmail,
      password: "Secure@123",
      role: "Scribe",
      cancel: true,
    });
    const resultsCount = await adminPage.searchEmail(uniqueEmail);
    expect(resultsCount).toBe(0);
  });

  test("TP005 - create user and search with same email", async () => {
    console.log("🧪 Starting TP005 - Basic create and search test");
    const testPassed = await adminPage.createAndVerifyUser();
    expect(testPassed).toBe(true);
    console.log("🎉 TP005 - Test completed successfully");
  });

  test("TP006 - edit user role", async () => {
    console.log("🧪 Starting TP006 - Edit user role test");
    const testPassed = await adminPage.createUserAndUpdateRole();
    expect(testPassed).toBe(true);
    console.log("🎉 TP006 - Test completed successfully");
  });

  test("TP007 - delete user", async () => {
    console.log("🧪 Starting TP007 - Delete user test");
    const testPassed = await adminPage.createAndDeleteUser();
    expect(testPassed).toBe(true);
    console.log("🎉 TP007 - Test completed successfully");
  });
});