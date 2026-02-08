export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  rating: number;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: NavItem[];
}
