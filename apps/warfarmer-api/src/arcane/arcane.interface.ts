import { Drop, LevelStat, Rarity } from 'warframe-items';

export type ArcaneCollection =
  | 'Duviri'
  | 'Eidolon'
  | 'Holdfasts'
  | 'Necralisk'
  | 'Ostron'
  | 'Solaris'
  | 'Steel';

export interface WFArcane {
  name: string;
  imageName: string;
  drops: Drop[];
  levelStats: LevelStat[];
  rarity: Rarity;
  tradeable: boolean;
  urlName: string;
  collection?: ArcaneCollection;
  sellPrice?: {
    sell10: number;
    sell25: number;
    sell50: number;
    sell100: number;
    sell250: number;
    sell500: number;
  };
  vosfor?: number;
  vosforPerPlat?: {
    sell10: number;
    sell25: number;
    sell50: number;
    sell100: number;
    sell250: number;
    sell500: number;
  };
}
