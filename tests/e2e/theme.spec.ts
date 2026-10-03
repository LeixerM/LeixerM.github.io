import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'light' });

for (const colorScheme of ['light', 'dark'] as const) {
  test(`without a stored choice the default theme is dark (prefers ${colorScheme})`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await context.close();
  });
}

test('theme toggle switches the theme and persists it across reloads', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');

  const toggle = page.getByRole('button', { name: /tema claro/i });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(page.getByRole('button', { name: /tema oscuro/i })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: /tema oscuro/i }).click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');
});
