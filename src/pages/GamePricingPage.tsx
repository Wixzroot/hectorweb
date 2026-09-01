import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Shield, 
  Zap, 
  Server, 
  Globe, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  Clock,
  Sliders,
  MessageSquare,
  Lock,
  Star
} from 'lucide-react';
import { AppData, Plan } from '../types';
import { GAME_CATALOG } from '../data/games';

interface GamePricingPageProps {
  data: AppData;
  handleOrder: (plan: Plan) => void;
}

const TIER_NAMES = ['BRONZE / LITE', 'SILVER / STARTER', 'GOLD / PRO', 'DIAMOND / BEAST', 'NETHERITE / TITAN'];
const TIER_BADGES = ['ENTRY LEVEL', 'MOST POPULAR', 'RECOMMENDED', 'ENTERPRISE', 'EXPERT CHOICE'];

export const GamePricingPage: React.FC<GamePricingPageProps> = ({
  data,
  handleOrder,
}) => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  // Find game by multiple potential URL match patterns
  const game = GAME_CATALOG.find(g => {
    if (!gameId) return false;
    const cleanParam = gameId.toLowerCase();
    const cleanId = g.id.toLowerCase();
    return (
      cleanId === cleanParam ||
      cleanId.replace('game-', '') === cleanParam ||
      cleanId.replace('game-mc-', 'minecraft-') === cleanParam ||
      g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanParam
    );
  });

  // Redirect to game-servers if game not found
  useEffect(() => {
    if (!game) {
      navigate('/game-servers');
    }
  }, [game, navigate]);

  if (!game) return null;

  // Selected config states
  const [selectedLocation, setSelectedLocation] = useState('India (Mumbai)');
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [includePremiumSupport, setIncludePremiumSupport] = useState(false);

  const locations = [
    { name: 'India (Mumbai)', flag: '🇮🇳', ping: '12ms', load: 'Optimized' },
    { name: 'Singapore (SG)', flag: '🇸🇬', ping: '25ms', load: 'Low Load' },
    { name: 'Germany (Frankfurt)', flag: '🇩🇪', ping: '35ms', load: 'High Perf' },
    { name: 'USA (Virginia)', flag: '🇺🇸', ping: '80ms', load: 'Optimized' },
  ];

  // Find database plans matching the current gameId or general game hosting specifically for this game
  const dbGamePlans = (data.plans?.filter(p => {
    const name = (p.name || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const gameTitle = (game.title || '').toLowerCase();
    const gameIdClean = game.id.toLowerCase().replace('game-', '');
    
    // Check if plan matches this specific game by name or ID
    return (
      name.includes(gameTitle) ||
      name.includes(gameIdClean) ||
      id.includes(gameIdClean) ||
      (gameTitle.includes('minecraft') && (name.includes('mc-') || name.includes('minecraft')))
    );
  }) || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (dbGamePlans.length === 0) {
    return (
      <div className="bg-[#050409] min-h-screen text-slate-100 pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold opacity-50 uppercase font-sans">No pricing available for {game.title} yet.</h2>
        <p className="text-slate-400 mt-2 font-light">Please check back later or configure plans in the Admin Panel.</p>
      </div>
    );
  }

  const plansToRender = dbGamePlans.map((plan, idx) => ({
    id: plan.id,
    name: plan.name,
    badge: plan.badge || TIER_BADGES[idx] || 'PRO OPTION',
    ram: plan.features[0] || '4 GB DDR4 ECC RAM',
    slots: plan.features[1] || 'Unlimited Slots',
    cpu: plan.features[2] || 'Ryzen 9 5950X',
    priceInr: Number(plan.price_inr || plan.price),
    popular: plan.badge?.toLowerCase().includes('popular') || plan.badge?.toLowerCase().includes('best') || idx === 1,
    desc: plan.desc,
    features: plan.features,
    location: plan.location,
    node: plan.node
  }));

  const getPriceForOption = (basePrice: number) => {
    let price = basePrice;
    if (selectedCycle === 'quarterly') price = price * 0.9; // 10% discount
    if (selectedCycle === 'annual') price = price * 0.8; // 20% discount
    
    // Support Addon
    if (includePremiumSupport) {
      price += 150;
    }
    return Math.round(price);
  };

  const handleDeployPlan = (ramOpt: any) => {
    const finalPrice = getPriceForOption(ramOpt.priceInr);
    const dbPlan = data.plans?.find(p => p.id === ramOpt.id);
    if (dbPlan) {
      handleOrder({
        ...dbPlan,
        price_inr: String(finalPrice),
        price: String(Math.round(finalPrice / 83)),
        price_eur: String(Math.round(finalPrice / 90)),
        location: selectedLocation,
        features: [
          ...dbPlan.features,
          `Location: ${selectedLocation}`,
          `Billing Cycle: ${selectedCycle}`,
          includePremiumSupport ? 'Included: 24/7 VIP Discord Support' : 'Standard Discord Support'
        ]
      });
    } else {
      const plan: Plan = {
        id: `${game.id}-${ramOpt.ram.replace(/\s+/g, '-').toLowerCase()}`,
        name: `${game.title} Server - ${ramOpt.ram}`,
        category: 'Game-Hosting',
        badge: game.badge || 'POPULAR',
        location: selectedLocation,
        node: 'Ryzen-Node-Game',
        desc: game.description,
        price: String(Math.round(finalPrice / 83)),
        price_inr: String(finalPrice),
        price_eur: String(Math.round(finalPrice / 90)),
        features: [
          `RAM Allocation: ${ramOpt.ram}`,
          `Slots Config: ${ramOpt.slots}`,
          `Processor: ${ramOpt.cpu}`,
          `Location: ${selectedLocation}`,
          `Billing Cycle: ${selectedCycle}`,
          includePremiumSupport ? 'Included: 24/7 VIP Discord Support' : 'Standard Discord Support'
        ],
      };
      handleOrder(plan);
    }
  };

  // FAQs specific to game server hosting
  const gameFaqs = [
    {
      q: `How long does it take for my ${game.title} server to start?`,
      a: "Our system is entirely automated. Within 60 seconds of completing payment, your server will be fully provisioned, initialized, and accessible via the customized game panel. You will receive an instant confirmation details sheet."
    },
    {
      q: "Can I upgrade my RAM or player slots later?",
      a: "Absolutely. You can scale your hardware resources at any time directly through support. Your server files, modpacks, and worlds are automatically preserved during the upgrade without data loss."
    },
    {
      q: "Do you support custom mods, plugins, and modpacks?",
      a: "Yes! Our control panel provides full root file system access (via SFTP and file manager). You can install any mod, custom jar, script engine, or modpack you wish. There are no arbitrary limitations on files."
    },
    {
      q: "What DDoS Protection is active on game nodes?",
      a: "Every single node is fortified behind a 10Tbps Anycast network with game-specific inline scrubbing filters. We protect against UDP query flood exploits, port exhaustion, and server crashing attacks with zero added latency."
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
          <Link 
            to="/game-servers" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-dim hover:text-accent transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Infrastructure
          </Link>

          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em]">
            {game.category} Node Selector
          </span>
        </div>

        {/* Game Showcase Header Section */}
        <div className="bg-bg border border-border rounded-lg overflow-hidden shadow-sm mb-16">
          <div className="relative h-64 sm:h-[400px] overflow-hidden">
            <img 
              src={game.image} 
              alt={game.title} 
              className="w-full h-full object-cover object-center grayscale-[20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10">
              <h1 className="text-4xl sm:text-7xl font-extrabold text-white uppercase tracking-tight leading-[1.1] mb-6">
                {game.title} <span className="text-white/60">Server.</span>
              </h1>
              <p className="text-white/80 text-sm sm:text-base max-w-3xl font-normal leading-relaxed text-balance">
                {game.description} Provisioned on deterministic AMD Ryzen™ 9 5950X compute nodes with specialized Layer 7 DDoS mitigation and NVMe storage.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Global Configuration Controls */}
        <div className="bg-bg-alt border border-border p-8 rounded-lg mb-16 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Location Selector */}
          <div className="space-y-4 w-full md:w-auto">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-dim block">
              01 / Region Topology
            </label>
            <div className="flex flex-wrap gap-px bg-border border border-border rounded overflow-hidden">
              {locations.map((loc) => {
                const isSelected = selectedLocation === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => setSelectedLocation(loc.name)}
                    className={`px-6 py-3.5 text-left transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-bg text-accent'
                        : 'bg-bg-alt text-foreground-dim hover:text-foreground border-r border-border last:border-r-0'
                    }`}
                  >
                    <span className="text-xl grayscale group-hover:grayscale-0">{loc.flag}</span>
                    <div>
                      <span className="text-[10px] block font-black uppercase tracking-widest">{loc.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest block mt-0.5">{loc.ping}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div className="space-y-4 w-full md:w-auto">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-dim block">
              02 / Operations Cycle
            </label>
            <div className="flex bg-border p-px rounded overflow-hidden border border-border">
              {[
                { id: 'monthly', label: 'MONTHLY', discount: 'STANDARD' },
                { id: 'quarterly', label: 'QUARTERLY', discount: '10% YIELD' },
                { id: 'annual', label: 'ANNUAL', discount: '20% YIELD' },
              ].map((cycle) => {
                const isSelected = selectedCycle === cycle.id;
                return (
                  <button
                    key={cycle.id}
                    onClick={() => setSelectedCycle(cycle.id as any)}
                    className={`px-6 py-3 text-center transition-all ${
                      isSelected
                        ? 'bg-bg text-accent'
                        : 'bg-bg-alt text-foreground-dim hover:text-foreground border-r border-border last:border-r-0'
                    }`}
                  >
                    <span className="text-[10px] block font-black uppercase tracking-widest leading-none mb-1">{cycle.label}</span>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] block leading-none ${isSelected ? 'text-emerald-500' : 'text-foreground-dim opacity-50'}`}>
                      {cycle.discount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Addon VIP checkbox */}
          <div className="w-full md:w-auto self-end">
            <label className="flex items-center gap-4 p-5 bg-bg border border-border rounded-lg cursor-pointer hover:border-accent transition-all group">
              <input 
                type="checkbox" 
                checked={includePremiumSupport}
                onChange={(e) => setIncludePremiumSupport(e.target.checked)}
                className="accent-accent w-4 h-4 rounded cursor-pointer"
              />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 mb-1">
                  <span>Priority SLA Add-on</span>
                  <span className="px-2 py-0.5 rounded bg-accent text-white font-black text-[8px] tracking-widest">+₹150/MO</span>
                </div>
                <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider">Direct Engineer Access</p>
              </div>
            </label>
          </div>

        </div>

        {/* Structured Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32">
          {plansToRender.map((opt, idx) => {
            const planName = opt.name;
            const planBadge = opt.badge;
            const optionPrice = getPriceForOption(opt.priceInr);
            const isPopular = opt.popular;

            return (
              <motion.div
                key={opt.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`bg-bg p-8 flex flex-col justify-between transition-all duration-300 relative group`}
              >
                <div>
                  <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase block mb-3">
                    {planBadge}
                  </span>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">
                    {planName}
                  </h3>
                  <div className="flex gap-2 mb-8">
                    <span className="px-2 py-0.5 rounded bg-bg-alt border border-border text-[9px] font-black uppercase tracking-widest text-foreground-dim">
                      {opt.ram.toLowerCase().includes('ram') ? opt.ram : `${opt.ram} RAM`}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg-alt border border-border text-[9px] font-black uppercase tracking-widest text-foreground-dim">
                      {opt.slots}
                    </span>
                  </div>

                  {/* Price Display */}
                  <div className="bg-bg-alt border border-border rounded-md p-6 mb-10 text-center">
                    <div className="text-[10px] uppercase font-black tracking-widest text-foreground-dim mb-1">Total Operations</div>
                    <div className="text-3xl font-black text-foreground tracking-tighter">
                      ₹{optionPrice}
                      <span className="text-xs font-normal text-foreground-dim ml-1">/MO</span>
                    </div>
                  </div>

                  {/* Spec List */}
                  <div className="space-y-4 mb-12">
                    {[
                      { icon: Cpu, val: opt.cpu },
                      { icon: Zap, val: opt.ram },
                      { icon: HardDrive, val: 'NVMe RAID 10' },
                      { icon: Globe, val: opt.slots },
                      { icon: Shield, val: '10Tbps Shield' },
                      { icon: Server, val: 'v1.11 Console' }
                    ].map((spec, i) => (
                      <div key={i} className="flex items-center gap-4 text-[13px] text-foreground-muted">
                        <spec.icon size={16} className="text-accent shrink-0" />
                        <span className="truncate">{spec.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeployPlan(opt)}
                  className={`w-full py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-accent hover:text-white`}
                >
                  <span>Initialize Plan</span>
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Grid */}
        <div className="bg-bg-alt border border-border rounded-lg p-12 mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4 flex items-center justify-center gap-2">
              <Star size={14} /> Performance Governance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Hardware <span className="text-foreground-muted">Logistics.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded overflow-hidden">
            {[
              { title: 'Deterministic Setup', desc: 'Automated lifecycle routines. Node initializes instantly with selected application binaries on checkout.' },
              { icon: Sliders, title: 'Unconstrained Access', desc: 'Secure SFTP and web-based orchestrators for world state management and plugin governance.' },
              { icon: Shield, title: 'Layer 7 Mitigation', desc: 'Specialized application-aware scrubbing filters for deterministic protection against game-specific exploits.' }
            ].map((feat, idx) => (
              <div key={idx} className="p-10 bg-bg space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-bg-alt border border-border flex items-center justify-center text-accent">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-base font-black text-foreground uppercase tracking-tight">{feat.title}</h4>
                </div>
                <p className="text-sm text-foreground-muted leading-relaxed font-normal">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Infrastructure Support
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground uppercase tracking-tight">
              Platform <span className="text-foreground-muted">Documentation.</span>
            </h2>
          </div>

          <div className="grid gap-px bg-border border border-border rounded-lg overflow-hidden">
            {gameFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-bg transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-6 px-8 text-left flex items-center justify-between text-[15px] font-black text-foreground uppercase tracking-tight hover:bg-bg-alt transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`text-foreground-dim transition-transform ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-8 pb-6 text-sm text-foreground-muted leading-relaxed border-t border-border pt-4 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Other game categories bottom carousel slider */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-extrabold text-foreground uppercase tracking-tight">
                Alternative <span className="text-foreground-muted">Nodes.</span>
              </h3>
              <p className="text-[11px] text-foreground-dim font-black uppercase tracking-widest mt-2">Explore alternative multiplayer infrastructure.</p>
            </div>
            <Link to="/game-servers" className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-foreground transition-all flex items-center gap-2">
              View Catalog <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {GAME_CATALOG.filter(g => g.id !== game.id).slice(0, 4).map((otherGame) => (
              <Link
                key={otherGame.id}
                to={`/game/${otherGame.id.replace('game-', '')}`}
                className="group bg-bg overflow-hidden transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
                  <img 
                    src={otherGame.image} 
                    alt={otherGame.title} 
                    className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-6 bg-bg flex-1 flex flex-col justify-between">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest group-hover:text-accent transition-colors truncate">
                    {otherGame.title}
                  </h4>
                  <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-3">
                    FROM ₹{otherGame.startingPriceInr}/MO
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
