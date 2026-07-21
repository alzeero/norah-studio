export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  category_id: string | null;
  storage_path: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  comment: string;
  sort_order: number;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_image_path: string | null;
  hero_image_url: string | null;
  whatsapp_phone: string;
  whatsapp_message: string;
  default_theme: "light" | "dark" | "system";
  updated_at: string;
};

export type SiteData = {
  categories: Category[];
  images: GalleryImage[];
  testimonials: Testimonial[];
  settings: SiteSettings;
};
