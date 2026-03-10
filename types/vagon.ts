import { IstamirType, TamirTuri } from "./tamir";
import { TamirHolati } from "./tamir-jadval";

// types/vagon.ts
export enum VagonHolati {
  ACTIVE = 'active',
  REPAIR = 'repair',
  BROKEN = 'broken',
  DECOMMISSIONED = 'decommissioned'
}

export interface VagonTuri {
  id: number;
  nomi: string;
  kodli: string;
  tavsifi?: string;
  yaratilganVaqt: Date;
  vagonlar?: Vagon[];
  tamirMuddatlari?: VagonTamirMuddati[];
}

export interface CreateVagonTuriDto {
  nomi: string;
  kodli: string;
  tavsifi?: string;
}

export interface UpdateVagonTuriDto {
  nomi?: string;
  kodli?: string;
  tavsifi?: string;
}

export interface Vagon {
  id: number;
  raqami: string;
  vagonTuriId: number;
  ishlabChigarilganSana: Date;
  bosibOtganKm: number;
  holati: VagonHolati;
  yaratilganVaqt: Date;
  vagonTuri: VagonTuri;
  tamirJadvallari?: TamirJadval[];
}

export interface CreateVagonDto {
  raqami: string;
  vagonTuriId: number;
  ishlabChigarilganSana: string;
  bosibOtganKm?: number;
  holati: VagonHolati;
}

export interface UpdateVagonDto {
  raqami?: string;
  vagonTuriId?: number;
  ishlabChigarilganSana?: string;
  bosibOtganKm?: number;
  holati?: VagonHolati;
}

export interface VagonTamirMuddati {
  id: number;
  vagonTuriId: number;
  muddatOy?: number;
  maksimalKm?: number;
  tamirType: IstamirType
  tamirTuriId?: number;
  vagonTuri?: VagonTuri;
  tamirTuri?: TamirTuri;
}

export interface TamirJadval {
  id: number;
  vagonId: number;
  tamirTuriId: number;
  //endi
  tamirTuri: TamirTuri;
  rejalashtirilganSana: Date;
  amalgaOshirilganSana?: Date;
  holati: TamirHolati;
}

// export interface TamirTuri {
//   id: number;
//   nomi: string;
//   kodi: string;
// }

export interface VagonlarResponse {
  items: Vagon[];
  total: number;
}

export interface VagonTurlariResponse {
  items: VagonTuri[];
  total: number;
}

export interface VagonStatistics {
  total: number;
  active: number;
  repair: number;
  broken: number;
  decommissioned: number;
  totalKm: number;
  averageKm: number;
  turStat: Array<{
    turi: string;
    soni: number;
  }>;
}