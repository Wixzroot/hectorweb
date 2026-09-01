import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Terminal, 
  HardDrive, 
  Server, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Settings2, 
  Layers,
  Lock,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { AppData, Plan } from '../types';

interface VpsHostingPageProps {
  data: AppData;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  setActiveCurrency?: (c: 'USD' | 'INR' | 'EUR') => void;
  handleOrder: (plan: Plan) => void;
}

interface VpsPlanSpec {
  id: string;
  name: string;
  badge: string;
  vcpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  priceInr: number;
  popular?: boolean;
  desc: string;
}

const VPS_PLANS: VpsPlanSpec[] = [];

const SUPPORTED_OS = [
  { name: 'Ubuntu 22.04 LTS', icon: '🐧', type: 'Linux' },
  { name: 'Debian 12 Bookworm', icon: '🌀', type: 'Linux' },
  { name: 'AlmaLinux 9', icon: '🌐', type: 'Linux' },
  { name: 'CentOS Stream 9', icon: '⚙️', type: 'Linux' },
  { name: 'Windows Server 2022', icon: '🪟', type: 'Windows' },
  { name: 'Docker Engine 1-Click', icon: '🐳', type: 'App' },
  { name: 'cPanel / WHM', icon: '🚀', type: 'Panel' },
  { name: 'CyberPanel / LiteSpeed', icon: '⚡', type: 'Panel' },
];

const LOCATIONS = [
  { id: 'in', name: 'India (Mumbai)', flag: '🇮🇳', ping: '12ms' },
  { id: 'de', name: 'Germany (Frankfurt)', flag: '🇩🇪', ping: '110ms' },
  { id: 'us', name: 'USA (Ashburn)', flag: '🇺🇸', ping: '180ms' },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', ping: '45ms' },
];

export const VpsHostingPage: React.FC<VpsHostingPageProps> = ({
  data,
  activeCurrency,
  setActiveCurrency,
  handleOrder,
}) => {
  const [selectedOS, setSelectedOS] = useState('Ubuntu 22.04 LTS');
  const [selectedLocation, setSelectedLocation] = useState('India (Mumbai)');
  const [customVcpu, setCustomVcpu] = useState(2);
  const [customRam, setCustomRam] = useState(4);
  const [customStorage, setCustomStorage] = useState(60);

  // Render database VPS plans dynamically if configured, else fall back to static
  const dbVpsPlans = (data?.plans?.filter(p => {
    const cat = (p.category || '').toLowerCase();
    return cat === 'ryzen-vps-pricing' || cat === 'intel-vps-pricing' || cat.includes('vps');
  }) || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (dbVpsPlans.length === 0) {
    return (
      <div className="bg-[#050409] min-h-screen text-slate-100 pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold opacity-50 uppercase font-sans">No VPS plans available currently.</h2>
        <p className="text-slate-400 mt-2 font-light">Please check back later or add plans via the Admin Panel.</p>
      </div>
    );
  }

  const displayPlans = dbVpsPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    badge: plan.badge || 'KVM CLOUD',
    vcpu: plan.features[0] || '1 vCPU Core',
    ram: plan.features[1] || '2 GB DDR4 RAM',
    storage: plan.features[2] || '30 GB NVMe Storage',
    bandwidth: plan.features[3] || 'Unmetered Bandwidth',
    priceInr: Number(plan.price_inr || plan.price),
    popular: plan.badge?.toLowerCase().includes('popular') || plan.badge?.toLowerCase().includes('best') || false,
    desc: plan.desc,
    features: plan.features,
    location: plan.location,
    node: plan.node
  }));

  const formatPrice = (priceInr: number) => {
    return `₹${priceInr}`;
  };

  const calculateCustomPrice = () => {
    const vcpuCost = customVcpu * 150;
    const ramCost = customRam * 80;
    const storageCost = customStorage * 3;
    return vcpuCost + ramCost + storageCost;
  };

  const handleCustomOrder = () => {
    const calculatedPriceInr = calculateCustomPrice();
    const plan: Plan = {
      id: `custom-vps-${Date.now()}`,
      name: `Custom KVM VPS (${customVcpu} vCPU, ${customRam}GB RAM)`,
      category: 'VPS-Hosting',
      badge: 'CUSTOM SPEC',
      location: selectedLocation,
      node: 'Ryzen-KVM-Node-01',
      desc: `Custom VPS configured with ${selectedOS} operating system.`,
      price: String(Math.round(calculatedPriceInr / 83)),
      price_inr: String(calculatedPriceInr),
      price_eur: String(Math.round(calculatedPriceInr / 90)),
      features: [
        `${customVcpu} vCPU Cores (AMD Ryzen 9 5950X)`,
        `${customRam} GB DDR4 ECC RAM`,
        `${customStorage} GB PCIe 4.0 NVMe SSD`,
        `OS: ${selectedOS}`,
        `Full Root Access & SolusVM Panel`,
        `10Gbps DDoS Protected Uplink`,
        `Location: ${selectedLocation}`
      ]
    };
    handleOrder(plan);
  };

  const handlePlanOrder = (vps: any) => {
    const dbPlan = data?.plans?.find(p => p.id === vps.id);
    if (dbPlan) {
      handleOrder({
        ...dbPlan,
        location: selectedLocation, // respect chosen location
      });
    } else {
      const plan: Plan = {
        id: vps.id,
        name: vps.name,
        category: 'VPS-Hosting',
        badge: vps.badge,
        location: selectedLocation,
        node: 'Ryzen-KVM-Node-01',
        desc: vps.desc,
        price: String(Math.round(vps.priceInr / 83)),
        price_inr: String(vps.priceInr),
        price_eur: String(Math.round(vps.priceInr / 90)),
        features: [
          vps.vcpu,
          vps.ram,
          vps.storage,
          vps.bandwidth,
          `Selected OS: ${selectedOS}`,
          `Full Root Access / HTML5 VNC Console`,
          `Location: ${selectedLocation}`,
          `10Tbps DDoS Mitigation included`
        ]
      };
      handleOrder(plan);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header & Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bg-alt border border-border text-[10px] font-bold uppercase tracking-wider text-foreground-dim mb-8">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-foreground">KVM Virtual Private Servers</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6 text-balance"
          >
            Deterministic <span className="text-foreground-muted">KVM Hosting.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            High-frequency AMD Ryzen™ 9 infrastructure with unmetered 10Gbps connectivity and enterprise-grade NVMe storage arrays.
          </p>

          {/* Top Control Bar: Datacenter & Currency Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-bg-alt border border-border p-3 rounded-lg shadow-sm">
            {/* Indian Currency Badge */}
            <div className="px-3 py-1.5 bg-bg border border-border rounded text-[10px] font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
              <span>🇮🇳</span>
              <span>INR Billing</span>
            </div>

            {/* Location selector pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc.name)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    selectedLocation === loc.name 
                      ? 'bg-accent text-white' 
                      : 'bg-bg border border-border text-foreground-dim hover:text-foreground'
                  }`}
                >
                  <span>{loc.flag}</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VPS Plans Grid - High Precision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32">
          {displayPlans.map((vps, idx) => (
            <motion.div
              key={vps.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-bg p-8 flex flex-col justify-between group relative"
            >
              {vps.popular && (
                <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-accent uppercase">
                    {vps.badge}
                  </span>
                  {vps.popular && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-accent/10 text-accent font-bold uppercase">Popular</span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                  {vps.name}
                </h3>
                <p className="text-[13px] text-foreground-muted mb-8 leading-relaxed line-clamp-2 min-h-[40px]">
                  {vps.desc}
                </p>

                {/* Price Display */}
                <div className="mb-8">
                  <div className="text-[10px] uppercase font-bold text-foreground-dim tracking-wider mb-1">Monthly Billing</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">{formatPrice(vps.priceInr)}</span>
                    <span className="text-sm font-medium text-foreground-dim">/mo</span>
                  </div>
                </div>

                {/* Spec List */}
                <div className="space-y-4 mb-10 border-t border-border pt-8">
                  {vps.features && vps.features.length > 0 ? (
                    vps.features.slice(0, 5).map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-3 text-[13px] text-foreground-muted">
                        <CheckCircle2 size={16} className="text-accent shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3 text-[13px] text-foreground-muted">
                        <Cpu size={16} className="text-accent shrink-0" />
                        <span>{vps.vcpu}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-foreground-muted">
                        <Zap size={16} className="text-accent shrink-0" />
                        <span>{vps.ram}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-foreground-muted">
                        <HardDrive size={16} className="text-accent shrink-0" />
                        <span>{vps.storage}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handlePlanOrder(vps)}
                className={`w-full py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  vps.popular
                    ? 'bg-accent hover:bg-accent-muted text-white shadow-xl shadow-accent/20'
                    : 'bg-bg-alt hover:bg-border border border-border text-foreground'
                }`}
              >
                Configure Server
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom VPS Builder Widget - Technical & Clean */}
        <div className="bg-bg-alt border border-border rounded-lg p-8 sm:p-12 mb-32 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent block mb-4">
                Configurator
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight uppercase">
                Custom Node <span className="text-foreground-muted">Architecture.</span>
              </h2>
              <p className="text-foreground-muted mt-4 max-w-xl text-base">
                Define specific resource allocations for your workload. Every custom instance is provisioned on high-frequency hardware.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* Sliders */}
              <div className="lg:col-span-7 space-y-10">
                
                {/* vCPU Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Compute (Cores)</label>
                    <span className="text-accent font-bold text-sm uppercase">{customVcpu} Threads</span>
                  </div>
                  <input
                    type="range" min="1" max="16" step="1" value={customVcpu}
                    onChange={(e) => setCustomVcpu(Number(e.target.value))}
                    className="w-full accent-accent bg-border h-1.5 rounded-full cursor-pointer appearance-none"
                  />
                </div>

                {/* RAM Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Memory (GB)</label>
                    <span className="text-accent font-bold text-sm uppercase">{customRam} GB DDR4</span>
                  </div>
                  <input
                    type="range" min="2" max="64" step="2" value={customRam}
                    onChange={(e) => setCustomRam(Number(e.target.value))}
                    className="w-full accent-accent bg-border h-1.5 rounded-full cursor-pointer appearance-none"
                  />
                </div>

                {/* Storage Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Storage (NVMe)</label>
                    <span className="text-accent font-bold text-sm uppercase">{customStorage} GB SSD</span>
                  </div>
                  <input
                    type="range" min="20" max="500" step="10" value={customStorage}
                    onChange={(e) => setCustomStorage(Number(e.target.value))}
                    className="w-full accent-accent bg-border h-1.5 rounded-full cursor-pointer appearance-none"
                  />
                </div>

                {/* OS Selector Buttons */}
                <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-foreground block">Operating System</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {SUPPORTED_OS.map((os) => (
                      <button
                        key={os.name}
                        onClick={() => setSelectedOS(os.name)}
                        className={`py-3 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all text-center ${
                          selectedOS === os.name
                            ? 'bg-accent text-white'
                            : 'bg-bg text-foreground-dim border border-border hover:text-foreground'
                        }`}
                      >
                        {os.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Price Calculation Card */}
              <div className="lg:col-span-5 bg-bg border border-border p-8 rounded-md space-y-8">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-black text-foreground-dim tracking-widest">Configuration Summary</div>
                  <div className="text-4xl font-extrabold text-foreground">
                    {formatPrice(calculateCustomPrice())}
                    <span className="text-sm font-medium text-foreground-dim">/mo</span>
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-border pt-8">
                  {[
                    { label: 'Hardware', val: `${customVcpu} vCPU Threads` },
                    { label: 'Memory', val: `${customRam} GB DDR4 ECC` },
                    { label: 'Storage', val: `${customStorage} GB PCIe 4.0` },
                    { label: 'Region', val: selectedLocation },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between text-[11px] uppercase tracking-wider">
                      <span className="text-foreground-dim font-bold">{spec.label}</span>
                      <span className="text-foreground font-black">{spec.val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCustomOrder}
                  className="w-full py-4 bg-accent hover:bg-accent-muted text-white font-bold rounded-md text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                >
                  Configure Custom Node
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Feature Grid: Enterprise KVM Architecture */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight uppercase">
              Technical <span className="text-foreground-muted">Benchmarks.</span>
            </h2>
            <p className="text-foreground-muted mt-4 max-w-xl mx-auto text-base">
              Engineered for deterministic performance and zero resource contention.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {[
              { icon: Lock, title: 'KVM Isolation', desc: 'Kernel-based Virtual Machine ensures strictly dedicated compute and memory IOPS.' },
              { icon: Terminal, title: 'SolusVM Stack', desc: 'Full root access with automated OS delivery and HTML5-based remote VNC.' },
              { icon: ShieldCheck, title: 'DDoS Scrubbing', desc: 'Hardware-level in-line filtration blocks volumetric and application-layer attacks.' }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-bg space-y-6">
                <div className="w-10 h-10 rounded-md bg-bg-alt border border-border flex items-center justify-center text-accent">
                  <item.icon size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">{item.title}</h3>
                  <p className="text-[13px] text-foreground-muted leading-relaxed">
                    {item.desc}
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
