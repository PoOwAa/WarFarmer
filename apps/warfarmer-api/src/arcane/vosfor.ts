import { ArcaneCollection } from '@warfarmer/types';

export const ArcaneVosforValue: Record<
  ArcaneCollection,
  { Common: number; Uncommon: number; Rare: number; Legendary: number }
> = {
  Duviri: {
    Common: 0,
    Uncommon: 18,
    Rare: 24,
    Legendary: 84,
  },
  Eidolon: {
    Common: 14,
    Uncommon: 21,
    Rare: 28,
    Legendary: 98,
  },
  Holdfasts: {
    Common: 0,
    Uncommon: 0,
    Rare: 22,
    Legendary: 0,
  },
  Necralisk: {
    Common: 0,
    Uncommon: 0,
    Rare: 24,
    Legendary: 0,
  },
  Ostron: {
    Common: 12,
    Uncommon: 18,
    Rare: 24,
    Legendary: 0,
  },
  Solaris: {
    Common: 12,
    Uncommon: 18,
    Rare: 24,
    Legendary: 0,
  },
  Steel: {
    Common: 0,
    Uncommon: 0,
    Rare: 20,
    Legendary: 0,
  },
  Cavia: {
    Common: 0,
    Uncommon: 18,
    Rare: 24,
    Legendary: 84,
  },
  Hex: {
    Common: 0,
    Uncommon: 24, // FIXME: warframe-items thinks Hex arcanes are uncommon, but wiki says they are rare and can be dissolved for 24 vosfors
    Rare: 24,
    Legendary: 0,
  },
};
