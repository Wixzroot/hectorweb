import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  GitBranch, 
  Cpu, 
  Code2, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Server,
  FolderTree,
  SlidersHorizontal
} from 'lucide-react';
import { AppData, Plan } from '../types';

interface DiscordBotPageProps {
  data?: AppData;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  setActiveCurrency?: (c: 'USD' | 'INR' | 'EUR') => void;
  handleOrder: (plan: Plan) => void;
}

interface BotPlanSpec {
  id: string;
  name: string;
  badge: string;
  ram: string;
  cpu: string;
  storage: string;
  priceInr: number;
  popular?: boolean;
  desc: string;
  recommendedFor: string;
}

const BOT_PLANS: BotPlanSpec[] = [];

const RUNTIMES = [
  { name: 'Node.js (v18 & v20)', icon: '🟢', desc: 'Discord.js, Eris, Klasa' },
  { name: 'Python (3.11 & 3.12)', icon: '🐍', desc: 'Pycord, Disnake, Discord.py' },
  { name: 'Java (JDK 17 & 21)', icon: '☕', desc: 'JDA, Discord4J' },
  { name: 'Go (Golang 1.22)', icon: '🐹', desc: 'Disgord, DiscordGo' },
  { name: 'Rust (Cargo)', icon: '🦀', desc: 'Serenity, Twilight' },
  { name: 'C# (.NET 8.0)', icon: '💜', desc: 'DSharpPlus, Discord.Net' },
];

export const DiscordBotPage: React.FC<DiscordBotPageProps> = ({
  data,
  handleOrder,
}) => {
  const [selectedRuntime, setSelectedRuntime] = useState('Node.js (v18 & v20)');

  // Render database Discord Bot plans dynamically if configured, else fall back to static
  const dbBotPlans = (data?.plans?.filter(p => {
    const cat = (p.category || '').toLowerCase();
    return cat === 'discord-items' || cat.includes('discord') || cat.includes('bot');
  }) || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (dbBotPlans.length === 0) {
    return (
      <div className="bg-[#050409] min-h-screen text-slate-100 pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold opacity-50 uppercase font-sans">No Discord Bot plans available.</h2>
        <p className="text-slate-400 mt-2 font-light">Please check back later or add plans via the Admin Panel.</p>
      </div>
    );
  }

  const displayPlans = dbBotPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    badge: plan.badge || 'BOT CORE',
    ram: plan.features[0] || '1 GB DDR4 RAM',
    cpu: plan.features[1] || '100% Core CPU Thread',
    storage: plan.features[2] || '10 GB NVMe Storage',
    recommendedFor: plan.badge || 'PRO BOT',
    desc: plan.desc,
    features: plan.features,
    location: plan.location,
    node: plan.node,
    priceInr: Number(plan.price_inr || plan.price),
    popular: plan.badge?.toLowerCase().includes('popular') || plan.badge?.toLowerCase().includes('best') || false
  }));

  const formatPrice = (priceInr: number) => {
    return `₹${priceInr}`;
  };

  const handlePlanOrder = (bot: any) => {
    const dbPlan = data?.plans?.find(p => p.id === bot.id);
    if (dbPlan) {
      handleOrder({
        ...dbPlan,
        features: [
          ...dbPlan.features,
          `Runtime: ${selectedRuntime}`,
          `Pterodactyl Panel & Web Console`,
          `Git Auto-Deploy Webhooks`,
          `24/7 Crash Auto-Restart Engine`,
          `Instant Setup in 30 Seconds`
        ]
      });
    } else {
      const plan: Plan = {
        id: bot.id,
        name: bot.name,
        category: 'Discord-Bot-Hosting',
        badge: bot.badge,
        location: 'India (Mumbai)',
        node: 'Ryzen-Bot-Node-01',
        desc: bot.desc,
        price: String(Math.round(bot.priceInr / 83)),
        price_inr: String(bot.priceInr),
        price_eur: String(Math.round(bot.priceInr / 90)),
        features: [
          bot.ram,
          bot.cpu,
          bot.storage,
          `Runtime: ${selectedRuntime}`,
          `Pterodactyl Panel & Web Console`,
          `Git Auto-Deploy Webhooks`,
          `24/7 Crash Auto-Restart Engine`,
          `Instant Setup in 30 Seconds`
        ]
      };
      handleOrder(plan);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Service / Automated Agents
          </span>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Agent <span className="text-foreground-muted">Hosting.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            Optimized infrastructure for Discord bots and automated agents. Features deterministic availability, automated CI/CD integration, and real-time execution telemetry.
          </p>

          {/* Indian Currency Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-bg-alt border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-dim shadow-sm">
            <span>🇮🇳</span>
            <span>INR (₹) Operations</span>
          </div>
        </div>

        {/* Supported Programming Runtimes Pills */}
        <div className="bg-bg border border-border rounded-lg p-10 mb-24">
          <span className="text-[10px] uppercase font-black tracking-[0.2em] text-accent block mb-8 flex items-center gap-2">
            <Code2 size={14} /> Application Runtime Environment
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-px bg-border border border-border rounded overflow-hidden">
            {RUNTIMES.map((rt) => (
              <button
                key={rt.name}
                onClick={() => setSelectedRuntime(rt.name)}
                className={`p-6 text-left transition-all flex flex-col justify-between ${
                  selectedRuntime === rt.name
                    ? 'bg-bg-alt text-accent'
                    : 'bg-bg text-foreground-dim hover:text-foreground'
                }`}
              >
                <div className="text-2xl mb-4 grayscale group-hover:grayscale-0 transition-all">{rt.icon}</div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest mb-1">{rt.name.split(' ')[0]}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-60 font-bold">{rt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bot Plans Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32">
          {displayPlans.map((bot, idx) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`bg-bg p-8 flex flex-col justify-between transition-all duration-300 relative group`}
            >
              <div>
                <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase block mb-3">
                  {bot.badge}
                </span>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-3">
                  {bot.name}
                </h3>
                <p className="text-[13px] text-foreground-muted mb-8 leading-relaxed">
                  {bot.desc}
                </p>

                {/* Price Display */}
                <div className="bg-bg-alt border border-border rounded-md p-6 mb-8">
                  <div className="text-[10px] uppercase font-black tracking-widest text-foreground-dim mb-1">Monthly Operations</div>
                  <div className="text-3xl font-black text-foreground tracking-tighter">
                    {formatPrice(bot.priceInr)}
                    <span className="text-xs font-normal text-foreground-dim ml-1">/MO</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-4 mb-10">
                  {bot.features && bot.features.length > 0 ? (
                    bot.features.map((feature: string, fIdx: number) => {
                      let Icon = CheckCircle2;
                      if (fIdx === 0 || feature.toLowerCase().includes('ram') || feature.toLowerCase().includes('gb') || feature.toLowerCase().includes('mb')) Icon = Zap;
                      else if (fIdx === 1 || feature.toLowerCase().includes('cpu') || feature.toLowerCase().includes('thread') || feature.toLowerCase().includes('core')) Icon = Cpu;
                      else if (fIdx === 2 || feature.toLowerCase().includes('ssd') || feature.toLowerCase().includes('nvme') || feature.toLowerCase().includes('storage') || feature.toLowerCase().includes('disk')) Icon = Server;
                      else if (feature.toLowerCase().includes('deploy') || feature.toLowerCase().includes('git')) Icon = GitBranch;
                      else if (feature.toLowerCase().includes('recommend') || feature.toLowerCase().includes('for') || feature.toLowerCase().includes('bot')) Icon = Bot;

                      return (
                        <div key={fIdx} className="flex items-center gap-4 text-[13px] text-foreground-muted">
                          <Icon size={16} className="text-accent shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {[
                        { icon: Zap, val: bot.ram },
                        { icon: Cpu, val: bot.cpu },
                        { icon: Server, val: bot.storage },
                        { icon: Bot, val: bot.recommendedFor },
                        { icon: GitBranch, val: 'CI/CD Auto-Deploy' }
                      ].map((spec, i) => (
                        <div key={i} className="flex items-center gap-4 text-[13px] text-foreground-muted">
                          <spec.icon size={16} className={`shrink-0 ${i === 3 ? 'text-accent' : 'text-accent'}`} />
                          <span className="truncate">{spec.val}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handlePlanOrder(bot)}
                className={`w-full py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-accent hover:text-white`}
              >
                <span>Initialize Agent</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Developer Toolchain
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Deployment <span className="text-foreground-muted">Lifecycle.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {[
              { icon: GitBranch, title: 'Continuous Delivery', desc: 'Native integration with GitHub. Automated deployment triggers on repository commits with synchronized package resolution.' },
              { icon: RefreshCw, title: 'Runtime Watchdog', desc: 'Automated supervisor processes monitor application state. Instantaneous crash recovery and incident logging for unhandled exceptions.' },
              { icon: Terminal, title: 'Terminal Access', desc: 'Secure web-based terminal interface for manual execution, environment variable governance, and real-time log streaming.' }
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
