import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  HardDrive, 
  Terminal, 
  ArrowRight, 
  Star, 
  Lock, 
  Activity,
  Layers,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { AppData, Plan } from '../types';

interface DedicatedServersPageProps {
  data?: AppData;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  setActiveCurrency?: (c: 'USD' | 'INR' | 'EUR') => void;
  handleOrder: (plan: Plan) => void;
}

interface DedicatedPlanSpec {
  id: string;
  name: string;
  badge: string;
  cpu: string;
  cores: string;
  ram: string;
  storage: string;
  bandwidth: string;
  ip: string;
  priceInr: number;
  popular?: boolean;
  desc: string;
}

const DEDICATED_PLANS: DedicatedPlanSpec[] = [
  {
    id: 'dedi-ryzen-5950x',
    name: 'RYZEN 9 5950X BARE METAL',
    badge: 'HIGH CLOCK SPEED',
    cpu: 'AMD Ryzen 9 5950X',
    cores: '16 Cores / 32 Threads @ 4.9GHz',
    ram: '64 GB DDR4 ECC RAM',
    storage: '2x 1 TB PCIe 4.0 NVMe SSD (Hardware RAID-1)',
    bandwidth: 'Unmetered 10Gbps Uplink',
    ip: '1 Dedicated IPv4 + /64 IPv6 Subnet',
    priceInr: 7999,
    desc: 'High-frequency bare metal server for heavy Minecraft networks, Rust hosts, and high-performance databases.'
  },
  {
    id: 'dedi-ryzen-7950x3d',
    name: 'RYZEN 9 7950X3D GAMING METAL',
    badge: 'MOST POPULAR',
    cpu: 'AMD Ryzen 9 7950X3D',
    cores: '16 Cores / 32 Threads @ 5.7GHz (128MB V-Cache)',
    ram: '128 GB DDR5 ECC RAM',
    storage: '2x 2 TB PCIe 4.0 Enterprise NVMe',
    bandwidth: 'Unmetered 10Gbps Uplink',
    ip: '5 Dedicated IPv4 + /64 IPv6 Subnet',
    priceInr: 12999,
    popular: true,
    desc: 'Ultimate 3D V-Cache gaming bare metal designed for maximum single-thread performance and zero frame drops.'
  },
  {
    id: 'dedi-epyc-7763',
    name: 'AMD EPYC 7763 CLOUD BEAST',
    badge: 'HEAVY VIRTUALIZATION',
    cpu: 'AMD EPYC 7763 Enterprise',
    cores: '64 Cores / 128 Threads @ 3.5GHz',
    ram: '256 GB DDR4 ECC RAM',
    storage: '4x 3.84 TB Enterprise NVMe (U.2 Gen4)',
    bandwidth: 'Unmetered 10Gbps Uplink',
    ip: '13 Dedicated IPv4 + /64 IPv6 Subnet',
    priceInr: 24999,
    desc: 'Built for hosting providers, Proxmox/VMware clusters, heavy Docker infrastructure, and enterprise SaaS platforms.'
  },
  {
    id: 'dedi-epyc-9654',
    name: 'AMD EPYC 9654 MEGA METAL',
    badge: 'ENTERPRISE FLAGSHIP',
    cpu: 'AMD EPYC 9654 Genoa',
    cores: '96 Cores / 192 Threads @ 3.7GHz',
    ram: '512 GB DDR5 ECC RAM',
    storage: '8x 3.84 TB Enterprise NVMe (RAID-10)',
    bandwidth: 'Unmetered 10Gbps Uplink',
    ip: '29 Dedicated IPv4 + /64 IPv6 Subnet',
    priceInr: 44999,
    desc: 'Maximum compute density bare metal node capable of running hundreds of virtual machines and massive databases.'
  }
];

const LOCATIONS = [
  { id: 'in', name: 'India (Mumbai)', flag: '🇮🇳', latency: '12ms' },
  { id: 'de', name: 'Germany (Frankfurt)', flag: '🇩🇪', latency: '110ms' },
  { id: 'us', name: 'USA (Ashburn)', flag: '🇺🇸', latency: '180ms' },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', latency: '45ms' },
];

export const DedicatedServersPage: React.FC<DedicatedServersPageProps> = ({
  handleOrder,
}) => {
  const [selectedLocation, setSelectedLocation] = useState('India (Mumbai)');

  const formatPrice = (priceInr: number) => {
    return `₹${priceInr}`;
  };

  const handlePlanOrder = (dedi: DedicatedPlanSpec) => {
    const plan: Plan = {
      id: dedi.id,
      name: dedi.name,
      category: 'Dedicated-Servers',
      badge: dedi.badge,
      location: selectedLocation,
      node: 'Bare-Metal-Rack-01',
      desc: dedi.desc,
      price: String(Math.round(dedi.priceInr / 83)),
      price_inr: String(dedi.priceInr),
      price_eur: String(Math.round(dedi.priceInr / 90)),
      features: [
        `Processor: ${dedi.cpu}`,
        `Cores: ${dedi.cores}`,
        `RAM: ${dedi.ram}`,
        `Storage: ${dedi.storage}`,
        `Uplink: ${dedi.bandwidth}`,
        `IP Range: ${dedi.ip}`,
        `Full Out-of-band IPMI / iDRAC HTML5 Access`,
        `Location: ${selectedLocation}`,
        `Custom OS & ISO Mounting Ready`
      ]
    };
    handleOrder(plan);
  };

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Infrastructure / Bare Metal
          </span>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Dedicated <span className="text-foreground-muted">Compute.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            Zero-virtualization enterprise hardware. Provisioned with deterministic AMD Ryzen™ and EPYC™ architectures for mission-critical workloads.
          </p>

          {/* Location & Currency Controls */}
          <div className="inline-flex flex-wrap items-center justify-center gap-px bg-border border border-border p-px rounded-lg overflow-hidden shadow-sm">
            {/* Indian Currency Badge */}
            <div className="px-5 py-3 bg-bg text-[10px] font-black uppercase tracking-widest text-foreground-dim flex items-center gap-2 border-r border-border">
              <span>🇮🇳</span>
              <span>INR (₹)</span>
            </div>

            {/* Location Selector */}
            <div className="flex flex-wrap items-center bg-bg">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.name)}
                  className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-r last:border-r-0 border-border ${
                    selectedLocation === loc.name 
                      ? 'bg-bg-alt text-accent' 
                      : 'text-foreground-dim hover:text-foreground'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated Servers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32">
          {DEDICATED_PLANS.map((dedi, idx) => (
            <motion.div
              key={dedi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`bg-bg p-8 flex flex-col justify-between transition-all duration-300 relative group`}
            >
              <div>
                <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase block mb-3">
                  {dedi.badge}
                </span>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-3">
                  {dedi.name}
                </h3>
                <p className="text-[13px] text-foreground-muted mb-8 leading-relaxed">
                  {dedi.desc}
                </p>

                {/* Price Display */}
                <div className="bg-bg-alt border border-border rounded-md p-6 mb-8">
                  <div className="text-[10px] uppercase font-black tracking-widest text-foreground-dim mb-1">Monthly Operations</div>
                  <div className="text-3xl font-black text-foreground tracking-tighter">
                    {formatPrice(dedi.priceInr)}
                    <span className="text-xs font-normal text-foreground-dim ml-1">/MO</span>
                  </div>
                </div>

                {/* Hardware Specs */}
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Cpu, val: dedi.cores },
                    { icon: Zap, val: dedi.ram },
                    { icon: HardDrive, val: dedi.storage },
                    { icon: Globe, val: dedi.bandwidth },
                    { icon: Terminal, val: 'IPMI v2.0 HTML5' }
                  ].map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 text-[13px] text-foreground-muted">
                      <spec.icon size={16} className="text-accent shrink-0" />
                      <span className="truncate">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePlanOrder(dedi)}
                className={`w-full py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-accent hover:text-white`}
              >
                <span>Initialize Node</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Enterprise Integration
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Hardware <span className="text-foreground-muted">Governance.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {[
              { icon: Server, title: 'Out-of-Band Access', desc: 'Full IPMI / iDRAC management consoles for deterministic control at the kernel level, independent of OS state.' },
              { icon: Globe, title: 'Network Topology', desc: 'Each node provisioned with dedicated IPv4 addressing and /64 IPv6 subnets with full BGP routing and reverse DNS.' },
              { icon: ShieldCheck, title: 'Inline Mitigation', desc: 'Hardware-level DDoS scrubbing with automated Layer 7 inspection for sub-2ms filtration of volumetric attacks.' }
            ].map((feat, i) => (
              <div key={i} className="p-10 bg-bg space-y-6">
                <div className="w-12 h-12 rounded bg-bg-alt border border-border flex items-center justify-center text-accent">
                  <feat.icon size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
