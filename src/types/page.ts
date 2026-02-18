export type Role = 'viewer' | 'editor' | 'admin' | 'super-admin';

export type PageStatus = 'draft' | 'published';

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: PageStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}
