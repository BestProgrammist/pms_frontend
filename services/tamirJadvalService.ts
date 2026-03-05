// services/tamirJadvalService.ts
import apiClient from '@/lib/api/client';
import { 
  TamirJadval,
  CreateTamirJadvaliDto,
  UpdateTamirJadvaliDto,
  TamirJadvaliResponse,
  TamirJadvaliStatistics,
  TamirJadvalQueryParams,
  TamirHolati
} from '@/types/tamir-jadval';

export const tamirJadvalApi = {
  // Barcha tamir jadvallarini olish
  getAll: async (params?: TamirJadvalQueryParams): Promise<TamirJadvaliResponse> => {
    const response = await apiClient.get('/tamir-jadvali', { params });
    return response.data;
  },

  // Bitta tamir jadvalini olish
  getOne: async (id: number): Promise<TamirJadval> => {
    const response = await apiClient.get(`/tamir-jadvali/${id}`);
    return response.data;
  },

  // Vagon bo'yicha tamir jadvallarini olish
  getByVagon: async (vagonId: number, params?: TamirJadvalQueryParams): Promise<TamirJadvaliResponse> => {
    const response = await apiClient.get(`/tamir-jadvali/vagon/${vagonId}`, { params });
    return response.data;
  },

  // Tashkilot bo'yicha tamir jadvallarini olish
  getByTashkilot: async (tashkilotId: number, params?: TamirJadvalQueryParams): Promise<TamirJadvaliResponse> => {
    const response = await apiClient.get(`/tamir-jadvali/tashkilot/${tashkilotId}`, { params });
    return response.data;
  },

  // Bugungi tamir jadvallari
  getTodaySchedule: async (): Promise<TamirJadval[]> => {
    const response = await apiClient.get('/tamir-jadvali/bugungi');
    return response.data;
  },

  // Muddati o'tgan tamir jadvallari
  getOverdueSchedule: async (): Promise<TamirJadval[]> => {
    const response = await apiClient.get('/tamir-jadvali/muddati-otgan');
    return response.data;
  },

  // Statistika
  getStatistics: async (): Promise<TamirJadvaliStatistics> => {
    const response = await apiClient.get('/tamir-jadvali/statistika');
    return response.data;
  },

  // Tamir jadvali yaratish
  create: async (data: CreateTamirJadvaliDto): Promise<TamirJadval> => {
    console.log(data);
    
    const response = await apiClient.post('/tamir-jadvali', data);
    return response.data;
  },

  // Tamir jadvali yangilash
  update: async (id: number, data: UpdateTamirJadvaliDto): Promise<TamirJadval> => {
    const response = await apiClient.patch(`/tamir-jadvali/${id}`, data);
    return response.data;
  },

  // Holatni yangilash
  updateStatus: async (id: number, holati: TamirHolati): Promise<TamirJadval> => {
    const response = await apiClient.patch(`/tamir-jadvali/${id}/holati`, { holati });
    return response.data;
  },

  // Tamirni tugallash
  complete: async (id: number, tamirQiymati: number, izoh?: string): Promise<TamirJadval> => {
    const response = await apiClient.patch(`/tamir-jadvali/${id}/tugallash`, { tamirQiymati, izoh });
    return response.data;
  },

  // Tamir jadvalini o'chirish
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tamir-jadvali/${id}`);
  },
};