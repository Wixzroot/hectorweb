import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Why should I choose HectorHosting over other hosting providers?',
    answer: 'HectorHosting delivers unthrottled hardware powered by high-clock AMD Ryzen 9 & EPYC processors, enterprise-grade 10Tbps DDoS mitigation by default, instant automated server setup within seconds, and 24/7 technical support from experienced game server administrators.'
  },
  {
    id: 'faq-2',
    question: 'What if I experience lag on my server?',
    answer: 'Our technical team will analyze your timings, thread allocation, and routing paths to pinpoint bottle-necks. If server hardware or network congestion is ever detected on our end, we automatically migrate your instance to a higher-capacity node with zero downtime.'
  },
  {
    id: 'faq-3',
    question: 'Why don’t you offer “unlimited” RAM or storage?',
    answer: 'We believe in honest, transparent hosting with zero overselling. "Unlimited" marketing claims usually mask strict CPU throttling and hidden inode limits. By allocating dedicated NVMe storage and isolated RAM, your server performance remains 100% consistent and guaranteed.'
  },
  {
    id: 'faq-4',
    question: 'What if someone tries to DDoS my server?',
    answer: 'All HectorHosting plans include permanent, inline 10Tbps DDoS scrubbing protection. Malicious traffic is filtered at the network edge in less than 2 milliseconds, keeping your game server or website online without disconnection or IP blacklisting.'
  },
  {
    id: 'faq-5',
    question: 'If my server goes down, will I receive compensation?',
    answer: 'Yes. We maintain a strict Service Level Agreement (SLA). If an unannounced network or hardware outage drops overall monthly uptime below 99.9%, you receive proportional billing credits applied directly to your account.'
  }
];

interface FaqSectionProps {
  supportEmail?: string;
  discordUrl?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  supportEmail = 'support@hectorhosting.com',
  discordUrl = 'https://discord.gg/hectorhosting'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const filteredFaqs = DEFAULT_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-32 bg-bg text-foreground relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-bg-alt border border-border text-[10px] font-black tracking-[0.2em] uppercase text-foreground-dim mb-6"
          >
            <HelpCircle size={13} className="text-accent" />
            <span>Infrastructure Knowledge Base</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground uppercase leading-[1.1] text-balance"
          >
            Frequently Asked <br />
            <span className="text-foreground-muted">Documentation.</span>
          </motion.h2>
        </div>

        {/* Main Grid: Left FAQs (8 Cols) & Right Help Box (4 Cols) */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Search + FAQ Accordion */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-dim" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query technical documentation..."
                className="w-full bg-bg border border-border rounded-md py-4 pl-12 pr-6 text-sm text-foreground focus:border-accent outline-none transition-all placeholder:text-foreground-dim shadow-sm"
              />
            </div>

            {/* Accordion List */}
            <div className="space-y-px bg-border border border-border rounded-lg overflow-hidden">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-bg"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full p-6 flex items-center justify-between text-left gap-6 group"
                      >
                        <span className="font-bold text-base text-foreground group-hover:text-accent transition-colors">
                          {faq.question}
                        </span>
                        <div className={`shrink-0 text-foreground-dim transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-accent' : ''
                        }`}>
                          <ChevronDown size={20} />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-6 pb-6"
                          >
                            <p className="text-foreground-muted text-sm leading-relaxed max-w-2xl">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-bg text-foreground-dim text-sm italic">
                  No indexing found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Need More Help? Card */}
          <div className="lg:col-span-4">
            <div className="bg-bg-alt border border-border rounded-lg p-8 sticky top-28">
              <h3 className="text-xl font-extrabold text-foreground tracking-tight mb-4 uppercase">
                Technical Support
              </h3>
              <p className="text-foreground-muted text-[13px] leading-relaxed mb-8">
                For complex deployment queries or network analysis, contact our technical operations center.
              </p>

              <div className="space-y-2">
                {[
                  { to: '/about', label: 'Docs', desc: 'Technical references', icon: BookOpen },
                  { href: discordUrl, label: 'Discord', desc: 'Real-time operations', icon: MessageSquare, isExternal: true },
                  { href: `mailto:${supportEmail}`, label: 'Email', desc: 'Formal tickets', icon: Mail, isExternal: true }
                ].map((item, i) => {
                  const Comp = item.to ? Link : 'a';
                  return (
                    <Comp
                      key={i}
                      {...(item.to ? { to: item.to } : { href: item.href, target: "_blank", rel: "noopener noreferrer" })}
                      className="flex items-center justify-between p-4 bg-bg border border-border hover:border-accent rounded transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-bg-alt border border-border flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                          <item.icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-foreground uppercase tracking-widest">{item.label}</h4>
                          <p className="text-[10px] text-foreground-dim uppercase tracking-wider">{item.desc}</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-foreground-dim group-hover:text-accent transition-colors" />
                    </Comp>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
