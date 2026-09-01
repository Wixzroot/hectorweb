import React from 'react';
import { motion } from 'motion/react';
import { Star, MessageSquare } from 'lucide-react';
import { Feedback } from '../types';

interface FeedbackSectionProps {
  feedbacks: Feedback[];
  feedbackForm: { name: string; msg: string; rating: number };
  setFeedbackForm: (form: { name: string; msg: string; rating: number }) => void;
  submitFeedback: (e: React.FormEvent) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedbacks,
  feedbackForm,
  setFeedbackForm,
  submitFeedback,
}) => {
  return (
    <section id="feedback" className="py-24 bg-[#07060b] border-t border-purple-900/30 relative text-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-purple-400 mb-3 block">User Feedback</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Share Your Experience</h2>
            <p className="text-slate-400 text-sm md:text-base font-normal leading-relaxed mb-10 max-w-lg">
              We constantly optimize our hardware and network routes based on client insights. 
              Leave a rating or review to help us build a better experience.
            </p>
            
            <div className="space-y-4">
              {feedbacks.slice(-2).reverse().map(f => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#120e20] border border-purple-900/40 rounded-xl"
                  key={f.id}
                >
                  <div className="flex gap-1 mb-3 text-amber-400">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} size={14} fill={i < f.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed mb-3">"{f.msg}"</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                    <span className="font-semibold text-slate-300">{f.name || 'Anonymous User'}</span>
                    <span>{f.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <form onSubmit={submitFeedback} className="p-8 md:p-10 bg-[#120e20] border border-purple-900/40 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Submit Feedback</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Name (Optional)</label>
                <input 
                  type="text"
                  value={feedbackForm.name}
                  onChange={e => setFeedbackForm({...feedbackForm, name: e.target.value})}
                  className="w-full bg-[#08070d] border border-purple-900/40 rounded-lg p-3 text-sm text-slate-200 focus:border-purple-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="Your Name or Server Handle"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">Feedback Message</label>
                <textarea 
                  required
                  value={feedbackForm.msg}
                  onChange={e => setFeedbackForm({...feedbackForm, msg: e.target.value})}
                  className="w-full bg-[#08070d] border border-purple-900/40 rounded-lg p-3 text-sm text-slate-200 focus:border-purple-500 outline-none h-32 transition-all placeholder:text-slate-600"
                  placeholder="Tell us about your experience, latency, or support response..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-3 block">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button 
                      key={v}
                      type="button"
                      onClick={() => setFeedbackForm({...feedbackForm, rating: v})}
                      className={`w-10 h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                        v <= feedbackForm.rating 
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40' 
                          : 'bg-[#08070d] text-slate-400 border border-purple-900/40 hover:border-purple-500/40'
                      }`}
                    >
                      {v} ★
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40 text-xs uppercase tracking-wider"
              >
                <MessageSquare size={16} />
                Post Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
