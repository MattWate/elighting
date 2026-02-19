export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  featured_order: number | null;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  specs: Record<string, any>; // JSONB flexibility
  is_featured: boolean;
  stock_level: number;
}
