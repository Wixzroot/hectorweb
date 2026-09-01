import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Info, Database, FileText, Shield, RefreshCcw, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResourceDrawer: React.FC<ResourceDrawerProps> = ({ isOpen, onClose }) => {
  const links = [
    { label: 'About Company', href: '/about', icon: Info, desc: 'Our mission and performance philosophy' },
    { label: 'Infrastructure', href: '/infrastructure', icon: Database, desc: 'Hardware stack and global data centers' },
    { label: 'Terms of Service', href: '/tos', icon: FileText, desc: 'Acceptable use and legal agreements' },
    { label: 'Privacy Policy', href: '/privacy', icon: Shield, desc: 'Your data protection and security info' },
    { label: 'Refund Policy', href: '/refund', icon: RefreshCcw, desc: 'Our 30-day performance guarantee' },
    { label: 'Legal Notices', href: '/legal', icon: Landmark, desc: 'Governance and compliance details' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-4 top-4 bottom-4 w-full max-w-sm bg-card/90 backdrop-blur-2xl border border-foreground/10 z-[101] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 rounded-[2rem] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent block mb-2">Central Node</span>
                <h2 className="text-2xl font-display uppercase tracking-tighter text-foreground">Navigation</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 border border-foreground/10 hover:border-accent/40 rounded-full transition-all text-foreground-dim hover:text-accent"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {links.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="flex p-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-transparent hover:border-foreground/10 group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <link.icon size={20} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wide">
                          {link.label}
                        </h4>
                        <ChevronRight size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <p className="text-[10px] text-foreground-dim font-light">
                        {link.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 p-6 bg-accent/5 border border-accent/10 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={16} className="text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
              </div>
              <p className="text-[10px] text-foreground-muted font-light leading-relaxed">
                All data transfers are encrypted. Performance metrics are synced in real-time with our global monitoring stations.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
