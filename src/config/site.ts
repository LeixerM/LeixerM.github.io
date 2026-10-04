/** UI-level configuration (navigation labels and section ids). CV data lives in src/content. */
export const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'educacion', label: 'Educación' },
  { id: 'certificaciones', label: 'Certificaciones' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const cvPath = '/cv/leixer-molina-cv.pdf';

export const themeStorageKey = 'theme';
