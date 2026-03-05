// hooks/useVagon.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vagonApi } from '@/services/vagonService';
import { CreateVagonTuriDto, UpdateVagonTuriDto, CreateVagonDto, UpdateVagonDto, VagonHolati } from '@/types/vagon';
import { toast } from 'sonner';

// Vagon turlari hooks
export const useVagonTurlari = (params?: any) => {
  return useQuery({
    queryKey: ['vagon-turlari', params],
    queryFn: () => vagonApi.getVagonTurlari(params),
  });
};

export const useVagonTuri = (id: number) => {
  return useQuery({
    queryKey: ['vagon-turi', id],
    queryFn: () => vagonApi.getVagonTuri(id),
    enabled: !!id,
  });
};

export const useCreateVagonTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVagonTuriDto) => vagonApi.createVagonTuri(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagon-turlari'] });
      toast.success('Vagon turi muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon turi yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateVagonTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVagonTuriDto }) => 
      vagonApi.updateVagonTuri(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagon-turlari'] });
      queryClient.invalidateQueries({ queryKey: ['vagon-turi', variables.id] });
      toast.success('Vagon turi muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon turi yangilashda xatolik yuz berdi');
    },
  });
};

export const useDeleteVagonTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vagonApi.deleteVagonTuri(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagon-turlari'] });
      toast.success('Vagon turi muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon turini o\'chirishda xatolik yuz berdi');
    },
  });
};

// Vagonlar hooks
export const useVagonlar = (params?: any) => {
  return useQuery({
    queryKey: ['vagonlar', params],
    queryFn: () => vagonApi.getVagonlar(params),
  });
};

export const useVagon = (id: number) => {
  return useQuery({
    queryKey: ['vagon', id],
    queryFn: () => vagonApi.getVagon(id),
    enabled: !!id,
  });
};

export const useCreateVagon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVagonDto) => vagonApi.createVagon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagonlar'] });
      toast.success('Vagon muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateVagon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVagonDto }) => 
      vagonApi.updateVagon(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagonlar'] });
      queryClient.invalidateQueries({ queryKey: ['vagon', variables.id] });
      toast.success('Vagon muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon yangilashda xatolik yuz berdi');
    },
  });
};

export const useUpdateVagonHolati = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, holati }: { id: number; holati: VagonHolati }) => 
      vagonApi.updateVagonHolati(id, holati),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagonlar'] });
      queryClient.invalidateQueries({ queryKey: ['vagon', variables.id] });
      toast.success('Vagon holati yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Holatni yangilashda xatolik yuz berdi');
    },
  });
};

export const useUpdateVagonKm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, km }: { id: number; km: number }) => 
      vagonApi.updateVagonKm(id, km),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagonlar'] });
      queryClient.invalidateQueries({ queryKey: ['vagon', variables.id] });
      toast.success('Vagon KM yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'KM yangilashda xatolik yuz berdi');
    },
  });
};

export const useDeleteVagon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vagonApi.deleteVagon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagonlar'] });
      toast.success('Vagon muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagonni o\'chirishda xatolik yuz berdi');
    },
  });
};

// Statistika hooks
export const useVagonStatistics = () => {
  return useQuery({
    queryKey: ['vagon-statistika'],
    queryFn: () => vagonApi.getVagonStatistics(),
  });
};

export const useRepairNeeded = () => {
  return useQuery({
    queryKey: ['ta\'mir-kerak'],
    queryFn: () => vagonApi.getRepairNeeded(),
  });
};

export const useKmLimits = () => {
  return useQuery({
    queryKey: ['km-limits'],
    queryFn: () => vagonApi.checkKmLimits(),
  });
};