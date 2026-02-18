import { describe, it, expect, beforeEach } from 'vitest';
import { createDraftPage, publishPage, unpublishPage, getPage, deletePageById, updateDraftPage } from '@/api/pages';

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

describe('API - Create Draft Page', () => {
  it('editor can create a draft', () => {
    const res = createDraftPage('editor', 'Test', 'Content', 'test-page');
    expect(res.success).toBe(true);
    expect(res.status).toBe(201);
    expect(res.data?.status).toBe('draft');
  });

  it('viewer cannot create a draft', () => {
    const res = createDraftPage('viewer', 'Test', 'Content', 'test-page');
    expect(res.success).toBe(false);
    expect(res.status).toBe(403);
  });

  it('unauthenticated user cannot create a draft', () => {
    const res = createDraftPage(undefined, 'Test', 'Content', 'test-page');
    expect(res.success).toBe(false);
    expect(res.status).toBe(401);
  });
});

describe('API - Publish Page', () => {
  it('admin can publish a draft', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'test-page');
    const res = publishPage('admin', draft.data!.id);
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe('published');
  });

  it('editor cannot publish a page', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'test-page');
    const res = publishPage('editor', draft.data!.id);
    expect(res.success).toBe(false);
    expect(res.status).toBe(403);
  });

  it('super-admin can publish', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'test-page');
    const res = publishPage('super-admin', draft.data!.id);
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe('published');
  });
});

describe('API - Get Page (visibility)', () => {
  it('viewer can see published page', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'vis-test');
    publishPage('admin', draft.data!.id);
    const res = getPage('viewer', 'vis-test');
    expect(res.success).toBe(true);
  });

  it('viewer gets 403 on draft page', () => {
    createDraftPage('editor', 'Test', 'Content', 'draft-only');
    const res = getPage('viewer', 'draft-only');
    expect(res.success).toBe(false);
    expect(res.status).toBe(403);
  });

  it('editor can see draft page', () => {
    createDraftPage('editor', 'Test', 'Content', 'editor-draft');
    const res = getPage('editor', 'editor-draft');
    expect(res.success).toBe(true);
  });
});

describe('API - Unpublish Page', () => {
  it('admin can unpublish', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'unpub');
    publishPage('admin', draft.data!.id);
    const res = unpublishPage('admin', draft.data!.id);
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe('draft');
  });
});

describe('API - Delete Page', () => {
  it('super-admin can delete', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'del');
    const res = deletePageById('super-admin', draft.data!.id);
    expect(res.success).toBe(true);
  });

  it('admin cannot delete', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'del2');
    const res = deletePageById('admin', draft.data!.id);
    expect(res.success).toBe(false);
    expect(res.status).toBe(403);
  });
});

describe('API - Update Draft', () => {
  it('editor can update a draft', () => {
    const draft = createDraftPage('editor', 'Old', 'Old content', 'upd');
    const res = updateDraftPage('editor', draft.data!.id, { title: 'New Title' });
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe('New Title');
  });

  it('viewer cannot update', () => {
    const draft = createDraftPage('editor', 'Test', 'Content', 'upd2');
    const res = updateDraftPage('viewer', draft.data!.id, { title: 'Hacked' });
    expect(res.success).toBe(false);
    expect(res.status).toBe(403);
  });
});
