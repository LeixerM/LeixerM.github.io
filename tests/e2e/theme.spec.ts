import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'light' });

test('initial theme follows prefers-color-scheme', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await context.close();
});

test('theme toggle switches the theme and persists it across reloads', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'light');

  const toggle = page.getByRole('button', { name: /tema oscuro/i });
  await toggle.click();
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: /tema claro/i })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'dark');

  await page.getByRole('button', { name: /tema claro/i }).click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});
