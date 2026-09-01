import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  Star, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Server, 
  HelpCircle, 
  SlidersHorizontal, 
  Monitor, 
  Tv, 
  Smartphone, 
  Layers, 
  Info, 
  ArrowRight,
  Download,
  Terminal,
  Clock,
  ChevronDown
} from 'lucide-react';
import { AppData, Plan } from '../types';
import { GameDeployModal, GameInfo } from '../components/GameDeployModal';
import { GAME_CATALOG } from '../data/games';


interface GameServersPageProps {
  data: AppData;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  setActiveCurrency?: (c: 'USD' | 'INR' | 'EUR') => void;
  handleOrder: (plan: Plan) => void;
}

export const GameServersPage: React.FC<GameServersPageProps> = ({
  data,
  handleOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'name'>('popular');
  const [deployGameModal, setDeployGameModal] = useState<GameInfo | null>(null);

  // Slot calculator interactive state
  const [calcPlayerCount, setCalcPlayerCount] = useState(25);
  const [calcModLevel, setCalcModLevel] = useState<'vanilla' | 'light' | 'heavy'>('light');

  const categories = ['All', 'Popular', 'Survival', 'Sandbox', 'RPG', 'Simulation'];
  const platforms = [
    { id: 'All', label: 'All Platforms', icon: Monitor },
    { id: 'PC', label: 'PC / Steam', icon: Monitor },
    { id: 'PlayStation', label: 'PlayStation', icon: Tv },
    { id: 'Xbox', label: 'Xbox', icon: Tv },
    { id: 'Crossplay', label: 'Crossplay', icon: Layers },
    { id: 'Mobile', label: 'Mobile', icon: Smartphone },
  ];

  // Filtering & Sorting
  const filteredGames = GAME_CATALOG.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            (selectedCategory === 'Popular' && game.badge === 'POPULAR') ||
                            game.category === selectedCategory;

    const matchesPlatform = selectedPlatform === 'All' || 
                            game.platforms.includes(selectedPlatform);

    return matchesSearch && matchesCategory && matchesPlatform;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.startingPriceInr - b.startingPriceInr;
    if (sortBy === 'price-high') return b.startingPriceInr - a.startingPriceInr;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0; // default popular
  });

  const formatPrice = (priceInr: number) => {
    return `₹${priceInr}`;
  };

  // Calculate recommended specs
  const getRecommendedRAM = () => {
    let base = Math.ceil(calcPlayerCount / 10);
    if (calcModLevel === 'light') base += 2;
    if (calcModLevel === 'heavy') base += 6;
    return Math.max(2, base);
  };

  const handleModalOrder = (game: GameInfo, selectedConfig: { ram: string; location: string; cycle: string; price: number }) => {
    const dummyPlan: Plan = {
      id: game.id,
      name: `${game.title} Server (${selectedConfig.ram})`,
      category: 'Minecraft-Hosting',
      badge: game.badge || 'POPULAR',
      location: selectedConfig.location,
      node: 'Ryzen-Node-Game',
      desc: game.description,
      price: String(Math.round(selectedConfig.price / 83)),
      price_inr: String(selectedConfig.price),
      price_eur: String(Math.round(selectedConfig.price / 90)),
      features: [
        `RAM Allocation: ${selectedConfig.ram}`,
        `Instant Setup in 60s`,
        `Pterodactyl Panel v1.11`,
        `10Tbps DDoS Protection`,
        `Auto Daily Backups`,
        `Billing Cycle: ${selectedConfig.cycle}`
      ],
    };
    
    setDeployGameModal(null);
    handleOrder(dummyPlan);
  };

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Infrastructure / Multiplayer Nodes
          </span>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Game <span className="text-foreground-muted">Compute.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            Deterministic performance for competitive gaming. Provisioned on high-clock AMD Ryzen™ architectures with specialized Layer 7 DDoS mitigation and NVMe storage.
          </p>

          {/* Trustpilot Rating Bar */}
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-bg-alt border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-dim shadow-sm">
            <div className="flex items-center gap-1 text-emerald-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-current" />
              ))}
            </div>
            <span>Based on <strong className="text-foreground">25,000+ reviews</strong></span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 border-l border-border pl-3">
              Trustpilot
            </span>
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="bg-bg border border-border rounded-lg p-6 mb-16 shadow-sm space-y-6">
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-dim" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query game nodes..."
                className="w-full bg-bg-alt border border-border rounded-md py-3 pl-11 pr-4 text-[13px] text-foreground focus:border-accent outline-none transition-all placeholder:text-foreground-dim"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center bg-border p-px rounded overflow-hidden w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCategory === cat
                      ? 'bg-bg text-accent'
                      : 'bg-bg-alt text-foreground-dim hover:text-foreground border-r border-border last:border-r-0'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <span className="text-[10px] text-foreground-dim font-black uppercase tracking-widest">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-bg-alt border border-border rounded px-3 py-2 text-[11px] text-foreground outline-none focus:border-accent font-bold uppercase tracking-widest"
              >
                <option value="popular">POPULARITY</option>
                <option value="price-low">PRICE: ASC</option>
                <option value="price-high">PRICE: DESC</option>
                <option value="name">TITLE: A-Z</option>
              </select>
            </div>

          </div>

          {/* Platform Filter */}
          <div className="pt-6 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-dim mr-4 flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-accent" /> Platform Topology:
            </span>

            {platforms.map((p) => {
              const IconComponent = p.icon;
              const isSelected = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all border ${
                    isSelected
                      ? 'bg-bg-alt border-accent text-accent'
                      : 'bg-bg border-border text-foreground-dim hover:text-foreground hover:border-foreground-dim'
                  }`}
                >
                  <IconComponent size={12} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32">
          <AnimatePresence mode="popLayout">
            {filteredGames.length > 0 ? (
              filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="group bg-bg overflow-hidden transition-all duration-300 flex flex-col relative"
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-bg-alt">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    
                    {/* Minimal Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80" />

                    {/* Top Badge */}
                    {game.badge && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded bg-accent text-white font-black text-[10px] tracking-[0.2em] uppercase border border-white/20 shadow-lg">
                        {game.badge}
                      </div>
                    )}

                    {/* Quick Specs trigger */}
                    <button 
                      onClick={() => setDeployGameModal(game)}
                      className="absolute top-4 right-4 p-2 rounded bg-bg/80 border border-border text-foreground-dim hover:text-accent hover:border-accent transition-all"
                    >
                      <Info size={14} />
                    </button>

                    {/* Content Layer */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                        {game.title}
                      </h3>

                      {/* Starting Price Tag */}
                      <div className="text-[11px] text-foreground-dim font-black uppercase tracking-widest mb-4">
                        FROM <span className="text-accent text-sm ml-1">{formatPrice(game.startingPriceInr)}</span>/MO
                      </div>

                      {/* Supported Platform Badges */}
                      <div className="flex items-center gap-2">
                        {game.platforms.map((plat) => (
                          <span key={plat} className="px-2 py-0.5 rounded bg-bg/40 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/80">
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-bg border-t border-border mt-auto">
                    <Link
                      to={`/game/${game.id.replace('game-', '')}`}
                      className="w-full py-4 rounded text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-accent hover:text-white"
                    >
                      <span>Initialize Node</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-bg">
                <Gamepad2 size={48} className="mx-auto text-foreground-dim mb-4 opacity-20" />
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-2">Null Result</h3>
                <p className="text-sm text-foreground-muted">Query returned no active game nodes matching current filters.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Estimator */}
        <div className="bg-bg-alt border border-border rounded-lg p-12 mb-32 relative overflow-hidden">
          <div className="max-w-4xl">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4 flex items-center gap-2">
              <Zap size={14} /> Resource Planning Tool
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight mb-6">
              Capacity <span className="text-foreground-muted">Optimization.</span>
            </h2>
            <p className="text-foreground-muted text-base mb-12 leading-relaxed text-balance">
              Predictive scaling analysis based on deterministic player load and application complexity.
            </p>

            <div className="grid md:grid-cols-12 gap-16 items-center">
              
              <div className="md:col-span-7 space-y-10">
                
                {/* Player Slider */}
                <div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-4">
                    <span className="text-foreground-dim">Simultaneous Instances:</span>
                    <span className="text-accent text-sm">{calcPlayerCount} AGENTS</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={calcPlayerCount}
                    onChange={(e) => setCalcPlayerCount(Number(e.target.value))}
                    className="w-full accent-accent bg-border h-1.5 rounded-full cursor-pointer appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-foreground-dim font-black uppercase tracking-widest mt-4">
                    <span>Low Load</span>
                    <span>Standard Community</span>
                    <span>High Density</span>
                  </div>
                </div>

                {/* Mod Level Toggle */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground-dim block mb-4">Complexity Parameter:</label>
                  <div className="grid grid-cols-3 gap-px bg-border border border-border rounded overflow-hidden">
                    {[
                      { id: 'vanilla', label: 'OPTIMIZED' },
                      { id: 'light', label: 'EXTENDED' },
                      { id: 'heavy', label: 'MAXIMAL' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setCalcModLevel(m.id as any)}
                        className={`py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all ${
                          calcModLevel === m.id
                            ? 'bg-bg text-accent'
                            : 'bg-bg-alt text-foreground-dim hover:text-foreground'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Output Box */}
              <div className="md:col-span-5 bg-bg border border-border rounded-lg p-10 text-center shadow-sm">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground-dim block mb-2">
                  Recommended Memory
                </span>
                <div className="text-5xl font-black text-foreground tracking-tighter mb-4">
                  {getRecommendedRAM()}<span className="text-2xl ml-1">GB</span>
                </div>
                <div className="text-[10px] text-accent font-black uppercase tracking-widest mb-8">
                  Ryzen 9 5950X Optimized
                </div>

                <div className="pt-8 border-t border-border">
                  <div className="text-[10px] uppercase font-black tracking-widest text-foreground-dim mb-1">Projected Monthly</div>
                  <div className="text-2xl font-black text-emerald-500 tracking-tight">{formatPrice(getRecommendedRAM() * 75)}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Infrastructure Governance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Hardware <span className="text-foreground-muted">Logistics.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {[
              { icon: Download, title: 'Runtime Deployment', desc: 'Automated lifecycle management for modpacks and application binaries. Support for CurseForge™, Modrinth™, and legacy protocols.' },
              { icon: Terminal, title: 'Panel Orchestration', desc: 'Secure web-based control interfaces for real-time telemetry, SFTP integration, and automated redundancy routines.' },
              { icon: ShieldCheck, title: 'Volumetric Filtering', desc: 'Inline mitigation strategies for Layer 7 exploits. Sub-2ms scrubbing of volumetric UDP and SYN reflection incidents.' }
            ].map((feat, i) => (
              <div key={i} className="p-12 bg-bg space-y-8">
                <div className="w-12 h-12 rounded bg-bg-alt border border-border flex items-center justify-center text-accent">
                  <feat.icon size={24} />
                </div>
                <div className="space-y-3">
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

      {/* Deployment Modal */}
      <GameDeployModal
        game={deployGameModal}
        onClose={() => setDeployGameModal(null)}
        onOrderGame={handleModalOrder}
      />
    </div>
  );
};
