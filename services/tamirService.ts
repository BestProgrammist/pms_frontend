// services/tamirService.ts
import apiClient from '@/lib/api/client';
import { 
  TamirTuri,
  CreateTamirTuriDto,
  UpdateTamirTuriDto,
  VagonTamirMuddati,
  CreateVagonTamirMuddatiDto,
  UpdateVagonTamirMuddatiDto,
  TamirTurlariResponse,
  VagonTamirMuddatlariResponse,
  VagonMuddatTekshirish,
  TamirTuriDropdownItem
} from '@/types/tamir';

export const tamirApi = {
  // Tamir turlari
  getTamirTurlari: async (params?: any): Promise<TamirTurlariResponse> => {
    const response = await apiClient.get('/tamir-turlari', { params });
    return response.data;
  },

  getTamirTuri: async (id: number): Promise<TamirTuri> => {
    const response = await apiClient.get(`/tamir-turlari/${id}`);
    return response.data;
  },

  getTamirTuriByKod: async (kodi: string): Promise<TamirTuri> => {
    const response = await apiClient.get(`/tamir-turlari/kodi/${kodi}`);
    return response.data;
  },

  getTamirTuriDropdown: async (): Promise<TamirTuriDropdownItem[]> => {
    const response = await apiClient.get('/tamir-turlari/dropdown');
    return response.data;
  },

  createTamirTuri: async (data: CreateTamirTuriDto): Promise<TamirTuri> => {
    const response = await apiClient.post('/tamir-turlari', data);
    return response.data;
  },

  updateTamirTuri: async (id: number, data: UpdateTamirTuriDto): Promise<TamirTuri> => {
    const response = await apiClient.patch(`/tamir-turlari/${id}`, data);
    return response.data;
  },

  deleteTamirTuri: async (id: number): Promise<void> => {
    await apiClient.delete(`/tamir-turlari/${id}`);
  },

  // Vagon tamir muddatlari
  getVagonTamirMuddatlari: async (params?: any): Promise<VagonTamirMuddatlariResponse> => {
    const response = await apiClient.get('/vagon-tamir-muddatlari', { params });
    return response.data;
  },

  getVagonTamirMuddati: async (id: number): Promise<VagonTamirMuddati> => {
    const response = await apiClient.get(`/vagon-tamir-muddatlari/${id}`);
    return response.data;
  },

  getMuddatlarByVagonTuri: async (vagonTuriId: number): Promise<VagonTamirMuddati[]> => {
    const response = await apiClient.get(`/vagon-tamir-muddatlari/vagon-turi/${vagonTuriId}`);
    return response.data;
  },

  getMuddatlarByTamirTuri: async (tamirTuriId: number): Promise<VagonTamirMuddati[]> => {
    const response = await apiClient.get(`/vagon-tamir-muddatlari/tamir-turi/${tamirTuriId}`);
    return response.data;
  },

  checkVagonMuddat: async (vagonId: number): Promise<VagonMuddatTekshirish> => {
    const response = await apiClient.get(`/vagon-tamir-muddatlari/vagon/${vagonId}/tekshir`);
    return response.data;
  },

  createVagonTamirMuddati: async (data: CreateVagonTamirMuddatiDto): Promise<VagonTamirMuddati> => {
    const response = await apiClient.post('/vagon-tamir-muddatlari', data);
    return response.data;
  },

  updateVagonTamirMuddati: async (id: number, data: UpdateVagonTamirMuddatiDto): Promise<VagonTamirMuddati> => {
    const response = await apiClient.patch(`/vagon-tamir-muddatlari/${id}`, data);
    return response.data;
  },

  deleteVagonTamirMuddati: async (id: number): Promise<void> => {
    await apiClient.delete(`/vagon-tamir-muddatlari/${id}`);
  },
};