import { describe, it, expect } from 'vitest';
import { requireRole, hasMinRole, getRolesAtOrAbove, RBACError } from '@/lib/rbac';

describe('RBAC - requireRole', () => {
  it('throws 401 when no role provided', () => {
    expect(() => requireRole(undefined, ['editor'])).toThrow(RBACError);
    try {
      requireRole(undefined, ['editor']);
    } catch (e) {
      expect((e as RBACError).status).toBe(401);
    }
  });

  it('throws 403 when role is not in allowed list', () => {
    expect(() => requireRole('viewer', ['editor', 'admin'])).toThrow(RBACError);
    try {
      requireRole('viewer', ['editor', 'admin']);
    } catch (e) {
      expect((e as RBACError).status).toBe(403);
    }
  });

  it('does not throw when role is allowed', () => {
    expect(() => requireRole('editor', ['editor', 'admin'])).not.toThrow();
    expect(() => requireRole('admin', ['admin', 'super-admin'])).not.toThrow();
    expect(() => requireRole('super-admin', ['super-admin'])).not.toThrow();
  });
});

describe('RBAC - hasMinRole', () => {
  it('viewer has min role viewer', () => {
    expect(hasMinRole('viewer', 'viewer')).toBe(true);
  });

  it('viewer does not have min role editor', () => {
    expect(hasMinRole('viewer', 'editor')).toBe(false);
  });

  it('admin has min role editor', () => {
    expect(hasMinRole('admin', 'editor')).toBe(true);
  });

  it('super-admin has min role of everything', () => {
    expect(hasMinRole('super-admin', 'viewer')).toBe(true);
    expect(hasMinRole('super-admin', 'editor')).toBe(true);
    expect(hasMinRole('super-admin', 'admin')).toBe(true);
    expect(hasMinRole('super-admin', 'super-admin')).toBe(true);
  });
});

describe('RBAC - getRolesAtOrAbove', () => {
  it('returns all roles at or above editor', () => {
    const roles = getRolesAtOrAbove('editor');
    expect(roles).toContain('editor');
    expect(roles).toContain('admin');
    expect(roles).toContain('super-admin');
    expect(roles).not.toContain('viewer');
  });

  it('returns only admin+ for admin', () => {
    const roles = getRolesAtOrAbove('admin');
    expect(roles).toContain('admin');
    expect(roles).toContain('super-admin');
    expect(roles).not.toContain('editor');
  });
});
