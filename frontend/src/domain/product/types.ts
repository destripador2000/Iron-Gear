export interface Distributor {
  id: number;
  name: string;
  contact_email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  distributor_id: number;
  name: string;
  description: string | null;
  price: number;
  is_discount: boolean;
  stock: number;
  category: string;
  distributor: Distributor | null;
}

export interface ProductFrontend extends Product {
  imageUrl: string;
  imageAlt: string;
}

export interface ProductMock {
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
  brand?: string;
}

export interface FilterState {
  maxPrice: number;
  brands: string[];
  materials: string[];
  minRating: number;
}