import React from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  Phone, 
  Mail, 
  BookOpen, 
  FileText, 
  Activity, 
  LayoutGrid, 
  Headphones, 
  Building, 
  PhoneCall, 
  RotateCcw, 
  Gamepad2, 
  Cpu, 
  Server, 
  Layers,
  Globe, 
  Cloud, 
  Bot, 
  ArrowUp,
  Youtube
} from 'lucide-react';
import { AppData } from '../types';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface FooterProps {
  data: AppData;
  setIsAdminMode: (mode: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({ data, setIsAdminMode }) => {
  const brandName = data.settings.site_name && data.settings.site_name !== 'Untitled' ? data.settings.site_name : 'HectorHosting';
  const whatsappPhone = data.settings.whatsapp_number ? data.settings.whatsapp_number.replace(/\D/g, '') : '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-24 pb-12 border-t border-border bg-bg text-foreground relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Left Column: Brand & Description */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <Logo size={32} />
                <span className="font-black text-xl tracking-tighter text-foreground font-sans flex items-center gap-0.5">
                  HECTOR<span className="text-foreground-muted">HOSTING</span>
                </span>
              </Link>
              
              <p className="text-foreground-muted font-normal leading-relaxed text-sm max-w-sm text-balance">
                HectorHosting provides deterministic infrastructure and high-frequency hosting solutions for global enterprises and mission-critical applications.
              </p>
            </div>

            {/* Contact Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 bg-bg-alt border border-border rounded-md">
                <div className="text-[10px] uppercase font-black text-foreground-dim tracking-[0.15em] mb-2">Technical Support</div>
                <div className="text-sm font-bold text-foreground">support@hectorhosting.com</div>
              </div>
              <div className="p-5 bg-bg-alt border border-border rounded-md">
                <div className="text-[10px] uppercase font-black text-foreground-dim tracking-[0.15em] mb-2">Sales Inquiry</div>
                <div className="text-sm font-bold text-foreground">{data.settings.whatsapp_number || '+91 53 6235 0277'}</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-8">
                Infrastructure
              </h4>
              <ul className="space-y-4">
                {data.categories.map((cat) => {
                  const id = cat.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <li key={cat}>
                      <Link to={`/${id}`} className="text-[13px] text-foreground-muted hover:text-accent transition-colors">
                        {cat.replace(/-/g, ' ')}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-8">
                Company
              </h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">About Enterprise</Link></li>
                <li><Link to="/status" className="text-[13px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1.5">Node Status & SLA</Link></li>
                <li><Link to="/infrastructure" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">Network Map</Link></li>
                <li><Link to="/contact" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">Contact Center</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em] mb-8">
                Legal
              </h4>
              <ul className="space-y-4">
                <li><Link to="/tos" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-[13px] text-foreground-muted hover:text-accent transition-colors">SLA & Refunds</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[11px] font-bold text-foreground-dim uppercase tracking-widest">
            © 2024-2026 {brandName}. High-Frequency Infrastructure.
          </div>

          <div className="flex items-center gap-8">
            <Link 
              to="/status" 
              className="flex items-center gap-2 text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors group"
              title="View Live VPS & Cluster Node Status"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
              <span>All Systems Operational</span>
            </Link>
            
            <button 
              onClick={() => setIsAdminMode(true)}
              className="text-[10px] font-black text-foreground-dim hover:text-accent uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <LogIn size={12} />
              Auth
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Back to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 z-50 w-10 h-10 bg-accent hover:bg-accent-muted text-white rounded-md shadow-2xl flex items-center justify-center transition-all hover:-translate-y-1"
      >
        <ArrowUp size={18} strokeWidth={3} />
      </button>
    </footer>
  );
};



