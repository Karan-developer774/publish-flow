import { Role } from '@/types/page';

/**
 * Role hierarchy: super-admin > admin > editor > viewer
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  'viewer': 0,
  'editor': 1,
  'admin': 2,
  'super-admin': 3,
};

/**
 * Check if a user role is included in allowed roles.
 * Throws an error with 403 status if not authorized.
 */
export function requireRole(userRole: Role | undefined, allowedRoles: Role[]): void {
  if (!userRole) {
    throw new RBACError('Authentication required', 401);
  }
  if (!allowedRoles.includes(userRole)) {
    throw new RBACError(
      `Role '${userRole}' is not authorized. Required: ${allowedRoles.join(', ')}`,
      403
    );
  }
}

/**
 * Check if a role has at least the given minimum role level.
 */
export function hasMinRole(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * Get all roles that have at least the given minimum role level.
 */
export function getRolesAtOrAbove(minRole: Role): Role[] {
  const minLevel = ROLE_HIERARCHY[minRole];
  return (Object.entries(ROLE_HIERARCHY) as [Role, number][])
    .filter(([, level]) => level >= minLevel)
    .map(([role]) => role);
}

export class RBACError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'RBACError';
    this.status = status;
  }
}
