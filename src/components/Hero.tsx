import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Star, Server, Cpu, Box, Bot, Code, ArrowUp, Globe, ShieldCheck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Settings } from '../types';

interface HeroProps {
  settings: Settings;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
}

export const Hero: React.FC<HeroProps> = ({ settings, activeCurrency = 'INR' }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPrice = (inrVal: number) => {
    return `₹${inrVal}`;
  };

  const brandName = settings.site_name && settings.site_name !== 'Untitled' ? settings.site_name : 'HectorHosting';

  return (
    <section className="relative min-h-[90vh] bg-bg text-foreground pt-36 pb-20 px-6 overflow-hidden flex flex-col justify-center">
      {/* Precision Background - Subtle Radial Gradient for Depth, no messy waves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Focused Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bg-alt border border-border text-[11px] font-medium tracking-tight text-foreground-muted"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>Next-Gen Infrastructure in India</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.95] text-balance"
              >
                Enterprise Hosting <br />
                <span className="text-foreground-muted">Redefined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-foreground-muted text-base md:text-lg font-normal leading-relaxed max-w-2xl text-balance"
              >
                High-performance Minecraft, VPS, and Web hosting powered by Ryzen™ 9 5950X processors and 10Gbps unmetered networking. Precision-engineered for low latency and maximum uptime.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link 
                to="/plans"
                className="px-8 py-4 bg-accent hover:bg-accent-muted text-white font-bold text-sm rounded-md transition-all flex items-center gap-2"
              >
                View Infrastructure
                <ArrowRight size={18} />
              </Link>

              <a 
                href={settings.discord_url || 'https://discord.gg/hectorhosting'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-bg-alt hover:bg-border border border-border text-foreground font-bold text-sm rounded-md transition-all"
              >
                Documentation
              </a>
            </motion.div>
          </div>

          {/* Right Column: Key Infrastructure Stats - Flat Grid */}
          <div className="lg:col-span-4 lg:pt-12">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-px bg-border border border-border rounded-lg overflow-hidden"
            >
              {[
                { label: 'Network Capacity', val: '10 Tbps+', icon: Globe },
                { label: 'Uptime SLA', val: '99.99%', icon: ShieldCheck },
                { label: 'Processor Speed', val: '4.9 GHz', icon: Cpu },
                { label: 'DDoS Filtering', val: 'Global', icon: Shield },
              ].map((stat, i) => (
                <div key={i} className="bg-bg-alt p-6 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-foreground-dim mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.val}</p>
                  </div>
                  <stat.icon size={24} className="text-foreground-dim group-hover:text-accent transition-colors" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent hover:bg-accent-muted text-white rounded-md shadow-2xl flex items-center justify-center transition-all"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </section>
  );
};


