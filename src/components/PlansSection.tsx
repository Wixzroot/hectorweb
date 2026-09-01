import React from 'react';
import { Plan, AppData } from '../types';
import { PlanCard } from './PlanCard';
import { AnimatePresence } from 'motion/react';

interface PlansSectionProps {
  data: AppData;
  filteredPlans: Plan[];
  activeCurrency?: 'USD' | 'INR' | 'EUR';
  activeCategory: string;
  setActiveCurrency?: (c: 'USD' | 'INR' | 'EUR') => void;
  setActiveCategory: (c: string) => void;
  handleOrder: (plan: Plan) => void;
}

export const PlansSection: React.FC<PlansSectionProps> = ({
  data,
  filteredPlans,
  activeCategory,
  setActiveCategory,
  handleOrder,
}) => {
  return (
    <section id="plans" className="py-24 bg-[#07060b] border-t border-purple-900/30 relative text-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-purple-400 mb-3 block">Available Deployment Plans</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Select Hosting Plan</h2>
          </div>
          
          <div className="flex flex-col gap-4 items-start md:items-end">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveCategory('ALL')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === 'ALL' 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                    : 'bg-[#120e20] text-slate-400 border-purple-900/40 hover:border-purple-500/40 hover:text-white'
                }`}
              >
                All Plans
              </button>
              {data.categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                    activeCategory === cat 
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md' 
                      : 'bg-[#120e20] text-slate-400 border-purple-900/40 hover:border-purple-500/40 hover:text-white'
                  }`}
                >
                  {cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                onOrder={handleOrder}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
