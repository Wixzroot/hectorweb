import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PhoneCall, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Gamepad
} from 'lucide-react';
import { AppData } from '../types';

interface ContactPageProps {
  data: AppData;
}

export const ContactPage: React.FC<ContactPageProps> = ({ data }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'VPS Support', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const supportChannels = [
    {
      title: 'WhatsApp Helpline',
      info: data.settings.whatsapp_number ? `+${data.settings.whatsapp_number}` : '+91 98765 43210',
      desc: 'Instant pre-sales, order queries, and server set up.',
      actionLabel: 'Message on WhatsApp',
      actionUrl: `https://wa.me/${data.settings.whatsapp_number?.replace(/\D/g, '')}`,
      color: 'text-emerald-400',
      icon: PhoneCall
    },
    {
      title: 'Email Ticket Desk',
      info: data.settings.support_email || 'support@hectorhosting.com',
      desc: 'Technical issues, business proposals, and custom quotes.',
      actionLabel: 'Email Support Team',
      actionUrl: `mailto:${data.settings.support_email || 'support@hectorhosting.com'}`,
      color: 'text-purple-400',
      icon: Mail
    },
    {
      title: 'Discord Community Node',
      info: '@hectorhosting',
      desc: 'Real-time peer discussions, guides, and status pings.',
      actionLabel: 'Join Discord Server',
      actionUrl: data.settings.discord_url || 'https://discord.gg',
      color: 'text-blue-400',
      icon: MessageSquare
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    // Simulate support submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: 'VPS Support', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-bg text-foreground pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden font-sans">
      
      {/* Subtle Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center mb-24">
          <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] block mb-4">
            Technical Assistance Center
          </span>
          <h1 className="text-4xl sm:text-7xl font-extrabold text-foreground uppercase tracking-tight leading-none mb-6">
            Contact <span className="text-foreground-muted">Operations.</span>
          </h1>
          <p className="text-foreground-muted text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Technical consultations for mission-critical infrastructure deployments and enterprise network requirements.
          </p>
        </div>

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden mb-24">
          {supportChannels.map((channel, idx) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-bg p-10 flex flex-col justify-between group"
              >
                <div className="mb-10">
                  <div className={`w-12 h-12 bg-bg-alt border border-border rounded-md flex items-center justify-center text-accent mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">
                    {channel.title}
                  </h3>
                  <div className="text-[11px] font-black text-accent uppercase tracking-widest mb-4">{channel.info}</div>
                  <p className="text-sm text-foreground-muted leading-relaxed font-normal">
                    {channel.desc}
                  </p>
                </div>

                <a
                  href={channel.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black text-foreground hover:text-accent transition-colors uppercase tracking-[0.2em] group/btn"
                >
                  <span>{channel.actionLabel}</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Form and FAQ Split Panel */}
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Form Side - Col 7 */}
          <div className="lg:col-span-7 bg-bg-alt border border-border rounded-lg p-8 sm:p-12 relative">
            <h3 className="text-2xl font-black text-foreground uppercase tracking-tight mb-4">
              Service Inquiry
            </h3>
            <p className="text-sm text-foreground-muted mb-10 leading-relaxed max-w-lg">
              Submit a technical query to our Network Operations Center. Our average response latency for prioritized tickets is sub-15 minutes.
            </p>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 bg-bg border border-emerald-500/20 rounded-lg text-center flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-foreground uppercase tracking-tight">Inquiry Logged</h4>
                  <p className="text-sm text-foreground-muted max-w-sm leading-relaxed">
                    Ticket #<span className="font-bold text-foreground">{Math.floor(100000 + Math.random() * 900000)}</span> has been successfully indexed. An engineer will reach out shortly.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-foreground-dim tracking-[0.2em]">Principal Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-5 py-4 bg-bg border border-border focus:border-accent rounded-md text-sm text-foreground outline-none transition-all placeholder:text-foreground-dim"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-foreground-dim tracking-[0.2em]">Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. j.doe@enterprise.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-5 py-4 bg-bg border border-border focus:border-accent rounded-md text-sm text-foreground outline-none transition-all placeholder:text-foreground-dim"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-foreground-dim tracking-[0.2em]">Infrastructure Dept</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-5 py-4 bg-bg border border-border focus:border-accent rounded-md text-sm text-foreground outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="VPS Support">Network & Hardware Support</option>
                    <option value="Billing Query">Corporate Billing & Accounts</option>
                    <option value="Pre-Sales Question">Strategic Deployment Inquiry</option>
                    <option value="Abuse Report">Network Compliance / Abuse</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-foreground-dim tracking-[0.2em]">Detailed Query</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide specific technical requirements, network architecture details, or incident reports..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-5 py-4 bg-bg border border-border focus:border-accent rounded-md text-sm text-foreground outline-none transition-all placeholder:text-foreground-dim resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-foreground hover:bg-foreground/90 text-bg font-black text-[10px] uppercase tracking-[0.3em] rounded-md transition-all flex items-center justify-center gap-3"
                >
                  <Send size={16} />
                  <span>Transmit Dispatch</span>
                </button>
              </form>
            )}
          </div>

          {/* Context Details Side - Col 5 */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Quick Response Stats Card */}
            <div className="bg-bg-alt border border-border rounded-lg p-10 space-y-8">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Clock size={20} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
                  Operational Metrics
                </h4>
              </div>

              <div className="space-y-px bg-border border border-border rounded overflow-hidden">
                {[
                  { label: 'Avg Ticket Latency', value: '11 Minutes', detail: 'SLA Guaranteed < 1 hr' },
                  { label: 'Network Operations', value: '24/7/365 Active', detail: 'Real-time infrastructure auditing' },
                  { label: 'Technical Tier', value: 'L3 Certified', detail: 'Direct access to senior engineers' },
                ].map((m, idx) => (
                  <div key={idx} className="p-6 bg-bg">
                    <div className="text-[10px] text-foreground-dim uppercase font-black tracking-widest mb-1">{m.label}</div>
                    <div className="text-lg font-black text-foreground uppercase tracking-tight">{m.value}</div>
                    <div className="text-[10px] text-foreground-muted uppercase tracking-wider mt-1">{m.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Warning block */}
            <div className="p-8 bg-bg-alt border border-border rounded-lg flex gap-6">
              <ShieldAlert className="text-accent shrink-0 mt-1" size={24} />
              <div className="space-y-2">
                <h4 className="text-base font-black text-foreground uppercase tracking-tight">
                  Compliance & Abuse
                </h4>
                <p className="text-[13px] text-foreground-muted leading-relaxed font-normal">
                  For formal legal requests, copyright notices, or security vulnerability disclosures, direct your communications to <span className="font-bold text-foreground">compliance@hectorhosting.com</span>.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
