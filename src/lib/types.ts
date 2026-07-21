export type GalleryImage = {
  id: string;
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
  instagram_url: string;
  tiktok_url: string;
  default_theme: "light" | "dark" | "system";
  updated_at: string;
};

export type SiteData = {
  images: GalleryImage[];
  testimonials: Testimonial[];
  settings: SiteSettings;
};
