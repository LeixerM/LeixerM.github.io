import { getEntry } from 'astro:content';

/** Loads the single profile entry; fails the build loudly if it is missing. */
export async function getProfile() {
  const profile = await getEntry('profile', 'main');
  if (!profile) throw new Error('Missing profile entry "main" in src/content/profile.json');
  return profile.data;
}

/** Sorts collection entries by their `order` field. */
export function byOrder<T extends { data: { order: number } }>(a: T, b: T): number {
  return a.data.order - b.data.order;
}
