import { AppData } from './types';

export const DEFAULT_DATA: AppData = {
  settings: {
    site_name: 'HectorHosting',
    tagline: 'Enterprise Hosting. Uncompromising Performance.',
    brand_name: 'HectorHosting',
    announcement_text: '⚡ Monsoon Flash Deal: Get 20% OFF on all KVM VPS & FiveM Game Servers with code HECTOR20!',
    show_announcement: true,
    support_email: 'support@hectorhosting.com',
    discord_url: 'https://discord.gg/hectorhosting',
    billing_url: 'https://billing.hectorhosting.com',
    upi_id: 'hectorhosting@upi',
    payment_instructions: 'Pay directly via UPI ID or QR code. Mention your invoice / plan name in reference note.',
    maintenance_mode: false,
    maintenance_message: 'HectorHosting system scheduled maintenance is currently active. Infrastructure nodes remain 100% operational.',
    theme: 'dark',
    font: 'bebas',
    color: 'bw',
    currency: '₹',
    whatsapp_number: '919876543210',
    whatsapp_message: 'Hi! I want to order the {plan} plan (₹{price}/mo). Can you help me set it up?',
    nav_links: [
      { label: 'Home', href: '/' },
      { label: 'Pricing', href: '/plans' },
      { label: 'Feedback', href: '/#feedback' },
      { label: 'Reliability', href: '/#customers' },
    ],
  },
  plans: [],
  testimonials: [
    {
      id: 't_1',
      name: 'Apex Gaming Network',
      logo: 'gamepad',
      server: 'Ryzen 9 5950X Node - Germany',
      note: 'Switched 400+ active players to HectorHosting. Zero TPS drops during peak hours and DDoS attacks are mitigated instantly.'
    },
    {
      id: 't_2',
      name: 'TechFlow SaaS',
      logo: 'rocket',
      server: 'Enterprise AMD EPYC Node - USA',
      note: 'The NVMe speeds and 10Gbps uplink cut our database query latency in half. Support responds within minutes.'
    },
    {
      id: 't_3',
      name: 'DevCraft Studio',
      logo: 'zap',
      server: 'Web Hosting & Discord Bot Nodes',
      note: 'Unbeatable value and speed. We host all our client staging environments and Discord bots here without a single outage.'
    }
  ],
  feedbacks: [],
  privacy: `
# Privacy Policy

Last Updated: May 2024

At Hector Hosting, we prioritize the privacy and security of our clients. This policy outlines how we handle your data.

## 1. Data Collection
We collect the minimum information necessary to provide high-performance hosting services:
*   **Operational Data:** IP addresses for DDoS protection and node optimization.
*   **Account Data:** Contact information provided during the order process via WhatsApp/Support.
*   **Analytics:** Anonymous usage statistics to improve our global infrastructure.

## 2. Infrastructure Security
Our nodes utilize enterprise-grade encryption. Data at rest is protected using AES-256 standards, and all management traffic is tunnelled through secure VPNs.

## 3. Third-Party Sharing
**We never sell your data.** Information is only shared with Tier 4 Data Center partners strictly for provisioning and support purposes.

## 4. Your Rights
You have the right to request a full data export or account termination at any time.
`,
  refund: `
# Refund Policy

High-performance hosting should be risk-free. Here is how our 30-day guarantee works.

## 30-Day Money-Back Guarantee
If you are not satisfied with your server performance or support experience within the first 30 days, we will issue a full refund—no questions asked.

### Refund Eligibility
| Service Type | Policy |
| :--- | :--- |
| Web Hosting | Full Refund (30 Days) |
| VPS Instances | Full Refund (30 Days) |
| Dedicated Nodes | Case-by-case (Setup fees apply) |
| Add-on Items | Non-refundable |

### How to Claim
1. Contact our support via WhatsApp or Ticket.
2. Provide your Order ID and Node ID.
3. Funds are returned to the original payment method within 5-7 business days.
`,
  tos: `
# Terms of Service

By utilizing Hector Hosting infrastructure, you agree to the following terms.

## 1. Acceptable Use Policy (AUP)
Users are prohibited from using our nodes for:
*   Illegal mass mailing (Spamming).
*   Storage of illegal materials.
*   Cryptocurrency mining on non-dedicated CPU nodes.
*   Malicious network activity or DDoS launching.

## 2. Resource Allocation
We guarantee the hardware specifications listed on your plan. Burstable resources are subject to "Fair Use" to ensure stability for all tenants on a shared node.

## 3. Service Level Agreement (SLA)
We aim for **99.99% uptime**. If monthly uptime falls below this threshold, service credits will be applied as follows:
*   < 99.9% : 10% Credit
*   < 99.0% : 50% Credit
*   < 95.0% : 100% Credit
`,
  legal: `
# Legal Information

Hector Hosting is a globally distributed hosting provider operating under international digital services regulations.

## Entity Information
Hector Hosting operates as a subsidiary of Global Infrastructure Systems.

## Compliance
We comply with:
*   **GDPR** (General Data Protection Regulation)
*   **DMCA** (Digital Millennium Copyright Act)
*   **ISO 27001** (Information Security Management)

## Jurisdiction
Legal disputes are settled under the jurisdiction of our primary operations center, unless otherwise specified in your specific enterprise contract.
`,
  infrastructure: `
# Our Global Infrastructure

We don't just host; we architect performance. Our network is built on a foundation of reliability and speed.

## Tier 4 Data Centers
Our hardware is housed in Tier 4 facilities across 5 continents, featuring:
*   **Triple Redundancy:** N+2 power and cooling systems.
*   **Biometric Security:** Multi-layer physical access control.
*   **Carrier Neutral:** Connected to major global IXPs.

## Performance Benchmark
We maintain a strict performance threshold across our fleet.

| Metric | Guaranteed | Average |
| :--- | :--- | :--- |
| Network Uplink | 10 Gbps | 8.4 Gbps |
| SSD IOPS | 100k+ | 145k |
| CPU Frequency | 3.4 GHz+ | 4.8 GHz (Boost) |
| Global Latency | < 150ms | 42ms |

## The Hardware Stack
We only use enterprise-grade components:
*   **CPUs:** AMD EPYC™ 7763 & Ryzen™ 9 5950X for peak single-thread performance.
*   **Storage:** NVMe Gen4 SSDs in RAID 10 configurations.
*   **Networking:** 10Gbps uplinks with Corero DDoS mitigation.

## Anycast Network
We use Anycast DNS and routing to ensure your data takes the shortest path to your users, reducing global latency and improving load times for everyone.

![Global Network](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop)

> ### Pro Tip
> Use our Singapore nodes for optimal routing across Asia-Pacific markets.
`,
  about: `
# About Hector Hosting

Founded in 2018, Hector Hosting was born from a simple realization: the hosting market was saturated with "cheap" services that compromised on hardware and "expensive" services that were out of reach for small developers.

## Our Mission
To democratize high-performance computing by providing enterprise-grade infrastructure at accessible price points.

## Our Philosophy
We believe that infrastructure should be "invisible." You focus on your code; we'll handle the silicon and the packets.

### Core Values
1. **Performance First:** No CPU overselling. Guaranteed resources.
2. **Support that Cares:** Real human engineers, not bot scripts.
3. **Transparent Pricing:** No hidden renewal fees or setup costs.

## Our Growth
*   **2018:** Launched first node in Singapore.
*   **2020:** Expanded to USA and Europe.
*   **2022:** Reached 10,000 active instances.
*   **2024:** Introduced AMD EPYC™ 7763 infrastructure globally.

## Meet the Infrastructure
We are a team of systems engineers, network architects, and support specialists passionate about open-source and high-performance networking.

> "Performance is not a feature; it is the foundation." - Hector, Founder
`,
  categories: ['VPS', 'GAME-HOSTING', 'WEB-HOSTING', 'BOT-HOSTING', 'DED-SERVERS'],
  locations: ['Singapore', 'India', 'Germany', 'USA', 'UK'],
  nodes: ['AMD EPYC 7763', 'Ryzen 9 5950X', 'Intel Core i9-12900K', 'Xeon Platinum'],
};

export const FONTS = [
  { id: 'bebas', name: 'Bebas Neue' },
  { id: 'space', name: 'Space Grotesk' },
];

export const COLORS = [
  { id: 'bw', label: 'Classic', hex: '#eeeee9' },
  { id: 'gold', label: 'Gold', hex: '#d4a853' },
  { id: 'blue', label: 'Blue', hex: '#5b9cf6' },
  { id: 'green', label: 'Green', hex: '#4ade80' },
  { id: 'red', label: 'Red', hex: '#f87171' },
  { id: 'purple', label: 'Purple', hex: '#c084fc' },
];
