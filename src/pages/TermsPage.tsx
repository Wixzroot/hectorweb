import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppData } from '../types';
import { parsePolicyMarkdown } from '../lib/policyParser';

interface TermsPageProps {
  data: AppData;
}

export const TermsPage: React.FC<TermsPageProps> = ({ data }) => {
  const parsed = parsePolicyMarkdown(data.tos, 'TERMS OF SERVICE');

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground-dim hover:text-accent transition-all group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Header Block */}
        <div className="bg-bg border border-border rounded-lg p-10 mb-16 shadow-sm">
          <div className="flex items-center gap-3 text-accent mb-6">
            <FileText size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-dim">Governance Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground uppercase tracking-tight mb-4">
            {parsed.title}
          </h1>
          <p className="text-sm sm:text-base text-foreground-muted font-normal leading-relaxed text-balance">
            {parsed.subtitle || 'Operational standards and statutory obligations for the deployment of compute resources on our global Ryzen™ architectures.'}
          </p>
        </div>

        {/* Document Content Split or Stack */}
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Index Sidebar */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent block mb-4">Document Sections</span>
              <div className="bg-bg-alt border border-border rounded-lg overflow-hidden shadow-sm">
                {parsed.sections.map((sec, idx) => (
                  <a
                    key={idx}
                    href={`#${sec.id}`}
                    className="block px-6 py-4 text-[10px] font-black text-foreground-dim uppercase tracking-widest hover:text-accent hover:bg-bg transition-all border-b border-border last:border-b-0"
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Support Callout */}
            <div className="bg-bg border border-border p-6 rounded-lg space-y-4 shadow-sm">
              <div className="text-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck size={16} className="text-accent" /> Need Assistance?
              </div>
              <p className="text-[11px] text-foreground-muted leading-relaxed font-normal uppercase tracking-wider">
                Direct compliance inquiries to our legal division via <span className="font-bold text-foreground">legal@hectorhosting.com</span>.
              </p>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="lg:col-span-8 space-y-px bg-border border border-border rounded-lg overflow-hidden shadow-sm">
            {parsed.sections.map((sec, idx) => (
              <motion.div
                key={idx}
                id={sec.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-bg p-8 sm:p-12 space-y-6 scroll-mt-32"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-bg-alt border border-border flex items-center justify-center text-accent">
                    <CheckCircle size={16} />
                  </div>
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                    {sec.title}
                  </h3>
                </div>
                <div className="text-sm sm:text-base text-foreground-muted leading-relaxed font-normal whitespace-pre-wrap text-balance">
                  {sec.content}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
