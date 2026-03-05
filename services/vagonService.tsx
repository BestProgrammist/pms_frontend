// services/vagonService.ts
import apiClient from '@/lib/api/client';
import { 
  VagonTuri, 
  CreateVagonTuriDto, 
  UpdateVagonTuriDto,
  Vagon,
  CreateVagonDto,
  UpdateVagonDto,
  VagonlarResponse,
  VagonTurlariResponse,
  VagonStatistics,
  VagonHolati
} from '@/types/vagon';

export const vagonApi = {
  // Vagon turlari
  getVagonTurlari: async (params?: any): Promise<VagonTurlariResponse> => {
    const response = await apiClient.get('/vagon-turlari', { params });
    return response.data;
  },

  getVagonTuri: async (id: number): Promise<VagonTuri> => {
    const response = await apiClient.get(`/vagon-turlari/${id}`);
    return response.data;
  },

  createVagonTuri: async (data: CreateVagonTuriDto): Promise<VagonTuri> => {
    const response = await apiClient.post('/vagon-turlari', data);
    return response.data;
  },

  updateVagonTuri: async (id: number, data: UpdateVagonTuriDto): Promise<VagonTuri> => {
    const response = await apiClient.patch(`/vagon-turlari/${id}`, data);
    return response.data;
  },

  deleteVagonTuri: async (id: number): Promise<void> => {
    await apiClient.delete(`/vagon-turlari/${id}`);
  },

  // Vagonlar
  getVagonlar: async (params?: any): Promise<VagonlarResponse> => {
    const response = await apiClient.get('/vagonlar', { params });
    return response.data;
  },

  getVagon: async (id: number): Promise<Vagon> => {
    const response = await apiClient.get(`/vagonlar/${id}`);
    return response.data;
  },

  getVagonByRaqam: async (raqami: string): Promise<Vagon> => {
    const response = await apiClient.get(`/vagonlar/raqam/${raqami}`);
    return response.data;
  },

  createVagon: async (data: CreateVagonDto): Promise<Vagon> => {
    const response = await apiClient.post('/vagonlar', data);
    return response.data;
  },

  updateVagon: async (id: number, data: UpdateVagonDto): Promise<Vagon> => {
    const response = await apiClient.patch(`/vagonlar/${id}`, data);
    return response.data;
  },

  updateVagonHolati: async (id: number, holati: VagonHolati): Promise<Vagon> => {
    const response = await apiClient.patch(`/vagonlar/${id}/holat`, { holati });
    return response.data;
  },

  updateVagonKm: async (id: number, km: number): Promise<Vagon> => {
    const response = await apiClient.patch(`/vagonlar/${id}/km`, { km });
    return response.data;
  },

  deleteVagon: async (id: number): Promise<void> => {
    await apiClient.delete(`/vagonlar/${id}`);
  },

  // Dropdown va filterlar
  getVagonDropdown: async (): Promise<Array<{ id: number; raqami: string; holati: string }>> => {
    const response = await apiClient.get('/vagonlar/dropdown');
    return response.data;
  },

  getVagonlarByHolat: async (holati: VagonHolati): Promise<Vagon[]> => {
    const response = await apiClient.get(`/vagonlar/holat/${holati}`);
    return response.data;
  },

  getVagonlarByTuri: async (vagonTuriId: number): Promise<Vagon[]> => {
    const response = await apiClient.get(`/vagonlar/turi/${vagonTuriId}`);
    return response.data;
  },

  // Statistika va maxsus endpointlar
  getVagonStatistics: async (): Promise<VagonStatistics> => {
    const response = await apiClient.get('/vagonlar/statistika');
    return response.data;
  },

  getRepairNeeded: async (): Promise<Vagon[]> => {
    const response = await apiClient.get('/vagonlar/ta\'mir-kerak');
    return response.data;
  },

  checkKmLimits: async (): Promise<any[]> => {
    const response = await apiClient.get('/vagonlar/km-tekshir');
    return response.data;
  },
};