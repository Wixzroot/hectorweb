import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureBannersSection } from '../components/FeatureBannersSection';
import { GameHostingSection } from '../components/GameHostingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FaqSection } from '../components/FaqSection';
import { AppData } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, ChevronRight, Server, HardDrive } from 'lucide-react';

interface HomeProps {
  data: AppData;
  feedbackForm: { name: string; msg: string; rating: number };
  setFeedbackForm: (form: { name: string; msg: string; rating: number }) => void;
  submitFeedback: (e: React.FormEvent) => void;
}

export const Home: React.FC<HomeProps> = ({
  data,
}) => {
  return (
    <div className="bg-[#07060b]">
      <Hero settings={data.settings} />

      {/* Feature Banners Block (3.0GHz, 10Tbps, 98.4%) */}
      <FeatureBannersSection />

      {/* Game Hosting Showcase Section */}
      <GameHostingSection />
      
      {/* Infrastructure Section - Technical & Professional */}
      <section id="infrastructure" className="py-32 bg-bg border-t border-border relative overflow-hidden text-foreground">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent block">
                    Enterprise Hardware
                  </span>
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                    Dedicated Performance. <br />
                    <span className="text-foreground-muted">Zero Overselling.</span>
                  </h2>
                  <p className="text-foreground-muted font-normal leading-relaxed max-w-lg text-base">
                    We deploy on high-frequency AMD Ryzen™ 9 5950X architecture with unmetered 10Gbps uplinks. Our infrastructure is engineered for developers who demand deterministic performance and low-latency networking.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/vps"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-accent hover:bg-accent-muted text-white font-bold rounded-md transition-all text-sm"
                  >
                    Deploy VPS
                    <ArrowRight size={18} />
                  </Link>

                  <Link 
                    to="/infrastructure"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-bg-alt border border-border text-foreground font-bold rounded-md hover:bg-border transition-all text-sm"
                  >
                    Network Map
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden">
              {[
                { icon: Zap, label: 'CPU Performance', val: '4.9 GHz Boost', desc: 'Ryzen 9 5950X Dedicated Threads' },
                { icon: HardDrive, label: 'I/O Throughput', val: '7.0 GB/s', desc: 'PCIe Gen4 NVMe Storage Arrays' },
                { icon: ShieldCheck, label: 'DDoS Scrubbing', val: '12 Tbps+', desc: 'In-line Hardware Filtration' },
                { icon: Server, label: 'Network Latency', val: '< 1ms', desc: 'Low-latency Indian Peering' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="p-8 bg-bg group"
                >
                  <stat.icon className="text-foreground-dim group-hover:text-accent transition-colors mb-4" size={24} />
                  <div className="text-[10px] uppercase font-bold text-foreground-dim tracking-wider mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.val}</div>
                  <p className="text-[11px] text-foreground-muted leading-relaxed">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection testimonials={data.testimonials} />

      {/* Frequently Asked Questions Section */}
      <FaqSection 
        supportEmail={data.settings.support_email} 
        discordUrl={data.settings.discord_url} 
      />
    </div>
  );
};
