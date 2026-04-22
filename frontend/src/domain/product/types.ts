export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  isPremium?: boolean;
}

export interface FilterState {
  maxPrice: number;
  brands: string[];
  materials: string[];
  minRating: number;
}