import React from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Layout,
  HardDrive,
  Mail,
  Lock,
  Database,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { AppData, Plan } from '../types';

interface WebHostingPageProps {
  data: AppData;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  handleOrder: (plan: Plan) => void;
}

interface WebPlanSpec {
  id: string;
  name: string;
  badge: string;
  sites: string;
  storage: string;
  ram: string;
  bandwidth: string;
  priceInr: number;
  popular?: boolean;
  desc: string;
}

const WEB_PLANS: WebPlanSpec[] = [];

export const WebHostingPage: React.FC<WebHostingPageProps> = ({
  data,
  handleOrder,
}) => {
  // Render database Web plans dynamically from Firestore
  const dbWebPlans = (data?.plans?.filter(p => {
    const cat = (p.category || '').toLowerCase();
    return cat === 'web-hosting' || cat.includes('web');
  }) || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  if (dbWebPlans.length === 0) {
    return (
      <div className="bg-bg min-h-screen text-text-primary pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold opacity-50">No web hosting plans available at the moment.</h2>
        <p className="text-text-secondary mt-2">Please check back later or add plans via the Admin Panel.</p>
      </div>
    );
  }

  const displayPlans = dbWebPlans.map(plan => ({
    id: plan.id,
    name: plan.name,
    badge: plan.badge || 'LITESPEED',
    sites: plan.features[0] || '1 Website',
    storage: plan.features[1] || '15 GB NVMe',
    ram: plan.features[2] || '1 GB RAM',
    bandwidth: plan.features[3] || 'Unmetered',
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

  const features = [
    {
      icon: <Zap className="text-yellow-400" />,
      title: 'LiteSpeed Powered',
      desc: 'Industry-leading web server technology for up to 10x faster page loads.'
    },
    {
      icon: <ShieldCheck className="text-green-400" />,
      title: 'DDoS Protection',
      desc: 'Enterprise-grade protection against layer 7 and volumetric attacks.'
    },
    {
      icon: <Lock className="text-blue-400" />,
      title: 'Free SSL Certificates',
      desc: 'Automatic Let\'s Encrypt SSL for all your domains and subdomains.'
    },
    {
      icon: <RefreshCw className="text-purple-400" />,
      title: 'Daily Backups',
      desc: 'Automated off-site backups ensuring your data is always safe.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Service / Web Delivery
          </span>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Web <span className="text-foreground-muted">Platform.</span>
          </motion.h1>

          <p className="text-foreground-muted text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
            Enterprise-grade web hosting powered by LiteSpeed™ Enterprise. Optimized for deterministic page loads and 100% availability for high-traffic assets.
          </p>

          {/* Indian Currency Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-bg-alt border border-border rounded-md text-[10px] font-black uppercase tracking-widest text-foreground-dim shadow-sm">
            <span>🇮🇳</span>
            <span>INR (₹) Global Hosting</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden mb-32 max-w-5xl mx-auto">
          {displayPlans.map((plan, idx) => (
            <motion.div
              key={plan.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`bg-bg p-10 flex flex-col justify-between transition-all duration-300 relative group`}
            >
              <div>
                <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase block mb-3">
                  {plan.badge}
                </span>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-3">
                  {plan.name}
                </h3>
                <p className="text-[13px] text-foreground-muted mb-8 leading-relaxed">
                  {plan.desc}
                </p>

                {/* Price Display */}
                <div className="bg-bg-alt border border-border rounded-md p-6 mb-8">
                  <div className="text-[10px] uppercase font-black tracking-widest text-foreground-dim mb-1">Monthly Operations</div>
                  <div className="text-3xl font-black text-foreground tracking-tighter">
                    {formatPrice(plan.priceInr)}
                    <span className="text-xs font-normal text-foreground-dim ml-1">/MO</span>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-4 mb-10">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-4 text-[13px] text-foreground-muted">
                      <CheckCircle2 size={16} className="text-accent shrink-0" />
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOrder(plan as any)}
                className={`w-full py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-border hover:border-accent hover:bg-accent hover:text-white`}
              >
                <span>Initialize Platform</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Platform Integration
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Web <span className="text-foreground-muted">Governance.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {[
              { icon: Zap, title: 'LiteSpeed Tech', desc: 'Deterministic performance scaling for sub-200ms TTFB across all global nodes.' },
              { icon: ShieldCheck, title: 'DDoS Immunity', desc: 'Inline mitigation at the edge to ensure continuous operations during volumetric incidents.' },
              { icon: Lock, title: 'TLS Governance', desc: 'Automated certificate lifecycle management for all primary and derivative domains.' },
              { icon: RefreshCw, title: 'Data Redundancy', desc: 'Immutable off-site snapshotting for absolute data recoverability in all scenarios.' }
            ].map((feat, i) => (
              <div key={i} className="p-8 bg-bg space-y-6">
                <div className="w-10 h-10 rounded bg-bg-alt border border-border flex items-center justify-center text-accent">
                  <feat.icon size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-foreground uppercase tracking-tight">{feat.title}</h3>
                  <p className="text-[13px] text-foreground-muted leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
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
            {[
              { q: "Which control panel do you use?", a: "We offer both cPanel and DirectAdmin depending on your preference. LiteSpeed Enterprise is pre-configured on all our web hosting nodes." },
              { q: "Is SSL included for free?", a: "Yes! Every domain hosted with us gets a free, automatically renewing Let's Encrypt SSL certificate." },
              { q: "Can I upgrade my plan later?", a: "Absolutely. You can upgrade from Starter to Business seamlessly without any downtime or website migration required." },
              { q: "Do you offer free migrations?", a: "Yes, we offer free professional migration for cPanel to cPanel moves. For other panels, our support team will assist you manually." }
            ].map((faq, i) => (
              <div key={i} className="p-8 bg-bg">
                <h4 className="text-[15px] font-black text-foreground uppercase tracking-tight mb-3">
                  {faq.q}
                </h4>
                <p className="text-sm text-foreground-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
