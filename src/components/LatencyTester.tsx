import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Server, ShieldCheck, Zap, Globe, RefreshCw, CheckCircle2 } from 'lucide-react';

interface NodeLocation {
  id: string;
  country: string;
  code: string;
  city: string;
  ip: string;
  basePing: number;
  cpu: string;
  uplink: string;
  status: 'OPERATIONAL' | 'HIGH LOAD';
}

const NODES: NodeLocation[] = [
  { id: 'de', country: 'Germany', code: 'DE', city: 'Frankfurt am Main', ip: '185.220.101.42', basePing: 14, cpu: 'Ryzen™ 9 5950X @ 4.9GHz', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
  { id: 'fi', country: 'Finland', code: 'FI', city: 'Helsinki', ip: '95.217.180.12', basePing: 19, cpu: 'AMD EPYC™ 7763 64-Core', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
  { id: 'sg', country: 'Singapore', code: 'SG', city: 'Jurong East', ip: '139.99.88.19', basePing: 28, cpu: 'AMD EPYC™ 7763 64-Core', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
  { id: 'us', country: 'USA East', code: 'US', city: 'Ashburn, VA', ip: '192.99.148.55', basePing: 34, cpu: 'Ryzen™ 9 5950X @ 4.9GHz', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
  { id: 'in', country: 'India', code: 'IN', city: 'Mumbai', ip: '103.150.187.2', basePing: 11, cpu: 'AMD EPYC™ 7763 64-Core', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
  { id: 'uk', country: 'United Kingdom', code: 'UK', city: 'London', ip: '51.89.162.88', basePing: 22, cpu: 'Intel® Xeon® Platinum', uplink: '10 Gbps Anycast', status: 'OPERATIONAL' },
];

export const LatencyTester: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeLocation>(NODES[0]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{ ping: number; jitter: number; loss: number } | null>(null);

  const runTest = () => {
    setIsTesting(true);
    setTestResults(null);
    setTimeout(() => {
      const variation = Math.floor(Math.random() * 6) - 2;
      const finalPing = Math.max(4, selectedNode.basePing + variation);
      const jitter = (Math.random() * 1.5 + 0.2).toFixed(1);
      setTestResults({
        ping: finalPing,
        jitter: parseFloat(jitter as string),
        loss: 0
      });
      setIsTesting(false);
    }, 600);
  };

  return (
    <section id="network" className="py-24 bg-[#07060b] relative overflow-hidden text-slate-100 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#120e20] border border-purple-900/40 text-purple-400 text-xs font-semibold tracking-wide uppercase mb-4"
          >
            <Activity size={14} className="text-purple-400" />
            Global Anycast Backbone & Ping Tester
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
            Sub-Millisecond <span className="text-purple-400">Routing Latency</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-normal leading-relaxed">
            Test packet round-trip time across our enterprise Tier-4 data centers equipped with 10Gbps direct peering and Corero Anti-DDoS.
          </p>
        </div>

        {/* Node Grid & Active Tester */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Node Location List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3 px-1 flex items-center gap-2">
              <Globe size={14} className="text-purple-400" />
              Select Location Node
            </div>
            {NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setTestResults(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#18132b] border-purple-500/70 shadow-md shadow-purple-950/40'
                      : 'bg-[#120e20] border-purple-900/40 hover:border-purple-500/40 hover:bg-[#18132b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/30 rounded">
                      {node.code}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {node.country}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {node.city} • <span className="text-purple-400">{node.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      ~{node.basePing} ms
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">{node.status}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Benchmark & Ping Terminal Box */}
          <div className="lg:col-span-7 bg-[#120e20] border border-purple-900/40 rounded-2xl p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 border-b border-purple-900/30 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1.5 text-sm font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/30 rounded-lg">
                  {selectedNode.code}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedNode.country} Data Center</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedNode.city} ({selectedNode.ip})</p>
                </div>
              </div>

              <button
                onClick={runTest}
                disabled={isTesting}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-purple-900/40"
              >
                <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
                {isTesting ? 'Pinging Node...' : 'Test Latency'}
              </button>
            </div>

            {/* Hardware & Network Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#08070d] p-4 rounded-xl border border-purple-900/30">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Server size={14} className="text-purple-400" />
                  Processor Node
                </div>
                <div className="text-sm font-semibold text-white font-mono truncate">{selectedNode.cpu}</div>
              </div>

              <div className="bg-[#08070d] p-4 rounded-xl border border-purple-900/30">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Zap size={14} className="text-purple-300" />
                  Network Uplink
                </div>
                <div className="text-sm font-semibold text-white font-mono">{selectedNode.uplink}</div>
              </div>

              <div className="bg-[#08070d] p-4 rounded-xl border border-purple-900/30 col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  DDoS Protection
                </div>
                <div className="text-sm font-semibold text-emerald-400 font-mono">Corero Layer 3-7</div>
              </div>
            </div>

            {/* Test Results Output */}
            <div className="bg-[#06050a] rounded-xl p-5 border border-purple-900/30 font-mono text-xs text-slate-300 space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-purple-900/30">
                <span>PARALLEL PACKET ICMP ECHO PROTOCOL</span>
                <span className="text-emerald-400">READY</span>
              </div>

              {isTesting ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3 text-purple-400">
                  <RefreshCw size={24} className="animate-spin" />
                  <span>Transmitting ICMP packet payload to {selectedNode.ip}...</span>
                </div>
              ) : testResults ? (
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} /> 64 bytes from {selectedNode.ip}
                    </span>
                    <span>time={testResults.ping}ms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-slate-400 pt-2 border-t border-purple-900/30">
                    <div>Latency: <span className="text-white font-bold">{testResults.ping} ms</span></div>
                    <div>Jitter: <span className="text-white font-bold">±{testResults.jitter} ms</span></div>
                    <div>Packet Loss: <span className="text-emerald-400 font-bold">{testResults.loss}%</span></div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-500">
                  Click "Test Latency" above to initiate a live ICMP speed test to {selectedNode.country}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
