export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  imageAlt: string;
  description?: string;
  isPremium?: boolean;
  isNew?: boolean;
  weight?: string;
  material?: string;
  category?: string;
}

export interface FilterState {
  maxPrice: number;
  brands: string[];
  materials: string[];
  minRating: number;
}