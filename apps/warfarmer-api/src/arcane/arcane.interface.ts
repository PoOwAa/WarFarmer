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
}
