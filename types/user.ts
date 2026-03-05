// types/user.ts
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  GLAV_INGEENER = 'glav_ingeener',
  MECHANIC = 'mechanic',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export interface User {
  id: string;
  email: string;
  username: string;
  jshshir: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

export interface CreateUserDto {
  email: string;
  username: string;
  jshshir: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  role: UserRole;
  status?: UserStatus;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export interface UserResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface loginUser {
  jshshir: string;
  password: string;
}

export interface UsersQueryParams {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// export interface User {
//   id: number;
//   username: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   jshshir: string;
//   role: UserRole;
//   avatarUrl?: string;
// }

// export enum UserRole {
//   STUDENT = 'student',
//   TEACHER = 'teacher',
//   ADMIN = 'admin',
//   PARENT = 'parent',
//   GUEST = 'guest',
// }

// export enum UserStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
//   BLOCKED = 'blocked',
//   PENDING = 'pending',
// }

// export interface LoginRequest {
//   jshshir: string;
//   password: string;
// }

// export interface LoginResponse {
//   user: User;
//   access_token: string;
//   refresh_token?: string;
// }