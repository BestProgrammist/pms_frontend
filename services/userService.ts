// services/userService.ts
import apiClient from '@/lib/api/client';
import { 
  User, 
  CreateUserDto, 
  UpdateUserDto, 
  UsersResponse, 
  UsersQueryParams, 
  UserStatus,
  UserRole
} from '@/types/user';

export const userApi = {
  // Barcha foydalanuvchilarni olish
  getAll: async (params?: UsersQueryParams): Promise<UsersResponse> => {
    console.log("params", params);
    
    const response = await apiClient.get<UsersResponse>('/users', { params });
    console.log(response.data);
    
    return response.data;
  },

  // Bitta foydalanuvchini olish
  getOne: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // Foydalanuvchi yaratish
  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  // Foydalanuvchini yangilash
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  // Foydalanuvchi statusini yangilash
  updateStatus: async (id: string, status: UserStatus): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}/status`, { status });
    return response.data;
  },

  // Foydalanuvchini o'chirish
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Rol bo'yicha foydalanuvchilarni olish
  getByRole: async (role: UserRole): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/by-role', { params: { role } });
    return response.data;
  },

  // Profilni olish
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  // Profil fieldini olish
  getProfileField: async (field: string): Promise<any> => {
    const response = await apiClient.get(`/users/profile/${field}`);
    return response.data;
  },
};