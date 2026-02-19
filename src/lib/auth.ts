import { Role, User } from "@/types/page";

const STORAGE_KEY = "cms_current_role";

const MOCK_USERS: Record<Role, User> = {
  viewer: { id: "user-viewer", name: "Viewer User", role: "viewer" },
  editor: { id: "user-editor", name: "Editor User", role: "editor" },
  admin: { id: "user-admin", name: "Admin User", role: "admin" },
  "super-admin": { id: "user-super", name: "Super Admin", role: "super-admin" },
};

export function setCurrentRole(role: Role): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, role);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem(STORAGE_KEY) as Role | null;
  if (!role || !MOCK_USERS[role]) return null;
  return MOCK_USERS[role];
}

export function getCurrentRole(): Role | undefined {
  if (typeof window === 'undefined') return undefined;
  return (localStorage.getItem(STORAGE_KEY) as Role) || undefined;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getAllRoles(): Role[] {
  return ["viewer", "editor", "admin", "super-admin"];
}
