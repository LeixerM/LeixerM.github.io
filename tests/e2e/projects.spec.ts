import { expect, test } from '@playwright/test';

/** Expected projects, in collection order. */
const projects = [
  { repo: 'Proyecto_DemoBlaze_E2E', tests: 23 },
  { repo: 'Serenity_Calendar_Leixer', tests: 13 },
  { repo: 'Serenity_Ejemplo2_OrangeHRM', tests: 6 },
];

test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('projects section is rendered with its "Proyectos" heading', async ({ page }) => {
  const section = page.locator('section#proyectos');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();
  await expect(section.getByRole('heading', { level: 2, name: 'Proyectos' })).toBeVisible();
});

test('nav link "Proyectos" scrolls to #proyectos', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  await nav.getByRole('link', { name: 'Proyectos', exact: true }).click();
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(page.locator('section#proyectos').getByRole('heading', { level: 2 })).toBeInViewport();
});

test('projects section sits between Experiencia and Habilidades', async ({ page }) => {
  const ids = await page.locator('main section[id]').evaluateAll((nodes) => nodes.map((n) => n.id));
  const index = ids.indexOf('proyectos');
  expect(index).toBeGreaterThan(-1);
  expect(ids[index - 1]).toBe('experiencia');
  expect(ids[index + 1]).toBe('habilidades');
});

test('exactly three project cards render in collection order', async ({ page }) => {
  const cards = page.locator('section#proyectos').getByTestId('project-card');
  await expect(cards).toHaveCount(projects.length);
  for (const [index, project] of projects.entries()) {
    await expect(cards.nth(index)).toHaveAttribute('data-repo', `LeixerM/${project.repo}`);
    await expect(cards.nth(index).getByRole('heading', { level: 3 })).toBeVisible();
  }
});

test('each card links to its code and its live report', async ({ page }) => {
  const cards = page.locator('section#proyectos').getByTestId('project-card');
  for (const [index, project] of projects.entries()) {
    const card = cards.nth(index);
    await expect(card.getByRole('link', { name: /código/i })).toHaveAttribute(
      'href',
      `https://github.com/LeixerM/${project.repo}`,
    );
    await expect(card.getByRole('link', { name: /reporte/i })).toHaveAttribute(
      'href',
      new RegExp(`^https://leixerm\\.github\\.io/${project.repo}/?$`),
    );
  }
});

test('project external links open in a new tab safely', async ({ page }) => {
  const links = page.locator('section#proyectos').getByTestId('project-card').locator('a[href^="http"]');
  expect(await links.count()).toBeGreaterThanOrEqual(projects.length * 2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    const rel = (await link.getAttribute('rel')) ?? '';
    expect(rel.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
  }
});

test('each card shows its automated test count', async ({ page }) => {
  const cards = page.locator('section#proyectos').getByTestId('project-card');
  for (const [index, project] of projects.entries()) {
    await expect(cards.nth(index)).toContainText(`${project.tests} pruebas automatizadas`);
  }
});
