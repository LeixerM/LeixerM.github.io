import { expect, test } from '@playwright/test';

const CV_PATH = '/cv/leixer-molina-cv.pdf';

test('page declares Spanish language and SEO metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page).toHaveTitle(/Leixer Molina/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S{10,}/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Leixer/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /\S/);
});

test('CV download link points to the PDF and the file is served', async ({ page, request }) => {
  await page.goto('/');
  const links = page.locator(`a[href="${CV_PATH}"]`);
  await expect(links.first()).toBeVisible();
  await expect(links.first()).toHaveAttribute('download', /.*/);

  const response = await request.get(CV_PATH);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('page loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
