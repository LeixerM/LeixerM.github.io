import { expect, test } from '@playwright/test';

const anchors = [
  { label: 'Experiencia', id: 'experiencia' },
  { label: 'Habilidades', id: 'habilidades' },
  { label: 'Educación', id: 'educacion' },
  { label: 'Certificaciones', id: 'certificaciones' },
  { label: 'Contacto', id: 'contacto' },
];

test.use({ reducedMotion: 'reduce' });

test('nav links follow the page section order', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  const hrefs = await nav
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  const sectionLinks = hrefs.filter((href) => href !== '#inicio');
  expect(sectionLinks).toEqual([
    '#proyectos',
    '#experiencia',
    '#habilidades',
    '#educacion',
    '#certificaciones',
    '#contacto',
  ]);
});

for (const { label, id } of anchors) {
  test(`nav link "${label}" scrolls to #${id}`, async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Secciones' });
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`section#${id}`).getByRole('heading', { level: 2 })).toBeInViewport();
  });
}
