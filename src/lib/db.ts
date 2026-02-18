import { Page } from '@/types/page';

/**
 * In-memory page store. Simulates a database.
 * Data persists via localStorage for demo purposes.
 */
const STORAGE_KEY = 'cms_pages';

function loadPages(): Page[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePages(pages: Page[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export function getAllPages(): Page[] {
  return loadPages();
}

export function getPageById(id: string): Page | undefined {
  return loadPages().find((p) => p.id === id);
}

export function getPageBySlug(slug: string): Page | undefined {
  return loadPages().find((p) => p.slug === slug);
}

export function createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page {
  const pages = loadPages();
  const newPage: Page = {
    ...page,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  pages.push(newPage);
  savePages(pages);
  return newPage;
}

export function updatePage(id: string, updates: Partial<Pick<Page, 'title' | 'content' | 'status'>>): Page | undefined {
  const pages = loadPages();
  const idx = pages.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  pages[idx] = { ...pages[idx], ...updates, updatedAt: new Date().toISOString() };
  savePages(pages);
  return pages[idx];
}

export function deletePage(id: string): boolean {
  const pages = loadPages();
  const filtered = pages.filter((p) => p.id !== id);
  if (filtered.length === pages.length) return false;
  savePages(filtered);
  return true;
}

export function getPublishedPages(): Page[] {
  return loadPages().filter((p) => p.status === 'published');
}

export function getDraftPages(): Page[] {
  return loadPages().filter((p) => p.status === 'draft');
}
