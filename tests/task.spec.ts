import { test, expect } from "@playwright/test";
import TaskPage from "../pages/TaskPage";
import { logInfo } from "../utils/logger";

test.describe("Task Dashboard Tests", () => {
  let taskPage: TaskPage;

  test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
    await page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.themeButton.waitFor({ state: 'visible', timeout: 15000 });
  });

  test("TP001 - Toggle Theme (Light <-> Dark)", async () => {
    logInfo("Test started: Toggle Theme (Light <-> Dark)");
    // await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.changeTheme();
    logInfo("Theme toggled successfully");
  });

  test("TP002 - Search Task by ID", async () => {
    logInfo("Test started: Search Task by ID");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.serachFilter();
    logInfo("Task search completed successfully");
  });

  test("TP003 - Apply Status Filter - Completed", async () => {
    logInfo("Test started: Apply Status Filter - Completed");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.selectStatusFilter("Completed");
    logInfo("Status filter applied successfully");
  });

  test("TP004 - Apply Priority Filter - Low", async () => {
    logInfo("Test started: Apply Priority Filter - Low");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.selectPriorityFilter("Low");
    logInfo("Priority filter applied successfully");
  });

  test("TP005 - Sort Task IDs Ascending", async () => {
    logInfo("Test started: Sort Task IDs Ascending");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.sort();
    logInfo("Task IDs sorted successfully");
  });

  test("TP006 - Filter by Upload Date", async () => {
    logInfo("Test started: Filter by Upload Date");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.clickResetButton();
    await taskPage.clickUploadDateButton();
    await taskPage.selectFromDate('Aug', '2024', '15');
    await taskPage.selectToDate('Sep', '2025', '15');
    logInfo("Upload date filter applied successfully");
  });

  test("TP007 - Toggle Column Visibility (View Filter)", async () => {
    logInfo("Test started: Toggle Column Visibility (View Filter)");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.viewFilter('taskNo');
    logInfo("Column visibility toggled successfully");
  });

  test("TP008 - Search Task by invalid ID", async () => {
    logInfo("Test started: Search Task by ID");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.searchFilterInvalid("1231454451");
    logInfo("Task search completed successfully");
  });

  test('TP009 - Filter Status: Completed or In Progress', async () => {
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.selectStatusFilterMultiple(['Completed', 'In Progress']);
  });

  test('TP010 - Filter Priority: Medium or High', async () => {
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.selectPriorityFilterExcludeMultiple(['Medium', 'High']);
  });

  test('TP011 - Filter by Status Completed and Priority Medium', async () => {
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.filterByStatusAndPriority('Completed', 'Medium');
  });

  test("TP012 - Sort Task IDs Descending", async () => {
    logInfo("Test started: Sort Task IDs Ascending");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.sortDescending();
    logInfo("Task IDs sorted successfully");
  });

  test("TP013 - Theme persistence after refresh", async () => {
    logInfo("Test started: Theme persistence after refresh");
    await taskPage.page.goto("https://appv2.ezyscribe.com/tasks", { waitUntil: "networkidle" });
    await taskPage.verifyThemePersistence();
    logInfo("Theme persisted successfully after refresh");
  });


});