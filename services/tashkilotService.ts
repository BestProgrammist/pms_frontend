// services/tashkilotService.ts
import apiClient from '@/lib/api/client';
import { 
  Tashkilot, 
  CreateTashkilotDto, 
  UpdateTashkilotDto, 
  TashkilotlarResponse,
  TashkilotDropdownItem 
} from '@/types/tashkilot';

export const tashkilotApi = {
  // Barcha tashkilotlarni olish
  getAll: async (params?: any): Promise<TashkilotlarResponse> => {
    const response = await apiClient.get('/tashkilotlar', { params });
    return response.data;
  },

  // Bitta tashkilotni olish
  getOne: async (id: number): Promise<Tashkilot> => {
    const response = await apiClient.get(`/tashkilotlar/${id}`);
    return response.data;
  },

  // Kod bo'yicha tashkilotni olish
  getByKod: async (kod: string): Promise<Tashkilot> => {
    const response = await apiClient.get(`/tashkilotlar/kod/${kod}`);
    return response.data;
  },

  // Dropdown uchun tashkilotlar
  getDropdown: async (): Promise<TashkilotDropdownItem[]> => {
    const response = await apiClient.get('/tashkilotlar/dropdown');
    return response.data;
  },

  // Tashkilot yaratish
  create: async (data: CreateTashkilotDto): Promise<Tashkilot> => {
    const response = await apiClient.post('/tashkilotlar', data);
    return response.data;
  },

  // Tashkilot yangilash
  update: async (id: number, data: UpdateTashkilotDto): Promise<Tashkilot> => {
    const response = await apiClient.patch(`/tashkilotlar/${id}`, data);
    return response.data;
  },

  // Tashkilot o'chirish
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tashkilotlar/${id}`);
  },
};