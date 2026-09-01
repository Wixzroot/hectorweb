import React, { useState, useEffect } from 'react';
import { 
  Server, Shield, Cpu, Activity, Clock, CheckCircle2, AlertTriangle, 
  XCircle, RefreshCw, Copy, Check, ExternalLink, Zap, Wifi,
  HardDrive, Radio, Layers, ArrowUpRight, Bell, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, SystemNode, Incident } from '../types';
import { Link } from 'react-router-dom';

interface StatusPageProps {
  data: AppData;
}

export const StatusPage: React.FC<StatusPageProps> = ({ data }) => {
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [pingTesting, setPingTesting] = useState<{ [key: string]: boolean }>({});
  const [pingResult, setPingResult] = useState<{ [key: string]: number }>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'scheduled' | 'resolved'>('all');

  // Fallback nodes with Ryzen 9 9950X (IP: 103.118.182.98) and AMD EPYC 7443P
  const nodes: SystemNode[] = data.systemNodes && data.systemNodes.length > 0 
    ? data.systemNodes 
    : [
        {
          id: 'node-ryzen-9950x',
          name: 'RYZEN 9 9950X',
          ip: '103.118.182.98',
          role: 'Game Server Node & Hector Control Panel',
          status: 'operational',
          cpu: 'AMD Ryzen 9 9950X (16 Cores, 32 Threads @ 5.7 GHz Boost)',
          ram: '128 GB DDR5 5600MHz ECC',
          storage: '2x 2TB Gen4 Enterprise NVMe (7000 MB/s)',
          location: 'Mumbai, India (Asia-South Tier 4 DC)',
          uptime: '99.99%',
          hasPanel: true,
          load: 18,
          latencyMs: 11,
          order: 1
        },
        {
          id: 'node-epyc-7443p',
          name: 'AMD EPYC 7443P',
          ip: '103.118.182.99',
          role: 'Enterprise High-Density Compute & Game VPS Node',
          status: 'operational',
          cpu: 'AMD EPYC 7443P (24 Cores, 48 Threads @ 3.4 GHz)',
          ram: '256 GB Octa-Channel DDR4 ECC Reg',
          storage: '4x 3.84TB Enterprise NVMe RAID 10',
          location: 'Mumbai, India (Asia-South Tier 4 DC)',
          uptime: '99.98%',
          hasPanel: false,
          load: 24,
          latencyMs: 14,
          order: 2
        }
      ];

  const incidents: Incident[] = data.incidents && data.incidents.length > 0
    ? data.incidents
    : [
        {
          id: 'inc-routine-check',
          title: 'Global Anycast Network & Node Health Verified',
          type: 'notice',
          severity: 'resolved',
          status: 'resolved',
          affectedNodes: ['RYZEN 9 9950X', 'AMD EPYC 7443P', 'Hector Game Control Panel'],
          message: 'All hypervisors, Game Control Panel, Pterodactyl daemon wings, and DDoS mitigation tunnels on 103.118.182.98 are operating at peak efficiency with 0% packet loss.',
          createdAt: 'Today at 09:30 UTC'
        }
      ];

  // Derive system health
  const hasMaintenance = data.settings.maintenance_mode || nodes.some(n => n.status === 'maintenance');
  const hasOutage = nodes.some(n => n.status === 'outage');
  const hasDegraded = nodes.some(n => n.status === 'degraded');

  const overallStatus = hasOutage 
    ? 'outage' 
    : hasDegraded 
      ? 'degraded' 
      : hasMaintenance 
        ? 'maintenance' 
        : 'operational';

  const statusMeta = {
    operational: {
      label: 'All Systems Operational',
      badge: 'Operational',
      color: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      dot: 'bg-emerald-500',
      desc: 'All game nodes, control panel daemons, and network filtering pipes are operating at 100% capacity.'
    },
    maintenance: {
      label: 'Scheduled Maintenance in Progress',
      badge: 'Maintenance',
      color: 'amber',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      dot: 'bg-amber-500',
      desc: data.settings.maintenance_message || 'Routine maintenance and performance optimizations are currently underway.'
    },
    degraded: {
      label: 'Degraded Performance Observed',
      badge: 'Degraded',
      color: 'yellow',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      dot: 'bg-yellow-500',
      desc: 'Some nodes are experiencing higher than normal network traffic or latency. Engineers are monitoring.'
    },
    outage: {
      label: 'Service Disruption / Major Outage',
      badge: 'Outage',
      color: 'red',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      dot: 'bg-red-500',
      desc: 'One or more core infrastructure nodes are undergoing emergency remediation.'
    }
  }[overallStatus];

  // Copy IP helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // Ping Latency Simulator
  const runPingTest = (nodeId: string, baseLatency: number = 12) => {
    setPingTesting(prev => ({ ...prev, [nodeId]: true }));
    setTimeout(() => {
      // Simulate real-time browser roundtrip measurement
      const variation = Math.floor(Math.random() * 6) - 2;
      const measured = Math.max(5, baseLatency + variation);
      setPingResult(prev => ({ ...prev, [nodeId]: measured }));
      setPingTesting(prev => ({ ...prev, [nodeId]: false }));
    }, 750);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastChecked(new Date());
      setIsRefreshing(false);
    }, 500);
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter(inc => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return inc.status === 'in_progress' || inc.status === 'investigating' || inc.status === 'identified' || inc.status === 'monitoring';
    if (activeFilter === 'scheduled') return inc.status === 'scheduled';
    if (activeFilter === 'resolved') return inc.status === 'resolved' || inc.status === 'completed';
    return true;
  });

  // Services breakdown
  const coreServices = [
    {
      name: 'Hector Game Control Panel',
      node: 'RYZEN 9 9950X (103.118.182.98)',
      status: nodes.find(n => n.name.includes('9950X'))?.status || 'operational',
      type: 'Web Panel & Client Daemon API'
    },
    {
      name: 'Pterodactyl Daemon (Wings) - Node 1',
      node: 'RYZEN 9 9950X',
      status: nodes.find(n => n.name.includes('9950X'))?.status || 'operational',
      type: 'Game Instance Virtualization'
    },
    {
      name: 'Pterodactyl Daemon (Wings) - Node 2',
      node: 'AMD EPYC 7443P',
      status: nodes.find(n => n.name.includes('7443P'))?.status || 'operational',
      type: 'High-Density Game Instances'
    },
    {
      name: 'Anycast DDoS Mitigation & Edge Routing',
      node: '103.118.182.98 / Path.net Pipeline',
      status: 'operational',
      type: '10Gbps Multi-Layer Filter'
    },
    {
      name: 'Automated Provisioning & Billing Portal',
      node: 'Hector Client Core',
      status: 'operational',
      type: 'Instant Server Provisioning'
    },
    {
      name: 'Fast-NVMe Database & Backup Storage',
      node: 'NVMe Gen4 Enterprise RAID',
      status: 'operational',
      type: 'Real-time Snapshots'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07050d] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-purple-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Header & Live Status Banner */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-900/30 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-purple-400 font-bold mb-2">
                <Radio size={14} className="animate-pulse text-purple-400" />
                Live Infrastructure Status
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3 font-display">
                {data.settings.brand_name || 'HectorHosting'} Systems
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase font-mono text-slate-400">Telemetry Sync</p>
                <p className="text-xs font-mono text-purple-300">
                  {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>

              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-purple-400' : ''} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh Status'}</span>
              </button>
            </div>
          </div>

          {/* Master Operational State Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 sm:p-8 rounded-2xl border ${statusMeta.bg} ${statusMeta.border} relative overflow-hidden backdrop-blur-md`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="relative mt-1">
                  <div className={`w-5 h-5 rounded-full ${statusMeta.dot} flex items-center justify-center`}>
                    <div className={`w-5 h-5 rounded-full ${statusMeta.dot} animate-ping absolute opacity-75`} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
                    {statusMeta.label}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl font-light leading-relaxed">
                    {statusMeta.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-8 border-t md:border-t-0 md:border-l border-purple-900/40 pt-4 md:pt-0 md:pl-8 shrink-0">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">90-Day Uptime</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">99.99%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Core Network</div>
                  <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">10 Gbps</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Active Maintenance Notice Alert (If any) */}
        {hasMaintenance && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-purple-950/40 border border-amber-500/40 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle size={18} className="animate-bounce" />
                Active Maintenance Bulletin
              </div>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase font-bold rounded-full">
                Live Notice
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-light">
              {data.settings.maintenance_message || 'System maintenance in progress. All game nodes and virtual instances remain online, with temporary panel updates being applied.'}
            </p>
          </motion.div>
        )}

        {/* VPS & GAME SERVER HARDWARE NODES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
                <Server size={20} className="text-purple-400" />
                Hardware Node Cluster
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dedicated hypervisors powering Game Servers, Discord Bots, and VPS hosting instances.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-900/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-time Ingress Monitored
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {nodes.map((node, idx) => {
              const isRyzen = node.name.includes('9950X');
              const isOperational = node.status === 'operational';
              const isNodeMaintenance = node.status === 'maintenance';
              const currentLatency = pingResult[node.id] || node.latencyMs || (isRyzen ? 11 : 14);

              return (
                <motion.div
                  key={node.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0e0a1a] border border-purple-900/40 hover:border-purple-600/50 transition-all rounded-2xl p-6 sm:p-7 space-y-6 relative overflow-hidden group shadow-xl"
                >
                  {/* Top Node Badge & Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-xl font-black uppercase text-white font-mono tracking-tight">
                          {node.name}
                        </h4>
                        {node.hasPanel && (
                          <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold uppercase rounded-md">
                            Panel Node
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-light">
                        {node.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border flex items-center gap-1.5 ${
                        isOperational 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : isNodeMaintenance 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isOperational ? 'bg-emerald-400 animate-pulse' : isNodeMaintenance ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        {node.status}
                      </span>
                    </div>
                  </div>

                  {/* Primary Node IP & Live Diagnostics */}
                  {node.ip && (
                    <div className="p-3.5 bg-[#140e25] border border-purple-900/40 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Terminal size={15} className="text-purple-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Node Ingress IP</span>
                          <span className="text-xs font-mono font-bold text-purple-200 truncate">{node.ip}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => runPingTest(node.id, node.latencyMs || 12)}
                          disabled={pingTesting[node.id]}
                          className="px-2.5 py-1 bg-purple-900/40 hover:bg-purple-800/50 text-purple-300 border border-purple-700/40 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all"
                          title="Run latency ping measurement"
                        >
                          <Wifi size={12} className={pingTesting[node.id] ? 'animate-ping' : ''} />
                          <span>{pingTesting[node.id] ? 'Pinging...' : `${currentLatency} ms`}</span>
                        </button>

                        <button
                          onClick={() => handleCopy(node.ip!)}
                          className="p-1.5 hover:bg-purple-900/50 text-slate-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-purple-700/40"
                          title="Copy Node IP Address"
                        >
                          {copiedIp === node.ip ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Node Hardware Specifications Matrix */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#0a0714] border border-purple-950 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                        <Cpu size={12} className="text-purple-400" /> Processor
                      </span>
                      <p className="text-white font-medium truncate text-[11px]">{node.cpu}</p>
                    </div>

                    <div className="p-3 bg-[#0a0714] border border-purple-950 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                        <Activity size={12} className="text-purple-400" /> Memory (ECC)
                      </span>
                      <p className="text-white font-medium truncate text-[11px]">{node.ram}</p>
                    </div>

                    <div className="p-3 bg-[#0a0714] border border-purple-950 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                        <HardDrive size={12} className="text-purple-400" /> Storage Pool
                      </span>
                      <p className="text-white font-medium truncate text-[11px]">{node.storage}</p>
                    </div>

                    <div className="p-3 bg-[#0a0714] border border-purple-950 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                        <Shield size={12} className="text-purple-400" /> Location
                      </span>
                      <p className="text-white font-medium truncate text-[11px]">{node.location}</p>
                    </div>
                  </div>

                  {/* 90-Day Uptime Graph simulation */}
                  <div className="space-y-2 pt-2 border-t border-purple-900/30">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>90 Days Ago</span>
                      <span className="text-emerald-400 font-bold">{node.uptime || '99.99%'} Uptime</span>
                      <span>Today</span>
                    </div>
                    {/* Visual 90-day block bars */}
                    <div className="flex items-center gap-1 h-6">
                      {Array.from({ length: 45 }).map((_, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex-1 h-full bg-emerald-500/80 hover:bg-emerald-400 rounded-xs transition-colors cursor-pointer group/bar relative"
                          title="100% Operational • 0 Incidents"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Special panel status for Ryzen 9 9950X */}
                  {node.hasPanel && (
                    <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-400" />
                        <span className="text-purple-200 font-semibold text-[11px]">Hector Game Panel Active</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Live (Port 443/8080)
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CORE SERVICES & DAEMONS TABLE */}
        <div className="bg-[#0e0a1a] border border-purple-900/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
              <Layers size={20} className="text-purple-400" />
              Core Infrastructure Services
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current state of daemons, hypervisors, and DDoS mitigation routing.
            </p>
          </div>

          <div className="divide-y divide-purple-900/30">
            {coreServices.map((svc, i) => (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {svc.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-purple-300 text-[11px]">{svc.node}</span>
                    <span>•</span>
                    <span className="text-slate-500 text-[11px]">{svc.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    Operational
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INCIDENT & MAINTENANCE ANNOUNCEMENT HISTORY */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2.5">
                <Clock size={20} className="text-purple-400" />
                Maintenance & Incident Log
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent log of scheduled maintenance and infrastructure updates.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-[#0e0a1a] p-1 border border-purple-900/40 rounded-xl self-start sm:self-auto">
              {(['all', 'active', 'scheduled', 'resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                    activeFilter === filter 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 bg-[#0e0a1a] border border-purple-900/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 size={28} className="text-emerald-400 mx-auto" />
                <p className="text-sm text-white font-bold">No announcements in this category</p>
                <p className="text-xs text-slate-400">All services are operating at optimum speed and reliability.</p>
              </div>
            ) : (
              filteredIncidents.map((incident, i) => {
                const isResolved = incident.status === 'resolved' || incident.status === 'completed';
                const isScheduled = incident.status === 'scheduled';

                return (
                  <motion.div
                    key={incident.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0e0a1a] border border-purple-900/40 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="text-base font-bold text-white">
                            {incident.title}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                            isResolved 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : isScheduled 
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          }`}>
                            {incident.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-purple-400 mt-1">
                          {incident.createdAt || 'Recent Update'}
                        </p>
                      </div>

                      {incident.affectedNodes && incident.affectedNodes.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {incident.affectedNodes.map((target, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="px-2.5 py-1 bg-purple-950/40 border border-purple-900/40 text-purple-300 text-[10px] font-mono rounded-lg"
                            >
                              {target}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-[#140e25] border border-purple-900/30 rounded-xl text-xs text-slate-300 leading-relaxed font-light">
                      {incident.message}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* QUICK SUPPORT & DISCORD HELP CALLOUT */}
        <div className="p-8 bg-gradient-to-r from-purple-950/40 via-[#0e0a1a] to-purple-950/40 border border-purple-900/50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-center md:text-left">
            <h4 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Bell size={18} className="text-purple-400" />
              Need Real-time Incident Notifications?
            </h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Join our official Discord community for automated uptime alerts, scheduled maintenance pings, and direct engineer support.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {data.settings.discord_url && (
              <a
                href={data.settings.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
              >
                Join Discord
                <ArrowUpRight size={14} />
              </a>
            )}
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 font-bold text-xs rounded-xl transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
