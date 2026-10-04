import { expect, test } from '@playwright/test';

const sections = [
  { id: 'experiencia', heading: 'Experiencia' },
  { id: 'habilidades', heading: 'Habilidades' },
  { id: 'educacion', heading: 'Educación' },
  { id: 'certificaciones', heading: 'Certificaciones' },
  { id: 'contacto', heading: 'Contacto' },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('hero shows the name as h1, a level-2 heading and the call to action buttons', async ({
  page,
}) => {
  const hero = page.locator('section#inicio');
  await expect(hero).toBeVisible();
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('Leixer Molina');
  await expect(hero.getByRole('heading', { level: 2 })).toBeVisible();
  await expect(hero.getByRole('link', { name: /contactar/i })).toBeVisible();
  await expect(hero.getByRole('link', { name: /descargar cv/i })).toBeVisible();
});

test('hero shows the profile photo, fully loaded', async ({ page }) => {
  const photo = page.locator('section#inicio').getByRole('img', { name: 'Foto de Leixer Molina' });
  await expect(photo).toBeVisible();
  await expect(photo).toHaveJSProperty('complete', true);
  const naturalWidth = await photo.evaluate((img: HTMLImageElement) => img.naturalWidth);
  expect(naturalWidth).toBeGreaterThan(0);
});

for (const { id, heading } of sections) {
  test(`section #${id} is rendered with its "${heading}" heading`, async ({ page }) => {
    const section = page.locator(`section#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { level: 2, name: heading })).toBeVisible();
  });
}

test('every experience entry is rendered', async ({ page }) => {
  const experience = page.locator('section#experiencia');
  const entries = experience.getByTestId('experience-entry');
  await expect(entries).toHaveCount(3);
  for (const company of ['SONDA', 'Manpower Group', 'SQA S.A.']) {
    await expect(experience.getByText(company, { exact: true })).toBeVisible();
  }
  await expect(entries.first()).toContainText('Presente');
});

const experienceSummaries = [
  {
    company: 'SONDA',
    summary:
      'Pruebas funcionales y de regresión en el sector salud, con automatización en Playwright para generar datos de prueba y validar reglas de negocio.',
    highlight: 'Pruebas orientadas a incapacidades médicas y contratos de afiliación EPS.',
  },
  {
    company: 'Manpower Group',
    summary:
      'Automatización de pruebas con Serenity BDD, Cucumber y Jenkins para transferencias internacionales y créditos en app móvil y web, con datos de prueba vía SQL.',
    highlight: 'Automatización con Serenity BDD, Java, Cucumber y Jenkins.',
  },
  {
    company: 'SQA S.A.',
    summary:
      'Pruebas funcionales, de integración y de servicios REST/SOAP para banca y telecomunicaciones (Dale!, Movistar), con SQL, Jira y AWS DynamoDB.',
    highlight: 'Participación en equipos ágiles bajo Scrum.',
  },
];

test('each experience entry shows its summary and tech tags, not the highlights list', async ({
  page,
}) => {
  const entries = page.locator('section#experiencia').getByTestId('experience-entry');
  await expect(entries).toHaveCount(experienceSummaries.length);
  for (const [index, { company, summary, highlight }] of experienceSummaries.entries()) {
    const entry = entries.nth(index);
    await expect(entry).toContainText(company);
    await expect(entry.getByText(summary, { exact: true })).toBeVisible();
    await expect(entry.getByRole('list', { name: 'Tecnologías' })).toBeVisible();
    await expect(entry).not.toContainText(highlight);
    // The only list items allowed inside a card are the tech tags.
    await expect(entry.locator('li:not([aria-label="Tecnologías"] > li)')).toHaveCount(0);
  }
});

test('education lists three entries', async ({ page }) => {
  await expect(page.locator('section#educacion').getByTestId('education-entry')).toHaveCount(3);
});

test('certifications lists exactly three entries', async ({ page }) => {
  const certifications = page.locator('section#certificaciones').getByTestId('certification');
  await expect(certifications).toHaveCount(3);
  await expect(certifications.first()).toContainText('ISTQB');
});

test('skills show technical, professional and personal groups', async ({ page }) => {
  const skills = page.locator('section#habilidades');
  for (const group of ['Técnicas', 'Profesionales', 'Personales']) {
    await expect(skills.getByRole('heading', { level: 3, name: group })).toBeVisible();
  }
  await expect(skills.getByText('Playwright', { exact: true })).toBeVisible();
});

test('contact section exposes email, phone, LinkedIn and GitHub links', async ({ page }) => {
  const contact = page.locator('section#contacto');
  await expect(contact.locator('a[href="mailto:Leixer.gmv@hotmail.com"]')).toBeVisible();
  await expect(contact.locator('a[href="tel:+573183687791"]')).toBeVisible();
  await expect(
    contact.locator('a[href="https://www.linkedin.com/in/leixer-molina/"]'),
  ).toBeVisible();
  await expect(contact.locator('a[href="https://github.com/LeixerM"]')).toBeVisible();
});
