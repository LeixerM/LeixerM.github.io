import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const profile = defineCollection({
  loader: file('src/content/profile.json'),
  schema: z.object({
    name: z.string(),
    displayName: z.string(),
    initials: z.string().max(3),
    title: z.string(),
    role: z.string(),
    summary: z.string(),
    location: z.string().optional(),
    contact: z.object({
      phone: z.string(),
      email: z.email(),
      linkedin: z.url(),
      github: z.url(),
    }),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
    seo: z.object({ title: z.string(), description: z.string().max(160) }),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    project: z.string(),
    client: z.string().optional(),
    start: z.coerce.date(),
    /** `null` means the position is current. */
    end: z.coerce.date().nullable().default(null),
    order: z.number().int(),
    highlights: z.array(z.string()).min(1),
    tech: z.array(z.string()).default([]),
  }),
});

const education = defineCollection({
  loader: file('src/content/education.json'),
  schema: z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number().int(),
    order: z.number().int(),
  }),
});

const certifications = defineCollection({
  loader: file('src/content/certifications.json'),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.number().int(),
    order: z.number().int(),
  }),
});

const skills = defineCollection({
  loader: file('src/content/skills.json'),
  schema: z.object({
    label: z.string(),
    items: z.array(z.string()).min(1),
    order: z.number().int(),
  }),
});

export const collections = { profile, experience, education, certifications, skills };
