import React from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { 
  Cpu, 
  Zap, 
  Globe, 
  HardDrive, 
  Server, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  ZapOff,
  History
} from 'lucide-react';
import { AppData, Plan } from '../types';

interface CategoryPageProps {
  data: AppData;
  handleOrder: (plan: Plan) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ data, handleOrder }) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  // Normalize ID for matching (e.g. "vps-hosting" -> "VPS")
  const normalizedSearch = (categoryId || '').replace(/-/g, ' ').toLowerCase();
  
  const categoryPlans = (data?.plans || []).filter(p => {
    const pCat = (p.category || '').toLowerCase();
    return pCat === normalizedSearch || pCat.includes(normalizedSearch) || normalizedSearch.includes(pCat);
  }).sort((a, b) => (a.order || 0) - (b.order || 0));

  const categoryName = categoryId ? categoryId.split('-').map(word => word.toUpperCase()).join(' ') : 'HOSTING';

  if (categoryPlans.length === 0) {
    return (
      <div className="min-h-screen bg-[#050409] text-slate-100 pt-40 pb-20 px-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-purple-950/30 rounded-3xl border border-purple-900/40 flex items-center justify-center mx-auto mb-8">
            <ZapOff size={40} className="text-purple-500 opacity-50" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase font-sans tracking-tight">No Plans Found</h2>
          <p className="text-slate-400 font-light leading-relaxed">
            We couldn't find any active plans for <span className="text-purple-400 font-bold">"{categoryName}"</span>. 
            The infrastructure for this category might be under maintenance or currently out of stock.
          </p>
          <div className="pt-8">
            <Link to="/" className="px-8 py-3 bg-[#120e20] border border-purple-900/40 text-white font-bold rounded-xl hover:bg-purple-600 transition-all inline-flex items-center gap-2 group">
              <History size={18} className="group-hover:-rotate-45 transition-transform" />
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Breadcrumb & Title */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bg-alt border border-border text-[10px] font-bold uppercase tracking-wider text-foreground-dim mb-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-foreground">{categoryName}</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6 text-balance"
          >
            {categoryName} <span className="text-foreground-muted">Infrastructure.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed text-balance">
            Enterprise-grade hosting solutions optimized for {categoryName.toLowerCase()} workloads. 
            Deploy on high-frequency hardware with unmetered 10Gbps connectivity.
          </p>
        </div>

        {/* Plans Grid - High Precision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {categoryPlans.map((plan, idx) => {
            const isPopular = plan.badge?.toLowerCase().includes('popular') || plan.badge?.toLowerCase().includes('best');
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-bg p-8 flex flex-col justify-between group relative"
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-accent uppercase">
                      {plan.badge || 'Standard'}
                    </span>
                    {isPopular && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-accent/10 text-accent font-bold uppercase">Popular</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-[13px] text-foreground-muted mb-8 leading-relaxed line-clamp-2 min-h-[40px]">
                    {plan.desc}
                  </p>

                  <div className="mb-8">
                    <div className="text-[10px] uppercase font-bold text-foreground-dim tracking-wider mb-1">Monthly Configuration</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-foreground">₹{plan.price_inr || plan.price}</span>
                      <span className="text-sm font-medium text-foreground-dim">/mo</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10 border-t border-border pt-8">
                    {plan.features.slice(0, 6).map((feature, fIdx) => {
                      return (
                        <div key={fIdx} className="flex items-center gap-3 text-[13px] text-foreground-muted">
                          <CheckCircle2 size={16} className="text-accent shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => handleOrder(plan)}
                  className={`w-full py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-accent hover:bg-accent-muted text-white shadow-xl shadow-accent/20'
                      : 'bg-bg-alt hover:bg-border border border-border text-foreground'
                  }`}
                >
                  Configure Server
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Trust Section - Simplified */}
        <div className="mt-32 grid md:grid-cols-3 gap-12 pt-16 border-t border-border">
          {[
            { icon: ShieldCheck, title: 'Hardened Security', desc: 'Enterprise DDoS scrubbing and biometric-secured facilities.' },
            { icon: Zap, title: 'Automated Delivery', desc: 'Services are provisioned instantly upon payment verification.' },
            { icon: Server, title: 'Network Integrity', desc: '10Gbps unthrottled uplinks with carrier-grade peering.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-10 h-10 rounded-md bg-bg-alt border border-border flex items-center justify-center shrink-0">
                <item.icon className="text-accent" size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-foreground font-bold text-sm uppercase tracking-wide">{item.title}</h4>
                <p className="text-foreground-dim text-[12px] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
