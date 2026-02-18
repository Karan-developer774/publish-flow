import { requireRole, getRolesAtOrAbove, RBACError } from '@/lib/rbac';
import * as db from '@/lib/db';
import { ApiResponse, Page, Role } from '@/types/page';

/**
 * Simulates server-side API route handlers.
 * Each function enforces RBAC before performing operations.
 */

/** POST /api/pages — Create a draft page (editor+) */
export function createDraftPage(
  userRole: Role | undefined,
  title: string,
  content: string,
  slug: string
): ApiResponse<Page> {
  try {
    requireRole(userRole, getRolesAtOrAbove('editor'));
    const page = db.createPage({
      title,
      content,
      slug,
      status: 'draft',
      createdBy: userRole!,
    });
    return { success: true, data: page, status: 201 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** PUT /api/pages/:id — Update a draft page (editor+) */
export function updateDraftPage(
  userRole: Role | undefined,
  pageId: string,
  updates: { title?: string; content?: string }
): ApiResponse<Page> {
  try {
    requireRole(userRole, getRolesAtOrAbove('editor'));
    const page = db.updatePage(pageId, updates);
    if (!page) return { success: false, error: 'Page not found', status: 404 };
    return { success: true, data: page, status: 200 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** POST /api/pages/:id/publish — Publish a page (admin+) */
export function publishPage(
  userRole: Role | undefined,
  pageId: string
): ApiResponse<Page> {
  try {
    requireRole(userRole, getRolesAtOrAbove('admin'));
    const page = db.updatePage(pageId, { status: 'published' });
    if (!page) return { success: false, error: 'Page not found', status: 404 };
    return { success: true, data: page, status: 200 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** POST /api/pages/:id/unpublish — Unpublish a page (admin+) */
export function unpublishPage(
  userRole: Role | undefined,
  pageId: string
): ApiResponse<Page> {
  try {
    requireRole(userRole, getRolesAtOrAbove('admin'));
    const page = db.updatePage(pageId, { status: 'draft' });
    if (!page) return { success: false, error: 'Page not found', status: 404 };
    return { success: true, data: page, status: 200 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** GET /api/pages/:slug — Get a page by slug (respects role visibility) */
export function getPage(
  userRole: Role | undefined,
  slug: string
): ApiResponse<Page> {
  try {
    const page = db.getPageBySlug(slug);
    if (!page) return { success: false, error: 'Page not found', status: 404 };

    // Viewers can only see published pages
    if (page.status === 'draft') {
      requireRole(userRole, getRolesAtOrAbove('editor'));
    }

    return { success: true, data: page, status: 200 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** GET /api/pages — List pages (filtered by role) */
export function listPages(userRole: Role | undefined): ApiResponse<Page[]> {
  try {
    if (!userRole) {
      // Unauthenticated: only published
      return { success: true, data: db.getPublishedPages(), status: 200 };
    }
    if (userRole === 'viewer') {
      return { success: true, data: db.getPublishedPages(), status: 200 };
    }
    // editor+ can see all pages
    return { success: true, data: db.getAllPages(), status: 200 };
  } catch {
    return { success: false, error: 'Internal error', status: 500 };
  }
}

/** DELETE /api/pages/:id — Delete a page (super-admin only) */
export function deletePageById(
  userRole: Role | undefined,
  pageId: string
): ApiResponse<void> {
  try {
    requireRole(userRole, ['super-admin']);
    const deleted = db.deletePage(pageId);
    if (!deleted) return { success: false, error: 'Page not found', status: 404 };
    return { success: true, status: 200 };
  } catch (e) {
    if (e instanceof RBACError) return { success: false, error: e.message, status: e.status };
    return { success: false, error: 'Internal error', status: 500 };
  }
}
