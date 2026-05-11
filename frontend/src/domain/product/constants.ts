export const CATEGORIES = {
  DUMBBELLS: 'mancuernas',
  BARS: 'barras',
  MACHINES: 'máquinas',
  CLOTHING: 'ropa',
  SUPPLEMENTS: 'suplementos',
  PHARMACOLOGY: 'farmacología',
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CategoryValue = typeof CATEGORIES[CategoryKey];