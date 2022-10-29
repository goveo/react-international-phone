import { test } from '@playwright/test';

test('test in browser', async ({ page }) => {
  // load storybook
  await page.goto('http://localhost:6006');

  // keep browser open
  await page.pause();
});
