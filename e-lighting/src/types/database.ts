// e-lighting/src/types/database.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string; // New field
  featured_order: number | null;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  data_sheet_url?: string; // New field
  specs: Record<string, any>; 
  is_featured: boolean;
  stock_level: number;
}
