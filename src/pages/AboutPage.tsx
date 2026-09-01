import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Target, 
  Compass, 
  Cpu, 
  Network, 
  TrendingUp, 
  Server,
  Zap,
  Clock,
  MapPin
} from 'lucide-react';
import { AppData } from '../types';
import { parseAboutMarkdown } from '../lib/policyParser';

interface AboutPageProps {
  data: AppData;
}

export const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
  const parsed = parseAboutMarkdown(data.about);

  const stats = [
    { label: 'Nodes Activated', value: '180+', icon: Server },
    { label: 'Uptime SLA Guarantee', value: '99.99%', icon: Clock },
    { label: 'Client Satisfaction', value: '4.9/5', icon: HeartHandshake },
    { label: 'Global Datacenters', value: '5 Regions', icon: MapPin },
  ];

  // Map icon to index for the foundational pillars
  const pillarIcons = [Cpu, Users, Network, ShieldCheck, Target, Compass];

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Hero Banner */}
        <div className="text-center mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Organization Identity
          </span>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-foreground uppercase tracking-tight leading-none mb-6">
            {parsed.title}
          </h1>
          <p className="text-foreground-muted text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            {parsed.subtitle}
          </p>
        </div>

        {/* Brand Value Metrics Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-24">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-bg p-8 text-center flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 bg-bg-alt rounded-md border border-border flex items-center justify-center text-accent mb-4 shrink-0">
                  <Icon size={18} />
                </div>
                <div className="text-3xl font-black text-foreground tracking-tighter mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black text-foreground-dim uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Corporate Mission & Vision Split Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {[
            { icon: Target, title: 'Strategic Objective', body: parsed.mission },
            { icon: Compass, title: 'Operating Philosophy', body: parsed.philosophy }
          ].map((item, i) => (
            <div key={i} className="bg-bg-alt border border-border p-10 rounded-lg space-y-6">
              <div className="w-12 h-12 bg-bg border border-border rounded-md flex items-center justify-center text-accent">
                <item.icon size={24} />
              </div>
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-[15px] text-foreground-muted leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
              Foundational Pillars
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight">
              Operational <span className="text-foreground-muted">Standards.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
            {parsed.values.map((pillar, idx) => {
              const Icon = pillarIcons[idx % pillarIcons.length];
              return (
                <div 
                  key={idx} 
                  className="bg-bg p-8 space-y-6 group"
                >
                  <div className="w-10 h-10 bg-bg-alt border border-border text-accent rounded flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-foreground uppercase tracking-tight">{pillar.title}</h4>
                    <p className="text-[13px] text-foreground-muted leading-relaxed font-normal">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Development Timeline */}
        <div className="bg-bg-alt border border-border rounded-lg p-10 sm:p-16 mb-24">
          <h3 className="text-2xl sm:text-4xl font-black text-foreground uppercase tracking-tight mb-12 text-center sm:text-left">
            Institutional Growth.
          </h3>
          <div className="relative border-l border-border ml-4 sm:ml-6 space-y-12">
            {parsed.milestones.map((mile, idx) => (
              <div key={idx} className="relative pl-10 sm:pl-12 group">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 -translate-x-1/2 w-3.5 h-3.5 bg-bg border-2 border-accent rounded-full group-hover:scale-125 transition-transform" />
                
                <span className="inline-block px-2 py-0.5 rounded bg-bg border border-border text-[10px] font-black text-accent uppercase tracking-widest mb-3">
                  {mile.year}
                </span>
                <h4 className="text-lg font-black text-foreground uppercase tracking-tight">
                  {mile.title}
                </h4>
                <p className="text-sm text-foreground-muted mt-2 max-w-2xl leading-relaxed">
                  {mile.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
