export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  jshshir: string;
  role: UserRole;
  avatarUrl?: string;
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  PARENT = 'parent',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export interface LoginRequest {
  jshshir: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
}