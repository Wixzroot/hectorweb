/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Plan {
  id: string; 
  name: string;
  price: string;
  price_inr?: string;
  price_eur?: string;
  badge: string;
  category: string;
  location: string;
  node: string;
  desc: string;
  features: string[];
  order?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  logo: string;
  server: string;
  note: string;
}

export interface Feedback {
  id: string;
  name: string;
  msg: string;
  rating: number;
  time: string;
}

export interface Settings {
  site_name: string;
  tagline: string;
  brand_name?: string;
  announcement_text?: string;
  show_announcement?: boolean;
  support_email?: string;
  discord_url?: string;
  billing_url?: string;
  upi_id?: string;
  payment_instructions?: string;
  maintenance_mode?: boolean;
  maintenance_message?: string;
  theme: 'dark' | 'light';
  font: string;
  color: string;
  currency: string;
  whatsapp_number: string;
  whatsapp_message: string;
  nav_links: NavLink[];
}

export interface AppData {
  settings: Settings;
  plans: Plan[];
  testimonials: Testimonial[];
  feedbacks: Feedback[];
  privacy: string;
  refund: string;
  tos: string;
  legal: string;
  infrastructure: string;
  about: string;
  categories: string[];
  locations: string[];
  nodes: string[];
}
