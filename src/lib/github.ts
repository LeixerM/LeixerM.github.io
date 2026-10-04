/**
 * Optional build-time enrichment from the public GitHub REST API (no token).
 * Every failure (disabled, network, timeout, non-2xx, rate limit, bad payload) resolves to `null`,
 * so the build never fails because of GitHub.
 *
 * Env:
 * - `PUBLIC_GITHUB_ENRICH=false` disables the requests entirely (used by the E2E suite).
 * - `GITHUB_API_BASE` overrides the API origin (useful to simulate an unreachable host).
 */

export interface RepoInfo {
  pushedAt: Date;
  language: string | null;
}

const TIMEOUT_MS = 4000;

function isEnabled(): boolean {
  return process.env.PUBLIC_GITHUB_ENRICH?.trim().toLowerCase() !== 'false';
}

function apiBase(): string {
  return (process.env.GITHUB_API_BASE ?? 'https://api.github.com').replace(/\/+$/, '');
}

/** Fetches `pushedAt` and primary `language` for `owner/name`, or `null` on any failure. */
export async function fetchRepoInfo(repo: string): Promise<RepoInfo | null> {
  if (!isEnabled()) return null;
  try {
    const response = await fetch(`${apiBase()}/repos/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'leixer-molina-portfolio-build',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (typeof data !== 'object' || data === null) return null;
    const { pushed_at: pushed, language } = data as Record<string, unknown>;
    if (typeof pushed !== 'string') return null;
    const pushedAt = new Date(pushed);
    if (Number.isNaN(pushedAt.getTime())) return null;
    return { pushedAt, language: typeof language === 'string' ? language : null };
  } catch {
    return null;
  }
}

const updatedFormat = new Intl.DateTimeFormat('es', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats a date as "octubre de 2026" for the "Actualizado …" label. */
export function formatUpdated(date: Date): string {
  return updatedFormat.format(date);
}
