// types/tamir.ts
export interface TamirTuri {
  id: number;
  nomi: string;
  kodi: string;
  tavsifi?: string;
  yaratilganVaqt: Date;
  tamirMuddatlari?: VagonTamirMuddati[];
  tamirJadvallari?: TamirJadval[];
}

export interface CreateTamirTuriDto {
  nomi: string;
  kodi: string;
  tavsifi?: string;
}

export interface UpdateTamirTuriDto {
  nomi?: string;
  kodi?: string;
  tavsifi?: string;
}

export interface VagonTamirMuddati {
  id: number;
  vagonTuriId: number;
  tamirTuriId: number;
  muddatOy: number;
  maksimalKm: number;
  izoh?: string;
  yaratilganVaqt: Date;
  vagonTuri?: {
    id: number;
    nomi: string;
    kodli: string;
  };
  tamirTuri?: {
    id: number;
    nomi: string;
    kodi: string;
  };
  tamirJadvallari?: TamirJadval[];
}

export interface CreateVagonTamirMuddatiDto {
  vagonTuriId: number;
  tamirTuriId: number;
  muddatOy: number;
  maksimalKm: number;
  izoh?: string;
}

export interface UpdateVagonTamirMuddatiDto {
  vagonTuriId?: number;
  tamirTuriId?: number;
  muddatOy?: number;
  maksimalKm?: number;
  izoh?: string;
}

export interface TamirJadval {
  id: number;
  vagonId: number;
  tamirTuriId: number;
  tashkilotId?: number;
  vagonTamirMuddatiId?: number;
  rejalashtirilganSana: Date;
  bajarilganSana?: Date;
  holati: string;
  vagon?: any;
  tamirTuri?: TamirTuri;
  tashkilot?: any;
}

export interface TamirTurlariResponse {
  items: TamirTuri[];
  total: number;
}

export interface VagonTamirMuddatlariResponse {
  items: VagonTamirMuddati[];
  total: number;
}

export interface VagonMuddatTekshirish {
  vagonRaqami: string;
  vagonTuri: string;
  ishlabChiqarilganSana: Date;
  bosibOtganKm: number;
  umumiyOy: number;
  muddatiOtganlar: Array<{
    tamirTuri: string;
    muddatOy: number;
    maksimalKm: number;
    hozirgiOy: number;
    hozirgiKm: number;
    muddatOtgan: boolean;
    sabab: 'muddat' | 'km' | 'yo\'q';
  }>;
  tekshirishVaqti: Date;
}

export interface TamirTuriDropdownItem {
  id: number;
  nomi: string;
  kodi: string;
}