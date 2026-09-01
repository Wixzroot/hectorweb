import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, HardDrive, Shield, CheckCircle2, ArrowRight, Server, Globe, Sparkles } from 'lucide-react';
import { Plan } from '../types';

export interface GameInfo {
  id: string;
  title: string;
  category: string;
  image: string;
  startingPriceInr: number;
  platforms: string[];
  badge?: string;
  description: string;
  ramOptions: { ram: string; slots: string; priceInr: number; cpu: string }[];
}

interface GameDeployModalProps {
  game: GameInfo | null;
  onClose: () => void;
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  onOrderGame: (game: GameInfo, selectedConfig: { ram: string; location: string; cycle: string; price: number }) => void;
}

export const GameDeployModal: React.FC<GameDeployModalProps> = ({
  game,
  onClose,
  onOrderGame,
}) => {
  if (!game) return null;

  const [selectedRamIdx, setSelectedRamIdx] = useState(1); // Default to standard tier
  const [selectedLocation, setSelectedLocation] = useState('India (Mumbai)');
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const locations = [
    { name: 'India (Mumbai)', flag: '🇮🇳', ping: '12ms' },
    { name: 'Germany (Frankfurt)', flag: '🇩🇪', ping: '35ms' },
    { name: 'USA (Virginia)', flag: '🇺🇸', ping: '80ms' },
    { name: 'Singapore (SG)', flag: '🇸🇬', ping: '25ms' },
  ];

  const currentOption = game.ramOptions[selectedRamIdx] || game.ramOptions[0];

  const getBasePrice = () => {
    let price = currentOption.priceInr;
    if (selectedCycle === 'quarterly') price = price * 0.9; // 10% discount
    if (selectedCycle === 'annual') price = price * 0.8; // 20% discount
    return price;
  };

  const formattedPrice = () => {
    const val = getBasePrice();
    return `₹${Math.round(val)}`;
  };

  const handleDeploy = () => {
    onOrderGame(game, {
      ram: currentOption.ram,
      location: selectedLocation,
      cycle: selectedCycle,
      price: Math.round(getBasePrice()),
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#0c0916] border border-purple-900/50 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100 my-8"
        >
          {/* Top Artwork Header */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0916] via-[#0c0916]/60 to-black/30" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/10 transition-all z-20"
            >
              <X size={18} />
            </button>

            {/* Title & Badge Overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              {game.badge && (
                <span className="inline-block px-3 py-1 rounded-md bg-purple-600/80 border border-purple-400/50 text-white text-[10px] font-mono font-bold uppercase tracking-widest mb-2 shadow-md">
                  {game.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans drop-shadow-md">
                Deploy {game.title} Server
              </h2>
              <p className="text-xs text-slate-300 font-normal line-clamp-1 mt-1">
                {game.description}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
            
            {/* Step 1: Select Hardware Plan / RAM */}
            <div>
              <label className="text-xs font-mono uppercase font-bold text-slate-300 block mb-3 flex items-center justify-between">
                <span>1. Select Hardware Configuration</span>
                <span className="text-purple-400 font-normal">Ryzen 9 5950X / EPYC Silicon</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {game.ramOptions.map((opt, idx) => {
                  const isSelected = selectedRamIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedRamIdx(idx)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30'
                          : 'bg-[#120e20] border-purple-900/40 hover:border-purple-700/50'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 size={14} className="absolute top-2.5 right-2.5 text-emerald-400" />
                      )}
                      <div className="text-lg font-extrabold text-white font-mono">{opt.ram}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{opt.slots}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{opt.cpu}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Location */}
            <div>
              <label className="text-xs font-mono uppercase font-bold text-slate-300 block mb-3">
                2. Select Datacenter Location
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {locations.map((loc) => {
                  const isSelected = selectedLocation === loc.name;
                  return (
                    <button
                      key={loc.name}
                      onClick={() => setSelectedLocation(loc.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500 text-white'
                          : 'bg-[#120e20] border-purple-900/40 text-slate-400 hover:border-purple-700/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>{loc.flag} {loc.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{loc.ping}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{loc.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Billing Cycle */}
            <div>
              <label className="text-xs font-mono uppercase font-bold text-slate-300 block mb-3">
                3. Choose Billing Cycle
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'monthly', label: 'Monthly', discount: 'Standard' },
                  { id: 'quarterly', label: 'Quarterly', discount: '10% OFF' },
                  { id: 'annual', label: 'Annual', discount: '20% OFF' },
                ].map((cycle) => {
                  const isSelected = selectedCycle === cycle.id;
                  return (
                    <button
                      key={cycle.id}
                      onClick={() => setSelectedCycle(cycle.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-500 text-white font-bold'
                          : 'bg-[#120e20] border-purple-900/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs">{cycle.label}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                        {cycle.discount}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features Included List */}
            <div className="p-4 rounded-xl bg-[#080611] border border-purple-900/30 space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-purple-400 block mb-2 flex items-center gap-1.5">
                <Sparkles size={13} /> Included with Every {game.title} Server:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Instant 60s Activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>10Tbps DDoS Scrubbing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>1-Click Modpack Installer</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Pterodactyl v1.11 Control Panel</span>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer / Checkout Action */}
          <div className="p-6 bg-[#090712] border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-slate-400 font-mono uppercase">Total Due Today</div>
              <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                {formattedPrice()}
                <span className="text-xs text-slate-400 font-normal font-sans">/{selectedCycle}</span>
              </div>
            </div>

            <button
              onClick={handleDeploy}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-950/60 text-xs uppercase tracking-wider"
            >
              <span>Deploy Server Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
