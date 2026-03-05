// hooks/useTamir.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tamirApi } from '@/services/tamirService';
import { CreateTamirTuriDto, UpdateTamirTuriDto, CreateVagonTamirMuddatiDto, UpdateVagonTamirMuddatiDto } from '@/types/tamir';
import { toast } from 'sonner';

// Tamir turlari hooks
export const useTamirTurlari = (params?: any) => {
  return useQuery({
    queryKey: ['tamir-turlari', params],
    queryFn: () => tamirApi.getTamirTurlari(params),
  });
};

export const useTamirTuri = (id: number) => {
  return useQuery({
    queryKey: ['tamir-turi', id],
    queryFn: () => tamirApi.getTamirTuri(id),
    enabled: !!id,
  });
};

export const useTamirTuriDropdown = () => {
  return useQuery({
    queryKey: ['tamir-turlari-dropdown'],
    queryFn: () => tamirApi.getTamirTuriDropdown(),
  });
};

export const useCreateTamirTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTamirTuriDto) => tamirApi.createTamirTuri(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari-dropdown'] });
      toast.success('Tamir turi muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir turi yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateTamirTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTamirTuriDto }) => 
      tamirApi.updateTamirTuri(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-turi', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari-dropdown'] });
      toast.success('Tamir turi muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir turi yangilashda xatolik yuz berdi');
    },
  });
};

export const useDeleteTamirTuri = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tamirApi.deleteTamirTuri(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari'] });
      queryClient.invalidateQueries({ queryKey: ['tamir-turlari-dropdown'] });
      toast.success('Tamir turi muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tamir turini o\'chirishda xatolik yuz berdi');
    },
  });
};

// Vagon tamir muddatlari hooks
export const useVagonTamirMuddatlari = (params?: any) => {
  return useQuery({
    queryKey: ['vagon-tamir-muddatlari', params],
    queryFn: () => tamirApi.getVagonTamirMuddatlari(params),
  });
};

export const useVagonTamirMuddati = (id: number) => {
  return useQuery({
    queryKey: ['vagon-tamir-muddati', id],
    queryFn: () => tamirApi.getVagonTamirMuddati(id),
    enabled: !!id,
  });
};

export const useMuddatlarByVagonTuri = (vagonTuriId: number) => {
  return useQuery({
    queryKey: ['vagon-tamir-muddatlari', 'vagon-turi', vagonTuriId],
    queryFn: () => tamirApi.getMuddatlarByVagonTuri(vagonTuriId),
    enabled: !!vagonTuriId,
  });
};

export const useMuddatlarByTamirTuri = (tamirTuriId: number) => {
  return useQuery({
    queryKey: ['vagon-tamir-muddatlari', 'tamir-turi', tamirTuriId],
    queryFn: () => tamirApi.getMuddatlarByTamirTuri(tamirTuriId),
    enabled: !!tamirTuriId,
  });
};

export const useCheckVagonMuddat = (vagonId: number) => {
  return useQuery({
    queryKey: ['vagon-muddat-tekshir', vagonId],
    queryFn: () => tamirApi.checkVagonMuddat(vagonId),
    enabled: !!vagonId,
  });
};

export const useCreateVagonTamirMuddati = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVagonTamirMuddatiDto) => tamirApi.createVagonTamirMuddati(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagon-tamir-muddatlari'] });
      toast.success('Vagon tamir muddati muvaffaqiyatli yaratildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon tamir muddati yaratishda xatolik yuz berdi');
    },
  });
};

export const useUpdateVagonTamirMuddati = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVagonTamirMuddatiDto }) => 
      tamirApi.updateVagonTamirMuddati(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vagon-tamir-muddatlari'] });
      queryClient.invalidateQueries({ queryKey: ['vagon-tamir-muddati', variables.id] });
      toast.success('Vagon tamir muddati muvaffaqiyatli yangilandi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon tamir muddatini yangilashda xatolik yuz berdi');
    },
  });
};

export const useDeleteVagonTamirMuddati = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tamirApi.deleteVagonTamirMuddati(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vagon-tamir-muddatlari'] });
      toast.success('Vagon tamir muddati muvaffaqiyatli o\'chirildi');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Vagon tamir muddatini o\'chirishda xatolik yuz berdi');
    },
  });
};