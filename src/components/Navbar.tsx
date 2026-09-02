import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, Shield, Server, Gamepad2, Cpu, Building2, Scale, Home, Zap, Bot, Box, LayoutGrid, Globe, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from '../types';
import { ResourceDrawer } from './ResourceDrawer';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { GAME_CATALOG } from '../data/games';

interface NavbarProps {
  settings: Settings;
  categories: string[];
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  settings, 
  categories = [],
  toggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const siteTitle = settings.site_name && settings.site_name !== 'Untitled' ? settings.site_name : 'HectorHosting';

  return (
    <>
      {/* Maintenance Mode Banner */}
      {settings.maintenance_mode && (
        <div className="bg-amber-600/90 text-white text-[11px] font-bold py-2.5 px-4 text-center border-b border-amber-500/30 flex items-center justify-center gap-2 sticky top-0 z-[60] uppercase tracking-wider">
          <Shield className="text-amber-200" size={14} />
          <span>{settings.maintenance_message || 'System scheduled maintenance is currently active.'}</span>
        </div>
      )}

      {/* Top Announcement Alert Bar */}
      {settings.show_announcement && settings.announcement_text && !settings.maintenance_mode && (
        <div className="bg-accent text-white text-[11px] py-2.5 px-4 text-center border-b border-white/10 font-bold flex items-center justify-center gap-2 sticky top-0 z-[60] uppercase tracking-widest">
          <Zap className="text-white" size={13} />
          <span>{settings.announcement_text}</span>
        </div>
      )}

      <nav 
        className={`fixed left-0 right-0 z-50 transition-all duration-200 ${
          settings.show_announcement || settings.maintenance_mode ? 'top-[36.5px]' : 'top-0'
        } ${
          scrolled 
            ? 'bg-bg/95 backdrop-blur-md py-3 border-b border-border shadow-sm' 
            : 'bg-bg/50 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size={32} className="group-hover:scale-105 transition-transform duration-200" />
            <span className="text-lg font-black tracking-tighter text-foreground font-sans flex items-center gap-0.5">
              HECTOR<span className="text-foreground-muted">HOSTING</span>
            </span>
          </Link>

          {/* Desktop Links with Dropdowns */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>

            {/* Game Hosting Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('game')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link to="/game-servers" className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1.5 py-2">
                Game Servers
                <ChevronDown size={12} className="text-foreground-dim" />
              </Link>

              <AnimatePresence>
                {activeDropdown === 'game' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full -left-20 w-[600px] p-2 bg-bg-alt border border-border rounded-lg shadow-2xl z-50 grid grid-cols-3 gap-1"
                  >
                    {GAME_CATALOG.slice(0, 8).map((game) => (
                      <Link 
                        key={game.id}
                        to={`/game/${game.id.replace('game-', '')}`}
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-bg text-left transition-all group"
                      >
                        <img 
                          src={game.image} 
                          alt={game.title}
                          className="w-10 h-10 object-cover rounded border border-border group-hover:border-accent/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[10px] text-foreground uppercase tracking-wider group-hover:text-accent truncate">
                            {game.title}
                          </div>
                          <div className="text-[9px] text-foreground-dim mt-0.5">
                            From <span className="text-foreground">₹{game.startingPriceInr}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    
                    <Link 
                      to="/game-servers"
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-bg text-left transition-all group"
                    >
                      <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <LayoutGrid size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[10px] text-foreground uppercase tracking-wider group-hover:text-accent truncate">
                          ALL GAMES
                        </div>
                        <div className="text-[9px] text-foreground-dim mt-0.5">
                          Browse 100+ titles
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Infrastructure Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('other')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground transition-colors flex items-center gap-1.5 py-2">
                Infrastructure
                <ChevronDown size={12} className="text-foreground-dim" />
              </button>

              <AnimatePresence>
                {activeDropdown === 'other' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 w-64 p-2 bg-bg-alt border border-border rounded-lg shadow-2xl space-y-1 z-50"
                  >
                    {categories.map((cat) => {
                      const id = cat.toLowerCase().replace(/\s+/g, '-');
                      let Icon = Server;
                      let label = cat;

                      if (cat === 'VPS') { Icon = Cpu; label = "KVM VPS"; }
                      else if (cat === 'GAME-HOSTING') { Icon = Gamepad2; label = "Games"; }
                      else if (cat === 'WEB-HOSTING') { Icon = Globe; label = "Web"; }
                      else if (cat === 'BOT-HOSTING') { Icon = Bot; label = "Bot"; }

                      return (
                        <Link 
                          key={cat} 
                          to={`/${id}`} 
                          className="flex items-center gap-3 p-3 rounded-md hover:bg-bg text-[10px] text-foreground-muted hover:text-accent transition-all group"
                        >
                          <div className="w-8 h-8 rounded bg-bg border border-border flex items-center justify-center text-foreground-dim group-hover:text-accent group-hover:border-accent/30">
                            <Icon size={14} />
                          </div>
                          <span className="font-bold uppercase tracking-widest">{label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground transition-colors">
              Company
            </Link>
            
            <Link to="/tos" className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted hover:text-foreground transition-colors">
              Legal
            </Link>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-6">
            <Link 
              to="/status" 
              className="text-[10px] font-bold tracking-widest text-foreground-dim hover:text-foreground uppercase flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-bg-alt/80 border border-transparent hover:border-border transition-all group"
              title="View Live VPS & Cluster Node Status"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-accent transition-colors">Status: Operational</span>
            </Link>

            <Link 
              to="/vps"
              className="px-6 py-2.5 bg-accent hover:bg-accent-muted text-white font-bold text-[10px] uppercase tracking-widest rounded transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-foreground-dim hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-bg-alt border-b border-border overflow-hidden"
            >
              <div className="px-6 py-10 flex flex-col gap-6">
                <Link to="/" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
                  Home
                </Link>
                <Link to="/game-servers" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted flex items-center gap-3">
                  Game Servers
                </Link>
                {categories.map((cat) => {
                  const id = cat.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link key={cat} to={`/${id}`} onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted flex items-center gap-3">
                      {cat.replace(/-/g, ' ')}
                    </Link>
                  );
                })}
                <Link to="/about" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted flex items-center gap-3">
                  Company
                </Link>
                <Link to="/tos" onClick={() => setIsOpen(false)} className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted flex items-center gap-3">
                  Legal
                </Link>

                <div className="pt-8 border-t border-border flex flex-col gap-4">
                  <Link 
                    to="/status"
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold tracking-widest text-foreground-dim hover:text-foreground uppercase flex items-center gap-2 p-2 rounded-lg hover:bg-bg-alt transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Status: All Systems Operational</span>
                  </Link>
                  <Link 
                    to="/vps"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-accent text-white font-bold text-[11px] uppercase tracking-widest rounded text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <ResourceDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};


