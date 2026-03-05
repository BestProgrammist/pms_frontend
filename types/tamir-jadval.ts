// types/tamir-jadval.ts
export enum TamirHolati {
  REJALASHTIRILGAN = 'rejalashtirilgan',
  JARAYONDA = 'jarayonda',
  TUGALLANGAN = 'tugallangan',
  BEKOR_QILINGAN = 'bekor_qilingan'
}

export interface TamirJadval {
  id: number;
  vagonId: number;
  tamirTuriId: number;
  vagonTamirMuddatiId: number;
  tashkilotId: number;
  userId: string;
  rejalashtirilganSana: Date;
  amalgaOshirilganSana?: Date;
  holati: TamirHolati;
  tamirQiymati?: number;
  izoh?: string;
  yaratilganVaqt: Date;
  
  // Relations
  vagon?: {
    id: number;
    raqami: string;
    bosibOtganKm: number;
    ishlabChigarilganSana: Date;
    vagonTuri?: {
      nomi: string;
      kodli: string;
    };
  };
  tamirTuri?: {
    id: number;
    nomi: string;
    kodi: string;
  };
  vagonTamirMuddati?: {
    id: number;
    muddatOy: number;
    maksimalKm: number;
  };
  tashkilot?: {
    id: number;
    nomi: string;
    kod: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface CreateTamirJadvaliDto {
  vagonId: number;
  tamirTuriId: number;
  vagonTamirMuddatiId: number;
  tashkilotId: number;
  rejalashtirilganSana: string;
  amalgaOshirilganSana?: string;
  holati: TamirHolati;
  tamirQiymati?: number;
  izoh?: string;
}

export interface UpdateTamirJadvaliDto {
  vagonId?: number;
  tamirTuriId?: number;
  vagonTamirMuddatiId?: number;
  tashkilotId?: number;
  rejalashtirilganSana?: string;
  amalgaOshirilganSana?: string;
  holati?: TamirHolati;
  tamirQiymati?: number;
  izoh?: string;
}

export interface TamirJadvaliResponse {
  items: TamirJadval[];
  total: number;
}

export interface TamirJadvaliStatistics {
  total: number;
  rejalashtirilgan: number;
  jarayonda: number;
  tugallangan: number;
  bekorQilingan: number;
  bugungi: number;
  muddatiOtgan: number;
}

export interface TamirJadvalQueryParams {
  vagonId?: number;
  tamirTuriId?: number;
  tashkilotId?: number;
  holati?: TamirHolati;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface TamirJadvalDropdownItem {
  id: number;
  nomi: string;
  kodi: string;
}