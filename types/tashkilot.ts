// types/tashkilot.ts
export interface Tashkilot {
  id: number;
  nomi: string;
  kod: string;
  description?: string;
  telefon?: string;
  manzil?: string;
  yaratilganVaqt: Date;
  tamirJadvallari?: TamirJadval[];
}

export interface CreateTashkilotDto {
  nomi: string;
  kod: string;
  description?: string;
  telefon?: string;
  manzil?: string;
}

export interface UpdateTashkilotDto {
  nomi?: string;
  kod?: string;
  description?: string;
  telefon?: string;
  manzil?: string;
}

export interface TashkilotlarResponse {
  items: Tashkilot[];
  total: number;
}

export interface TashkilotDropdownItem {
  id: number;
  nomi: string;
  kod: string;
}

export interface TamirJadval {
  id: number;
  vagonId: number;
  tamirTuriId: number;
  tashkilotId: number;
  rejalashtirilganSana: Date;
  bajarilganSana?: Date;
  holati: string;
  vagon?: any;
  tamirTuri?: any;
}