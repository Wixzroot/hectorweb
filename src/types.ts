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

export interface SystemNode {
  id: string;
  name: string;
  ip?: string;
  hideIp?: boolean;
  role: string;
  tags?: string[];
  status: 'operational' | 'maintenance' | 'degraded' | 'outage';
  cpu: string;
  ram?: string;
  storage?: string;
  location: string;
  uptime: string;
  hasPanel?: boolean;
  load?: number;
  latencyMs?: number;
  downtimeTodayMinutes?: number;
  downtimeReason?: string;
  dailyDowntime?: {
    date: string;
    downtimeMinutes: number;
    status: 'operational' | 'maintenance' | 'degraded' | 'outage';
  }[];
  order?: number;
}

export interface Incident {
  id: string;
  title: string;
  type: 'scheduled_maintenance' | 'incident' | 'maintenance' | 'notice';
  severity: 'info' | 'warning' | 'critical' | 'resolved';
  status: 'scheduled' | 'in_progress' | 'completed' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
  affectedNodes: string[];
  message: string;
  createdAt: string;
  scheduledFor?: string;
  resolvedAt?: string;
  updatedAt?: string;
}

export interface AppData {
  settings: Settings;
  plans: Plan[];
  testimonials: Testimonial[];
  feedbacks: Feedback[];
  systemNodes?: SystemNode[];
  incidents?: Incident[];
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
