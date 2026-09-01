import React from 'react';
import { Check, ArrowRight, MapPin, Cpu, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Plan } from '../types';

interface PlanCardProps {
  plan: Plan;
  currency?: 'USD' | 'INR' | 'EUR';
  onOrder: (plan: Plan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onOrder }) => {
  const badgeLower = (plan.badge || '').toLowerCase();
  const isPopular = badgeLower.includes('popular') || badgeLower.includes('best') || badgeLower.includes('ultimate');

  const getPrice = () => {
    return { symbol: '₹', value: plan.price_inr || plan.price };
  };

  const { symbol, value } = getPrice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-200 group ${
        isPopular 
          ? 'bg-[#150f26] border-purple-500/70 shadow-xl shadow-purple-900/20' 
          : 'bg-[#120e20] border-purple-900/40 hover:border-purple-500/50 hover:bg-[#18132b] shadow-md'
      }`}
    >
      {plan.badge && (
        <div className={`absolute -top-3.5 left-6 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md shadow-md flex items-center gap-1.5 ${
          isPopular
            ? 'bg-purple-600 text-white border border-purple-400/50'
            : 'bg-slate-800 text-slate-300 border border-slate-700'
        }`}>
          <Zap size={10} className="text-purple-200" />
          {plan.badge}
        </div>
      )}

      <div className="mb-6 pt-2">
        <h3 className="text-2xl font-bold tracking-tight mb-2 text-white group-hover:text-purple-300 transition-colors">
          {plan.name}
        </h3>
        <p className="text-xs text-slate-400 font-normal h-10 line-clamp-2 mb-4 leading-relaxed">
          {plan.desc}
        </p>
        
        <div className="flex flex-wrap gap-2 pt-3 border-t border-purple-900/30">
           <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-300 bg-[#08070d] px-2.5 py-1 rounded border border-purple-900/40">
              <MapPin size={10} className="text-purple-400" />
              {plan.location || 'Global Node'}
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-slate-300 bg-[#08070d] px-2.5 py-1 rounded border border-purple-900/40">
              <Cpu size={10} className="text-slate-300" />
              {plan.node || 'High Frequency'}
           </div>
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-purple-900/30">
        <span className="text-xl text-slate-400 font-bold">{symbol}</span>
        <span className="text-4xl font-extrabold font-mono text-white tracking-tight">{value}</span>
        <span className="text-slate-500 text-xs font-mono ml-1">/month</span>
      </div>

      <div className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Check size={10} className="text-purple-400" />
            </div>
            <span className="text-xs text-slate-300 font-normal leading-snug">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onOrder(plan)}
        className={`w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn ${
          isPopular 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40' 
            : 'bg-[#18132b] border border-purple-900/40 text-slate-200 hover:bg-purple-600 hover:border-purple-500 hover:text-white'
        }`}
      >
        Order Now
        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
};
