import React from 'react';
import { Gamepad2, Rocket, Zap, Server } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const renderLogoIcon = (logo: string) => {
  const l = (logo || '').toLowerCase();
  if (l.includes('game') || l.includes('🎮')) return <Gamepad2 className="text-purple-400" size={24} />;
  if (l.includes('rocket') || l.includes('🚀')) return <Rocket className="text-purple-300" size={24} />;
  if (l.includes('server')) return <Server className="text-emerald-400" size={24} />;
  return <Zap className="text-amber-400" size={24} />;
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section id="customers" className="py-32 bg-bg border-t border-border relative overflow-hidden text-foreground">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-24">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-accent mb-4 block">
            Technical Validation
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 uppercase">
            Trusted by Global <br />
            <span className="text-foreground-muted">Communities.</span>
          </h2>
          <p className="text-foreground-muted text-base md:text-lg font-normal leading-relaxed max-w-xl">
            Infrastructure verification and service performance metrics from our leading mission-critical deployment partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="p-10 bg-bg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-12 h-12 flex items-center justify-center bg-bg-alt rounded-md border border-border text-accent">
                    {renderLogoIcon(t.logo)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground tracking-tight">{t.name}</h4>
                    <p className="text-[10px] text-foreground-dim font-black uppercase tracking-widest mt-1">{t.server}</p>
                  </div>
                </div>

                <p className="text-sm md:text-base text-foreground-muted font-normal leading-relaxed italic mb-10">
                  "{t.note}"
                </p>
              </div>

              <div className="pt-6 border-t border-border flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-foreground-dim">Verified Client</span>
                <span className="text-emerald-500">Service Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
