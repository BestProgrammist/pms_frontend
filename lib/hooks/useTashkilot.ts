// hooks/useTashkilot.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tashkilotApi } from '@/services/tashkilotService';
import { CreateTashkilotDto, UpdateTashkilotDto } from '@/types/tashkilot';
import { toast } from 'sonner';

export const useTashkilotlar = (params?: any) => {
  return useQuery({
    queryKey: ['tashkilotlar', params],
    queryFn: () => tashkilotApi.getAll(params),
  });
};

export const useTashkilot = (id: number) => {
  return useQuery({
    queryKey: ['tashkilot', id],
    queryFn: () => tashkilotApi.getOne(id),
    enabled: !!id,
  });
};

export const useTashkilotDropdown = () => {
  return useQuery({
    queryKey: ['tashkilotlar-dropdown'],
    queryFn: () => tashkilotApi.getDropdown(),
  });
};

export const useCreateTashkilot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTashkilotDto) => tashkilotApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar'] });
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar-dropdown'] });
      toast.success('Tashkilot muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tashkilot yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateTashkilot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTashkilotDto }) => 
      tashkilotApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar'] });
      queryClient.invalidateQueries({ queryKey: ['tashkilot', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar-dropdown'] });
      toast.success('Tashkilot muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tashkilot yangilashda xatolik yuz berdi');
    },
  });
};

export const useDeleteTashkilot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tashkilotApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar'] });
      queryClient.invalidateQueries({ queryKey: ['tashkilotlar-dropdown'] });
      toast.success('Tashkilot muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tashkilotni o\'chirishda xatolik yuz berdi');
    },
  });
};