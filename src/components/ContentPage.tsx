import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';

interface ContentPageProps {
  title: string;
  content: string;
}

export const ContentPage: React.FC<ContentPageProps> = ({ title, content }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07060b] text-slate-100 pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              {title}
            </h1>
            <div className="w-16 h-1 bg-purple-500 rounded-full" />
          </header>
          
          <div className="bg-[#120e20] border border-purple-900/40 p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-purple-400 prose-strong:text-white">
               <div className="markdown-body text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  <Markdown>{content}</Markdown>
               </div>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-center py-6 border-t border-purple-900/30">
            <div className="text-xs text-slate-500 font-mono">
              HectorHosting Official Documentation
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs text-purple-400 font-bold hover:underline"
            >
              Back to top
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
