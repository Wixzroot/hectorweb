import React from 'react';
import { motion } from 'motion/react';
import serverRackBg from '../assets/images/server_rack_bg_1788180841750.jpg';

export const FeatureBannersSection: React.FC = () => {
  return (
    <section className="py-24 bg-bg text-foreground relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-4">
        {/* Banner 1: Server Performance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-lg overflow-hidden border border-border bg-bg-alt group"
        >
          {/* Background Server Graphic Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${serverRackBg})` }}
          />

          <div className="relative z-10 grid md:grid-cols-12 items-center p-8 md:p-12 gap-12">
            {/* Left Stat Box */}
            <div className="md:col-span-4 pl-6 border-l-2 border-emerald-500">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-foreground-dim block mb-2">
                Compute Frequency
              </span>
              <div className="text-5xl md:text-6xl font-black text-foreground tracking-tighter">
                5.3GHz
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-foreground-dim block mt-2">
                Turbo Performance
              </span>
            </div>

            {/* Right Text Description */}
            <div className="md:col-span-8">
              <p className="text-foreground-muted text-base leading-relaxed max-w-2xl">
                Infrastructure nodes are powered by high-frequency AMD Ryzen™ 9 5950X processors, ensuring consistent frame-times and zero micro-stuttering for demanding game server environments and real-time applications.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Banner 2: DDoS Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-lg overflow-hidden border border-border bg-bg-alt group"
        >
          <div 
            className="absolute inset-0 opacity-[0.03] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${serverRackBg})` }}
          />

          <div className="relative z-10 grid md:grid-cols-12 items-center p-8 md:p-12 gap-12">
            {/* Left Text Description */}
            <div className="md:col-span-8 order-2 md:order-1">
              <p className="text-foreground-muted text-base leading-relaxed max-w-2xl">
                All traffic is routed through our global edge network, providing in-line 10Tbps scrubbing for volumetric attacks. Automated filtration at Layer 3, 4, and 7 ensures zero disconnection during malicious events.
              </p>
            </div>

            {/* Right Stat Box */}
            <div className="md:col-span-4 order-1 md:order-2 md:text-right pr-6 md:border-r-2 border-rose-500 md:border-l-0 border-l-2 border-rose-500 pl-6 md:pl-0">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-rose-500 block mb-2">
                Network Security
              </span>
              <div className="text-5xl md:text-6xl font-black text-foreground tracking-tighter">
                10Tbps+
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-foreground-dim block mt-2">
                Scrubbing Capacity
              </span>
            </div>
          </div>
        </motion.div>

        {/* Banner 3: Guaranteed Uptime */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-lg overflow-hidden border border-border bg-bg-alt group"
        >
          <div 
            className="absolute inset-0 opacity-[0.03] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${serverRackBg})` }}
          />

          <div className="relative z-10 grid md:grid-cols-12 items-center p-8 md:p-12 gap-12">
            {/* Left Stat Box */}
            <div className="md:col-span-4 pl-6 border-l-2 border-emerald-500">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 block mb-2">
                Service Reliability
              </span>
              <div className="text-5xl md:text-6xl font-black text-foreground tracking-tighter">
                99.9%
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-foreground-dim block mt-2">
                SLA Guarantee
              </span>
            </div>

            {/* Right Text Description */}
            <div className="md:col-span-8">
              <p className="text-foreground-muted text-base leading-relaxed max-w-2xl">
                Redundant power arrays, multiple tier-1 carrier uplinks, and RAID-10 NVMe storage ensure deterministic availability. Our Service Level Agreement guarantees professional-grade uptime for enterprise workloads.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Summary Blurb */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-16 text-center max-w-2xl mx-auto"
        >
          <p className="text-foreground-dim text-[11px] font-bold uppercase tracking-[0.2em] leading-loose">
            Deterministic Hardware. Global Connectivity. Mission-Critical Support.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
