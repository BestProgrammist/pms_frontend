// hooks/useTamirJadval.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tamirJadvalApi } from '@/services/tamirJadvalService';
import { 
  CreateTamirJadvaliDto, 
  UpdateTamirJadvaliDto, 
  TamirJadvalQueryParams,
  TamirHolati 
} from '@/types/tamir-jadval';
import { toast } from 'sonner';

export const useTamirJadvallari = (params?: TamirJadvalQueryParams) => {
  return useQuery({
    queryKey: ['tamir-jadvallari', params],
    queryFn: () => tamirJadvalApi.getAll(params),
  });
};

export const useTamirJadval = (id: number) => {
  return useQuery({
    queryKey: ['tamir-jadval', id],
    queryFn: () => tamirJadvalApi.getOne(id),
    enabled: !!id,
  });
};

export const useTamirJadvalByVagon = (vagonId: number, params?: TamirJadvalQueryParams) => {
  return useQuery({
    queryKey: ['tamir-jadvallari', 'vagon', vagonId, params],
    queryFn: () => tamirJadvalApi.getByVagon(vagonId, params),
    enabled: !!vagonId,
  });
};

export const useTamirJadvalByTashkilot = (tashkilotId: number, params?: TamirJadvalQueryParams) => {
  return useQuery({
    queryKey: ['tamir-jadvallari', 'tashkilot', tashkilotId, params],
    queryFn: () => tamirJadvalApi.getByTashkilot(tashkilotId, params),
    enabled: !!tashkilotId,
  });
};

export const useTodaySchedule = () => {
  return useQuery({
    queryKey: ['tamir-jadvallari', 'bugungi'],
    queryFn: () => tamirJadvalApi.getTodaySchedule(),
  });
};

export const useOverdueSchedule = () => {
  return useQuery({
    queryKey: ['tamir-jadvallari', 'muddati-otgan'],
    queryFn: () => tamirJadvalApi.getOverdueSchedule(),
  });
};

export const useTamirJadvalStatistics = () => {
  return useQuery({
    queryKey: ['tamir-jadvallari', 'statistika'],
    queryFn: () => tamirJadvalApi.getStatistics(),
  });
};

export const useCreateTamirJadval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTamirJadvaliDto) => tamirJadvalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'bugungi'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'muddati-otgan'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'statistika'] });
      toast.success('Tamir jadvali muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir jadvali yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateTamirJadval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTamirJadvaliDto }) => 
      tamirJadvalApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadval', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'statistika'] });
      toast.success('Tamir jadvali muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir jadvali yangilashda xatolik yuz berdi');
    },
  });
};

export const useUpdateTamirJadvalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, holati }: { id: number; holati: TamirHolati }) => 
      tamirJadvalApi.updateStatus(id, holati),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadval', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'bugungi'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'muddati-otgan'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'statistika'] });
      toast.success('Tamir holati muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Holatni yangilashda xatolik yuz berdi');
    },
  });
};

export const useCompleteTamir = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tamirQiymati, izoh }: { id: number; tamirQiymati: number; izoh?: string }) => 
      tamirJadvalApi.complete(id, tamirQiymati, izoh),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadval', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'statistika'] });
      toast.success('Tamir muvaffaqiyatli tugallandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamirni tugallashda xatolik yuz berdi');
    },
  });
};

export const useDeleteTamirJadval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tamirJadvalApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-jadvallari', 'statistika'] });
      toast.success('Tamir jadvali muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir jadvalini o\'chirishda xatolik yuz berdi');
    },
  });
};