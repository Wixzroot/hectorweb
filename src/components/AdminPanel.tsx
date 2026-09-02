import React, { useState, useEffect } from 'react';
import { 
  X, Save, Layout, Shield, LogOut, ChevronRight, Check, UserPlus, Fingerprint, Globe, Cpu,
  FileText, ShieldAlert, RotateCcw, Megaphone, AlertTriangle, Mail, QrCode, PhoneCall, Chrome, Lock, Plus,
  Layers, Trash2, Edit2, Server, MapPin, Coins, Database, Terminal, Clock, Trash, Radio, Activity,
  CheckCircle2, Wifi, Sparkles, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, Plan, SystemNode, Incident } from '../types';
import { DEFAULT_DATA } from '../constants';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { logService, LogEntry } from '../services/logService';
import { User as FirebaseUser } from 'firebase/auth';
import { MarkdownEditorWithPreview } from './MarkdownEditorWithPreview';

interface AdminPanelProps {
  data: AppData;
  setData: (data: AppData) => void;
  onClose: () => void;
  user: FirebaseUser | null;
  isAdmin: boolean;
}

type Tab = 
  | 'dashboard' 
  | 'status'
  | 'plans'
  | 'tos' 
  | 'privacy' 
  | 'refund' 
  | 'about' 
  | 'infrastructure' 
  | 'legal' 
  | 'admins'
  | 'logs';

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, setData, onClose, user, isAdmin }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [localData, setLocalData] = useState<AppData>(data);
  const [admins, setAdmins] = useState<{ uid: string, email: string }[]>([]);
  const [newAdmin, setNewAdmin] = useState({ uid: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    const unsubscribe = logService.subscribe(setLogs);
    return unsubscribe;
  }, []);

  // Status & Node Management States
  const [editingNode, setEditingNode] = useState<SystemNode | null>(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [nodeForm, setNodeForm] = useState<Omit<SystemNode, 'id'>>({
    name: '',
    ip: '',
    role: '',
    status: 'operational',
    cpu: '',
    ram: '',
    storage: '',
    location: 'Mumbai, India',
    uptime: '99.99%',
    hasPanel: false,
    load: 20,
    latencyMs: 12
  });

  // Incident & Maintenance Announcement State
  const [incidentForm, setIncidentForm] = useState<{
    title: string;
    type: 'scheduled_maintenance' | 'incident' | 'maintenance' | 'notice';
    severity: 'info' | 'warning' | 'critical' | 'resolved';
    status: 'scheduled' | 'in_progress' | 'completed' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
    affectedNodes: string[];
    message: string;
    scheduledFor: string;
  }>({
    title: '',
    type: 'scheduled_maintenance',
    severity: 'warning',
    status: 'scheduled',
    affectedNodes: ['RYZEN 9 9950X', 'EPYC 7443P', 'Game Control Panel'],
    message: '',
    scheduledFor: ''
  });
  const [isPostingIncident, setIsPostingIncident] = useState(false);

  // Plans & Taxonomy States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    price: '',
    price_inr: '',
    price_eur: '',
    badge: '',
    category: '',
    location: '',
    node: '',
    desc: '',
    featuresText: ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newNodeOption, setNewNodeOption] = useState('');

  // Keep localData synchronized with parent data snapshots
  useEffect(() => {
    setLocalData(prev => ({
      ...prev,
      plans: data.plans || [],
      categories: data.categories || [],
      locations: data.locations || [],
      nodes: data.nodes || [],
      systemNodes: data.systemNodes && data.systemNodes.length > 0 ? data.systemNodes : prev.systemNodes || DEFAULT_DATA.systemNodes,
      incidents: data.incidents && data.incidents.length > 0 ? data.incidents : prev.incidents || DEFAULT_DATA.incidents
    }));
  }, [data.plans, data.categories, data.locations, data.nodes, data.systemNodes, data.incidents]);

  useEffect(() => {
    if (isAdmin) {
      loadAdmins();
    }
  }, [isAdmin]);

  const loadAdmins = async () => {
    const list = await dataService.getAdmins();
    setAdmins(list);
  };

  const save = async () => {
    if (isSaving) return;
    logService.addLog('info', 'Global configuration save initiated...');
    setIsSaving(true);
    try {
      // Sync Settings, Pages, and Option configurations to Firestore
      await dataService.updateSettings({
        settings: localData.settings,
        privacy: localData.privacy,
        refund: localData.refund,
        tos: localData.tos,
        legal: localData.legal,
        infrastructure: localData.infrastructure,
        about: localData.about,
        categories: localData.categories,
        locations: localData.locations,
        nodes: localData.nodes,
        systemNodes: localData.systemNodes,
        incidents: localData.incidents
      });

      if (localData.systemNodes && localData.systemNodes.length > 0) {
        await dataService.saveAllNodes(localData.systemNodes);
      }
      if (localData.incidents) {
        await dataService.saveAllIncidents(localData.incidents);
      }

      setData({
        ...data,
        settings: localData.settings,
        privacy: localData.privacy,
        refund: localData.refund,
        tos: localData.tos,
        legal: localData.legal,
        infrastructure: localData.infrastructure,
        about: localData.about,
        categories: localData.categories,
        locations: localData.locations,
        nodes: localData.nodes,
        systemNodes: localData.systemNodes,
        incidents: localData.incidents
      });
      
      logService.addLog('success', 'Global configuration successfully synchronized with Firestore.');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e: any) {
      logService.addLog('error', `Global Save Failed: ${e.message || "Unknown error"}`);
      console.error("Save failed:", e);
      alert(`Global Save Failed: ${e.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- SYSTEM NODE STATUS MANAGEMENT ---
  const updateNodeStatus = async (nodeId: string, status: 'operational' | 'maintenance' | 'degraded' | 'outage') => {
    logService.addLog('info', `Updating node ${nodeId} status to ${status}...`);
    const currentNodes = localData.systemNodes || DEFAULT_DATA.systemNodes || [];
    const updated = currentNodes.map(n => n.id === nodeId ? { ...n, status } : n);
    setLocalData(prev => ({ ...prev, systemNodes: updated }));
    setData({ ...data, systemNodes: updated });

    try {
      await dataService.updateNode(nodeId, { status });
      await dataService.updateSettings({ systemNodes: updated });
      logService.addLog('success', `Node ${nodeId} status changed to ${status}`);
    } catch (err: any) {
      logService.addLog('error', `Failed to update node status: ${err.message}`);
      alert(`Failed to update node status: ${err.message}`);
    }
  };

  const openAddNode = () => {
    setEditingNode(null);
    setNodeForm({
      name: '',
      ip: '',
      role: 'Game Server & Virtualization Node',
      status: 'operational',
      cpu: 'AMD Ryzen 9 9950X (16C/32T)',
      ram: '128 GB DDR5 5600MHz ECC',
      storage: '2x 2TB Gen4 Enterprise NVMe',
      location: 'Mumbai, India',
      uptime: '99.99%',
      hasPanel: false,
      load: 20,
      latencyMs: 12
    });
    setIsNodeModalOpen(true);
  };

  const openEditNode = (node: SystemNode) => {
    setEditingNode(node);
    setNodeForm({
      name: node.name,
      ip: node.ip || '',
      role: node.role,
      status: node.status,
      cpu: node.cpu,
      ram: node.ram,
      storage: node.storage,
      location: node.location,
      uptime: node.uptime,
      hasPanel: node.hasPanel || false,
      load: node.load ?? 20,
      latencyMs: node.latencyMs ?? 12
    });
    setIsNodeModalOpen(true);
  };

  const saveNodeModal = async () => {
    if (!nodeForm.name.trim()) {
      alert("Please enter a node name.");
      return;
    }

    const currentNodes = localData.systemNodes || DEFAULT_DATA.systemNodes || [];
    setIsSaving(true);
    try {
      if (editingNode) {
        const updated = currentNodes.map(n => 
          n.id === editingNode.id ? { ...editingNode, ...nodeForm } : n
        );
        setLocalData(prev => ({ ...prev, systemNodes: updated }));
        setData({ ...data, systemNodes: updated });
        await dataService.updateNode(editingNode.id, nodeForm);
        await dataService.updateSettings({ systemNodes: updated });
        logService.addLog('success', `Node ${editingNode.name} updated successfully.`);
      } else {
        const newId = `node-${Date.now()}`;
        const newNode: SystemNode = {
          id: newId,
          ...nodeForm,
          order: currentNodes.length + 1
        };
        const updated = [...currentNodes, newNode];
        setLocalData(prev => ({ ...prev, systemNodes: updated }));
        setData({ ...data, systemNodes: updated });
        await dataService.updateNode(newId, newNode);
        await dataService.updateSettings({ systemNodes: updated });
        logService.addLog('success', `New Node ${newNode.name} added to cluster.`);
      }
      setIsNodeModalOpen(false);
      setEditingNode(null);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save node: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSystemNode = async (nodeId: string) => {
    if (!window.confirm("Are you sure you want to remove this hardware node from public status monitoring?")) return;
    const currentNodes = localData.systemNodes || DEFAULT_DATA.systemNodes || [];
    const updated = currentNodes.filter(n => n.id !== nodeId);
    setLocalData(prev => ({ ...prev, systemNodes: updated }));
    setData({ ...data, systemNodes: updated });

    try {
      await dataService.deleteNode(nodeId);
      await dataService.updateSettings({ systemNodes: updated });
      logService.addLog('success', `Node ${nodeId} removed.`);
    } catch (err: any) {
      alert(`Failed to delete node: ${err.message}`);
    }
  };

  // --- MAINTENANCE & INCIDENT MANAGEMENT HELPERS ---
  const postIncidentNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.title.trim() || !incidentForm.message.trim()) {
      alert("Please provide both a title and message for the maintenance announcement.");
      return;
    }

    setIsPostingIncident(true);
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      title: incidentForm.title.trim(),
      type: incidentForm.type,
      severity: incidentForm.severity,
      status: incidentForm.status,
      affectedNodes: incidentForm.affectedNodes,
      message: incidentForm.message.trim(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      scheduledFor: incidentForm.scheduledFor || undefined
    };

    const currentIncidents = localData.incidents || DEFAULT_DATA.incidents || [];
    const updated = [newIncident, ...currentIncidents];
    setLocalData(prev => ({ ...prev, incidents: updated }));
    setData({ ...data, incidents: updated });

    try {
      await dataService.addIncident(newIncident);
      await dataService.updateSettings({ incidents: updated });
      logService.addLog('success', `Maintenance notice "${newIncident.title}" published to live status page.`);
      setIncidentForm({
        title: '',
        type: 'scheduled_maintenance',
        severity: 'warning',
        status: 'scheduled',
        affectedNodes: ['RYZEN 9 9950X', 'EPYC 7443P', 'Game Control Panel'],
        message: '',
        scheduledFor: ''
      });
      alert("Maintenance announcement successfully published to the live status page!");
    } catch (err: any) {
      console.error(err);
      alert(`Failed to publish incident: ${err.message}`);
    } finally {
      setIsPostingIncident(false);
    }
  };

  const updateIncidentStatus = async (id: string, newStatus: Incident['status']) => {
    const currentIncidents = localData.incidents || DEFAULT_DATA.incidents || [];
    const updated = currentIncidents.map(inc => 
      inc.id === id ? { ...inc, status: newStatus, resolvedAt: newStatus === 'resolved' || newStatus === 'completed' ? 'Resolved' : undefined } : inc
    );
    setLocalData(prev => ({ ...prev, incidents: updated }));
    setData({ ...data, incidents: updated });

    try {
      await dataService.updateIncident(id, { status: newStatus });
      await dataService.updateSettings({ incidents: updated });
      logService.addLog('success', `Incident ${id} marked as ${newStatus}`);
    } catch (err: any) {
      alert(`Failed to update incident: ${err.message}`);
    }
  };

  const deleteIncidentNotice = async (id: string) => {
    if (!window.confirm("Delete this maintenance announcement from the log?")) return;
    const currentIncidents = localData.incidents || DEFAULT_DATA.incidents || [];
    const updated = currentIncidents.filter(inc => inc.id !== id);
    setLocalData(prev => ({ ...prev, incidents: updated }));
    setData({ ...data, incidents: updated });

    try {
      await dataService.deleteIncident(id);
      await dataService.updateSettings({ incidents: updated });
      logService.addLog('success', `Incident announcement deleted.`);
    } catch (err: any) {
      alert(`Failed to delete incident: ${err.message}`);
    }
  };

  const seedDatabase = async () => {
     if (!window.confirm("This will restore default site configuration, page templates, and content into Firebase. Continue?")) return;
     setIsSeeding(true);
     try {
        const success = await dataService.seedAllDefaultData(DEFAULT_DATA);
        if (success) {
          setLocalData(DEFAULT_DATA);
          setData(DEFAULT_DATA);
          alert("Database seeded with default content successfully!");
        } else {
          alert("Seeding incomplete. Check console.");
        }
     } catch (e) {
        console.error(e);
        alert("Seed failed. Check console.");
     } finally {
        setIsSeeding(false);
     }
  };

  const updateSettings = (key: string, value: any) => {
    setLocalData({ ...localData, settings: { ...localData.settings, [key]: value } });
  };

  // --- PLAN MANAGEMENT HELPERS ---
  const openAddPlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      price: '',
      price_inr: '',
      price_eur: '',
      badge: '',
      category: localData.categories?.[0] || 'RYZEN-VPS-PRICING',
      location: localData.locations?.[0] || 'India (Mumbai)',
      node: localData.nodes?.[0] || 'Ryzen-KVM-Node-01',
      desc: '',
      featuresText: ''
    });
    setIsPlanModalOpen(true);
  };

  const openEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      price: plan.price || '',
      price_inr: plan.price_inr || '',
      price_eur: plan.price_eur || '',
      badge: plan.badge || '',
      category: plan.category || 'RYZEN-VPS-PRICING',
      location: plan.location || 'India (Mumbai)',
      node: plan.node || 'Ryzen-KVM-Node-01',
      desc: plan.desc || '',
      featuresText: plan.features?.join('\n') || ''
    });
    setIsPlanModalOpen(true);
  };

  const savePlanForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    if (!planForm.name || !planForm.price || !planForm.price_inr) {
      alert("Please fill in the Plan Name and pricing specs!");
      return;
    }

    setIsSaving(true);
    try {
      const featuresArray = planForm.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const planPayload = {
        name: planForm.name,
        price: planForm.price,
        price_inr: planForm.price_inr,
        price_eur: planForm.price_eur || String(Math.round(Number(planForm.price) * 0.9)),
        badge: planForm.badge,
        category: planForm.category,
        location: planForm.location,
        node: planForm.node,
        desc: planForm.desc,
        features: featuresArray,
        order: editingPlan?.order ?? localData.plans.length
      };

      if (editingPlan) {
        await dataService.updatePlan(editingPlan.id, planPayload);
        setLocalData(prev => ({
          ...prev,
          plans: prev.plans.map(p => p.id === editingPlan.id ? { ...p, ...planPayload } : p)
        }));
        alert("Plan updated successfully in Firestore!");
      } else {
        const newId = await dataService.addPlan(planPayload);
        if (newId) {
          setLocalData(prev => ({
            ...prev,
            plans: [...prev.plans, { ...planPayload, id: newId }]
          }));
        }
        alert("New plan added successfully to Firestore!");
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save plan: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const movePlan = async (planId: string, direction: 'up' | 'down') => {
    const targetPlan = (localData.plans || []).find(pl => pl.id === planId);
    if (!targetPlan) return;
    
    const plansInCategory = (localData.plans || [])
      .filter(p => p.category === targetPlan.category)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const index = plansInCategory.findIndex(p => p.id === planId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= plansInCategory.length) return;
    
    const otherPlan = plansInCategory[newIndex];
    const currentPlan = plansInCategory[index];
    
    // Swap order values
    const currentOrder = currentPlan.order || index;
    const otherOrder = otherPlan.order || newIndex;
    
    setIsSaving(true);
    try {
      await dataService.updatePlan(currentPlan.id, { order: otherOrder });
      await dataService.updatePlan(otherPlan.id, { order: currentOrder });
      
      setLocalData(prev => ({
        ...prev,
        plans: prev.plans.map(p => {
          if (p.id === currentPlan.id) return { ...p, order: otherOrder };
          if (p.id === otherPlan.id) return { ...p, order: currentOrder };
          return p;
        })
      }));
    } catch (err: any) {
      console.error(err);
      alert(`Failed to reorder plans: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlan = async (planId: string) => {
    logService.addLog('info', `Attempting to delete plan: ${planId}`);
    if (!planId) {
      logService.addLog('error', "Invalid Plan ID provided for deletion.");
      alert("Invalid Plan ID. This plan cannot be deleted.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Hosting Plan',
      message: 'Are you sure you want to permanently delete this hosting plan? This action cannot be undone and will remove it from all public pages.',
      onConfirm: async () => {
        logService.addLog('warning', `User confirmed deletion of plan ${planId}`);
        const backupPlans = [...localData.plans];
        setIsSaving(true);
        
        setLocalData(prev => ({
          ...prev,
          plans: (prev.plans || []).filter(p => p.id !== planId)
        }));

        try {
          logService.addLog('info', `Calling database to remove plan document...`);
          await dataService.deletePlan(planId);
          logService.addLog('success', `Plan ${planId} successfully deleted from Firestore.`);
        } catch (err: any) {
          logService.addLog('error', `Firestore delete failed: ${err.message}`);
          setLocalData(prev => ({ ...prev, plans: backupPlans }));
          alert(`Failed to delete plan from database: ${err.message || "Unknown error"}`);
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  // --- TAXONOMY OPTION MANAGEMENT ---
  const addCategory = async () => {
    if (isSaving || !newCategory.trim()) return;
    const clean = newCategory.trim().toUpperCase().replace(/\s+/g, '-');
    if (localData.categories.includes(clean)) return;
    const updated = [...localData.categories, clean];
    
    setIsSaving(true);
    try {
      await dataService.updateSettings({ categories: updated });
      setLocalData({ ...localData, categories: updated });
      setNewCategory('');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to add category to Firestore: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async (cat: string) => {
    logService.addLog('info', `Category deletion requested: ${cat}`);
    const plansInCategory = (localData.plans || []).filter(p => p.category === cat);
    const confirmMsg = plansInCategory.length > 0 
      ? `Deleting this category will also PERMANENTLY DELETE all ${plansInCategory.length} plans within it. Are you sure?`
      : `Are you sure you want to delete the category "${cat}"?`;

    setConfirmModal({
      isOpen: true,
      title: 'Delete Category & All Linked Plans',
      message: confirmMsg,
      onConfirm: async () => {
        logService.addLog('warning', `User confirmed category deletion: ${cat} (Affects ${plansInCategory.length} plans)`);
        const updated = (localData.categories || []).filter(c => c !== cat);
        setIsSaving(true);
        try {
          logService.addLog('info', `Purging ${plansInCategory.length} plans from database...`);
          const deletePromises = plansInCategory.map(p => dataService.deletePlan(p.id));
          await Promise.all(deletePromises);

          logService.addLog('info', `Updating global settings to remove category entry...`);
          await dataService.updateSettings({ categories: updated });
          
          setLocalData(prev => ({ 
            ...prev, 
            categories: updated,
            plans: (prev.plans || []).filter(p => p.category !== cat)
          }));
          logService.addLog('success', `Category ${cat} and its plans permanently deleted.`);
        } catch (err: any) {
          logService.addLog('error', `Category deletion failed: ${err.message}`);
          alert(`Failed to delete category or its plans from Firestore: ${err.message || "Unknown error"}`);
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const addLocation = async () => {
    if (isSaving || !newLocation.trim()) return;
    const clean = newLocation.trim();
    if (localData.locations.includes(clean)) return;
    const updated = [...localData.locations, clean];
    
    setIsSaving(true);
    try {
      await dataService.updateSettings({ locations: updated });
      setLocalData({ ...localData, locations: updated });
      setNewLocation('');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to add location to Firestore: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLocation = async (loc: string) => {
    logService.addLog('info', `Location deletion requested: ${loc}`);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Location',
      message: `Are you sure you want to delete the location "${loc}"? This will not remove existing plans, but this location will no longer be available for new plans.`,
      onConfirm: async () => {
        logService.addLog('warning', `User confirmed deletion of location: ${loc}`);
        const updated = (localData.locations || []).filter(l => l !== loc);
        setIsSaving(true);
        try {
          await dataService.updateSettings({ locations: updated });
          setLocalData({ ...localData, locations: updated });
          logService.addLog('success', `Location ${loc} deleted from settings.`);
        } catch (err: any) {
          logService.addLog('error', `Location deletion failed: ${err.message}`);
          alert(`Failed to delete location from Firestore: ${err.message || "Unknown error"}`);
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  const addNodeOption = async () => {
    if (isSaving || !newNodeOption.trim()) return;
    const clean = newNodeOption.trim();
    if (localData.nodes.includes(clean)) return;
    const updated = [...localData.nodes, clean];
    
    setIsSaving(true);
    try {
      await dataService.updateSettings({ nodes: updated });
      setLocalData({ ...localData, nodes: updated });
      setNewNodeOption('');
    } catch (err: any) {
      console.error(err);
      alert(`Failed to add node to Firestore: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNodeOption = async (node: string) => {
    logService.addLog('info', `Node deletion requested: ${node}`);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Server Node',
      message: `Are you sure you want to delete the node option "${node}"? This will not remove existing plans, but this node will no longer be selectable for new plans.`,
      onConfirm: async () => {
        logService.addLog('warning', `User confirmed deletion of node: ${node}`);
        const updated = (localData.nodes || []).filter(n => n !== node);
        setIsSaving(true);
        try {
          await dataService.updateSettings({ nodes: updated });
          setLocalData({ ...localData, nodes: updated });
          logService.addLog('success', `Node ${node} deleted from settings.`);
        } catch (err: any) {
          logService.addLog('error', `Node deletion failed: ${err.message}`);
          alert(`Failed to delete node from Firestore: ${err.message || "Unknown error"}`);
        } finally {
          setIsSaving(false);
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#07050d] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-10 bg-[#0f0b1a] border border-purple-900/40 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20">
            <Lock className="text-purple-400" size={32} />
          </div>
          <h2 className="text-3xl font-display tracking-tight text-white mb-4">Secure Admin Access</h2>
          <p className="text-slate-400 mb-8 font-light text-sm leading-relaxed">
            Authentication required to access HectorHosting global control station.
          </p>
          <button 
            onClick={() => authService.loginWithGoogle()}
            className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/30"
          >
            <Chrome size={20} />
            Login with Admin Account
          </button>
          <button onClick={onClose} className="mt-6 text-slate-500 text-xs uppercase tracking-widest font-bold hover:text-white transition-colors">
            Return to Front
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#07050d] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-10 bg-[#0f0b1a] border border-red-500/20 rounded-3xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/30">
            <ShieldAlert className="text-red-400" size={32} />
          </div>
          <h2 className="text-3xl font-display tracking-tight text-white mb-4">Access Restricted</h2>
          <div className="bg-[#140e25] rounded-xl p-4 mb-8 text-left border border-purple-900/30">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">User ID</p>
            <p className="text-xs text-purple-300 font-mono break-all">{user.uid}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-4 mb-1">Email</p>
            <p className="text-xs text-white truncate">{user.email}</p>
          </div>
          <p className="text-slate-400 mb-8 text-xs font-light leading-relaxed">
            Your account does not have administrative privileges. Add the User ID above to your <code className="text-purple-400 font-mono">admins</code> collection in Firebase to grant access.
          </p>
          <button 
            onClick={() => authService.logout()}
            className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
          >
            Switch Account
          </button>
          <button onClick={onClose} className="mt-6 text-slate-500 text-xs uppercase tracking-widest font-bold hover:text-white transition-colors">
            Return to Front
          </button>
        </div>
      </div>
    );
  }

  const sidebarGroups = [
    {
      title: 'General Settings',
      items: [
        { id: 'dashboard', label: 'Overview & Config', icon: Layout },
        { id: 'status', label: 'Node Status & Maintenance', icon: Radio },
      ]
    },
    {
      title: 'Products & Billing',
      items: [
        { id: 'plans', label: 'Hosting Plans Panel', icon: Layers },
      ]
    },
    {
      title: 'Active Pages Content',
      items: [
        { id: 'tos', label: 'Terms of Service', icon: FileText },
        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
        { id: 'refund', label: 'Refund Policy', icon: RotateCcw },
        { id: 'about', label: 'About Us Page', icon: Globe },
        { id: 'infrastructure', label: 'Infrastructure', icon: Cpu },
        { id: 'legal', label: 'Legal Notices', icon: ShieldAlert },
      ]
    },
    {
      title: 'System Operators',
      items: [
        { id: 'admins', label: 'System Admins', icon: Fingerprint },
        { id: 'logs', label: 'System Logs', icon: Terminal },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-[#07050d] flex overflow-hidden font-sans text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#0a0714] border-r border-purple-900/30 flex flex-col pt-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
               <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wider text-white font-sans uppercase">HECTOR_OS</h2>
              <p className="text-[9px] text-purple-400 font-mono tracking-widest uppercase">Admin Station 5.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-6 pb-8 custom-scrollbar">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-[10px] uppercase tracking-[0.25em] font-bold text-slate-500 mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === item.id 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold' 
                        : 'text-slate-400 hover:bg-purple-950/40 hover:text-white'
                    }`}
                  >
                    <item.icon size={16} className={activeTab === item.id ? 'text-white' : 'text-purple-400'} />
                    {item.label}
                    {activeTab === item.id && <ChevronRight size={12} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-900/30 bg-[#07050d]">
          <div className="px-3 py-2.5 mb-2 flex items-center gap-3 rounded-xl bg-purple-950/20 border border-purple-900/30">
            <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-xs font-bold text-purple-300 border border-purple-500/30">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="min-w-0">
               <p className="text-[11px] text-white font-bold truncate">{user.email}</p>
               <p className="text-[9px] text-purple-400 uppercase tracking-widest font-mono">Root Administrator</p>
            </div>
          </div>
          <button 
            onClick={() => authService.logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
            Command Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#07050d]">
        {/* Top Header */}
        <header className="h-16 border-b border-purple-900/30 flex items-center justify-between px-8 bg-[#0a0714]">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label}
            </h3>
            {isSaved && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase font-mono font-bold flex items-center gap-1.5"
              >
                <Check size={12} /> Sync Saved to Firebase
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeTab !== 'admins' && (
              <button 
                onClick={save}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-500 disabled:opacity-50 transition-all shadow-lg shadow-purple-600/30"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {isSaving ? 'SAVING CHANGES...' : 'SAVE ALL CONFIG'}
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-purple-950/40 transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Tab Content body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* --- TAB 1: OVERVIEW & SITE CONFIG --- */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 max-w-5xl"
              >
                {/* Connection Status & Summary Banner */}
                <div className="p-6 bg-[#0e0a1a] border border-purple-900/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">System Status: Active & Operational</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Primary currency is locked to Indian Rupees (₹ INR). Live synchronization with Firestore database is established.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-xs font-mono font-bold">
                      Firebase Connected
                    </span>
                  </div>
                </div>

                {/* 1. Identity & Branding */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Globe size={16} className="text-purple-400" /> Identity & Branding
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Site Name</label>
                      <input 
                        type="text" 
                        value={localData.settings.site_name}
                        onChange={(e) => updateSettings('site_name', e.target.value)}
                        placeholder="e.g. HectorHosting"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Brand Header Text</label>
                      <input 
                        type="text" 
                        value={localData.settings.brand_name || 'HectorHosting'}
                        onChange={(e) => updateSettings('brand_name', e.target.value)}
                        placeholder="e.g. HectorHosting"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-bold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Site Tagline</label>
                      <input 
                        type="text" 
                        value={localData.settings.tagline}
                        onChange={(e) => updateSettings('tagline', e.target.value)}
                        placeholder="e.g. Enterprise Hosting. Uncompromising Performance."
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-light"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Global Top Announcement Alert Banner */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                      <Megaphone size={16} className="text-yellow-400" /> Announcement Alert Banner
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-slate-300 font-semibold">Enable Banner:</span>
                      <input 
                        type="checkbox" 
                        checked={localData.settings.show_announcement ?? true}
                        onChange={(e) => updateSettings('show_announcement', e.target.checked)}
                        className="w-4 h-4 rounded border-purple-900 bg-[#140e25] text-purple-600 focus:ring-purple-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Banner Announcement Text</label>
                    <input 
                      type="text" 
                      value={localData.settings.announcement_text || ''}
                      onChange={(e) => updateSettings('announcement_text', e.target.value)}
                      placeholder="e.g. ⚡ Monsoon Special: 20% OFF with code HECTOR20!"
                      className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-light"
                    />
                  </div>
                </div>

                {/* 3. Contact & Support Details */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={16} className="text-cyan-400" /> Contact & Portal Links
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Support Email</label>
                      <input 
                        type="email" 
                        value={localData.settings.support_email || ''}
                        onChange={(e) => updateSettings('support_email', e.target.value)}
                        placeholder="support@hectorhosting.com"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">WhatsApp Support Number (Country Code + Number)</label>
                      <input 
                        type="text" 
                        value={localData.settings.whatsapp_number}
                        onChange={(e) => updateSettings('whatsapp_number', e.target.value)}
                        placeholder="e.g. 919876543210"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Discord Server Community Link</label>
                      <input 
                        type="text" 
                        value={localData.settings.discord_url || ''}
                        onChange={(e) => updateSettings('discord_url', e.target.value)}
                        placeholder="https://discord.gg/hectorhosting"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Client Billing Portal URL</label>
                      <input 
                        type="text" 
                        value={localData.settings.billing_url || ''}
                        onChange={(e) => updateSettings('billing_url', e.target.value)}
                        placeholder="https://billing.hectorhosting.com"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. WhatsApp Ordering Message Customizer */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <PhoneCall size={16} className="text-emerald-400" /> WhatsApp Direct Order Message Template
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    Custom template used when clients click "Order Now". Available variables: <code className="text-purple-300 font-mono">{'{plan}'}</code>, <code className="text-purple-300 font-mono">{'{price}'}</code>, <code className="text-purple-300 font-mono">{'{currency}'}</code>.
                  </p>
                  <div>
                    <textarea 
                      value={localData.settings.whatsapp_message}
                      onChange={(e) => updateSettings('whatsapp_message', e.target.value)}
                      rows={3}
                      className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* 5. Indian UPI Payment Details */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <QrCode size={16} className="text-amber-400" /> Indian UPI & Payment Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">UPI ID for Direct Transfers</label>
                      <input 
                        type="text" 
                        value={localData.settings.upi_id || ''}
                        onChange={(e) => updateSettings('upi_id', e.target.value)}
                        placeholder="e.g. hectorhosting@upi"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Payment Note / Instructions</label>
                      <input 
                        type="text" 
                        value={localData.settings.payment_instructions || ''}
                        onChange={(e) => updateSettings('payment_instructions', e.target.value)}
                        placeholder="e.g. Include invoice number in reference note."
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-light"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. System Maintenance System */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-400" /> Emergency System Maintenance Mode
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-slate-300 font-semibold">Maintenance Active:</span>
                      <input 
                        type="checkbox" 
                        checked={localData.settings.maintenance_mode || false}
                        onChange={(e) => updateSettings('maintenance_mode', e.target.checked)}
                        className="w-4 h-4 rounded border-purple-900 bg-[#140e25] text-amber-600 focus:ring-amber-500"
                      />
                    </label>
                  </div>
                  {localData.settings.maintenance_mode && (
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Maintenance Alert Banner Message</label>
                      <input 
                        type="text" 
                        value={localData.settings.maintenance_message || ''}
                        onChange={(e) => updateSettings('maintenance_message', e.target.value)}
                        placeholder="e.g. Scheduled system maintenance in progress."
                        className="w-full bg-[#140e25] border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 focus:border-amber-500 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Database Reset / Push Defaults Card */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="max-w-xl">
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2.5">
                         <Shield size={20} className="text-purple-400" /> Corporate Page Templates Initialization
                      </h4>
                      <p className="text-slate-400 text-xs font-light leading-relaxed">
                         If initializing or resetting, restore compliant and beautifully parsed markdown page templates directly into your active Firestore config collections.
                      </p>
                   </div>
                   <button 
                      onClick={seedDatabase}
                      disabled={isSeeding}
                      className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl flex items-center gap-2.5 hover:bg-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-600/30 text-xs shrink-0"
                   >
                      {isSeeding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield size={16} />}
                      {isSeeding ? 'RESTORING TEMPLATES...' : 'RESTORE PAGE TEMPLATES'}
                   </button>
                </div>
              </motion.div>
            )}

            {/* --- TAB: NODE INFRASTRUCTURE & MAINTENANCE MANAGEMENT --- */}
            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 max-w-5xl"
              >
                {/* Station Top Alert & Public Status Link */}
                <div className="p-6 bg-gradient-to-r from-[#120c24] to-[#0c0818] border border-purple-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center text-purple-400">
                      <Radio size={24} className="animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        VPS & Node Status Center
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono rounded">
                          Live Sync
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Manage hardware hypervisors (Ryzen 9 9950X, AMD EPYC 7443P), game control panel state, and broadcast maintenance notices.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative z-10 shrink-0">
                    <a 
                      href="/status" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
                    >
                      <Globe size={14} />
                      View Public Status Page
                    </a>
                  </div>
                </div>

                {/* 1. Global Emergency Maintenance Switch & Broadcast Banner */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" /> Emergency System Maintenance Broadcast
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                        Activating this immediately displays an emergency maintenance banner across the entire public website and status portal.
                      </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto bg-[#140e25] px-4 py-2 rounded-xl border border-purple-900/40">
                      <span className="text-xs text-white font-bold">Maintenance Mode:</span>
                      <input 
                        type="checkbox" 
                        checked={localData.settings.maintenance_mode || false}
                        onChange={(e) => updateSettings('maintenance_mode', e.target.checked)}
                        className="w-4 h-4 rounded border-purple-900 bg-[#140e25] text-amber-500 focus:ring-amber-400"
                      />
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        localData.settings.maintenance_mode ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {localData.settings.maintenance_mode ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">
                      Global Maintenance Alert Message
                    </label>
                    <input 
                      type="text" 
                      value={localData.settings.maintenance_message || ''}
                      onChange={(e) => updateSettings('maintenance_message', e.target.value)}
                      placeholder="e.g. Scheduled core maintenance in progress. Game instances remain online."
                      className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* 2. Physical & Virtual Node Cluster Monitoring */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                        <Server size={16} className="text-purple-400" /> Hardware Nodes & Game Panel Daemons
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-light">
                        Configure status, specs, IP routing, and panel bindings for each node in your infrastructure.
                      </p>
                    </div>

                    <button
                      onClick={openAddNode}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-purple-600/30 transition-all"
                    >
                      <Plus size={15} /> Add Custom Node
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(localData.systemNodes && localData.systemNodes.length > 0 ? localData.systemNodes : DEFAULT_DATA.systemNodes || []).map((node) => {
                      return (
                        <div 
                          key={node.id} 
                          className="p-5 bg-[#140e25] border border-purple-900/40 hover:border-purple-700/50 rounded-2xl space-y-4 transition-all"
                        >
                          {/* Node Header Row */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="text-base font-black text-white font-mono">{node.name}</span>
                                {node.hasPanel && (
                                  <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[9px] font-mono font-bold uppercase rounded">
                                    Control Panel Node
                                  </span>
                                )}
                                {node.ip && (
                                  <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-900/40">
                                    IP: {node.ip}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 font-light">{node.role}</p>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Quick 1-Click Status Selector Pills */}
                              {(['operational', 'maintenance', 'degraded', 'outage'] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => updateNodeStatus(node.id, st)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                                    node.status === st
                                      ? st === 'operational'
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-bold'
                                        : st === 'maintenance'
                                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-bold'
                                          : st === 'degraded'
                                            ? 'bg-yellow-500 text-black font-bold'
                                            : 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                                      : 'bg-purple-950/40 text-slate-400 hover:text-white border border-purple-900/30'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}

                              <button 
                                onClick={() => openEditNode(node)}
                                className="p-2 hover:bg-purple-800/40 text-slate-300 hover:text-white rounded-lg transition-colors ml-2"
                                title="Edit Node Specifications"
                              >
                                <Edit2 size={15} />
                              </button>

                              <button 
                                onClick={() => deleteSystemNode(node.id)}
                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                title="Delete Node"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Node Specs Info line */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-900/30 text-[11px] font-mono text-slate-300">
                            <div><span className="text-slate-500">CPU:</span> {node.cpu}</div>
                            <div><span className="text-slate-500">RAM:</span> {node.ram}</div>
                            <div><span className="text-slate-500">Storage:</span> {node.storage}</div>
                            <div><span className="text-slate-500">Uptime:</span> {node.uptime}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Post Maintenance Announcement or Incident Notice */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Megaphone size={16} className="text-yellow-400" /> Broadcast Maintenance Notice or Incident
                  </h4>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    Post a scheduled maintenance notice or incident report. It will be published instantly to the public Status Page.
                  </p>

                  <form onSubmit={postIncidentNotice} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                          Notice / Incident Title
                        </label>
                        <input 
                          type="text" 
                          required
                          value={incidentForm.title}
                          onChange={(e) => setIncidentForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Scheduled Kernel Upgrade on Ryzen 9 9950X"
                          className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                          Category & Status
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={incidentForm.type}
                            onChange={(e) => setIncidentForm(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                          >
                            <option value="scheduled_maintenance">Scheduled Maintenance</option>
                            <option value="incident">Service Incident</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="notice">General Notice</option>
                          </select>

                          <select
                            value={incidentForm.status}
                            onChange={(e) => setIncidentForm(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="investigating">Investigating</option>
                            <option value="identified">Identified</option>
                            <option value="monitoring">Monitoring</option>
                            <option value="resolved">Resolved / Complete</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                          Affected Targets (Comma Separated)
                        </label>
                        <input 
                          type="text" 
                          value={incidentForm.affectedNodes.join(', ')}
                          onChange={(e) => setIncidentForm(prev => ({ ...prev, affectedNodes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                          placeholder="e.g. RYZEN 9 9950X, EPYC 7443P, Game Control Panel"
                          className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                          Schedule Window (Optional)
                        </label>
                        <input 
                          type="text" 
                          value={incidentForm.scheduledFor}
                          onChange={(e) => setIncidentForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                          placeholder="e.g. Sunday at 02:00 UTC (15 mins window)"
                          className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                          Announcement Message Details
                        </label>
                        <textarea 
                          required
                          rows={3}
                          value={incidentForm.message}
                          onChange={(e) => setIncidentForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Provide details about the maintenance or incident..."
                          className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none leading-relaxed font-light"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isPostingIncident}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
                      >
                        {isPostingIncident ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Megaphone size={15} />
                        )}
                        <span>{isPostingIncident ? 'Publishing...' : 'Broadcast Maintenance Bulletin'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 4. Active Announcements & Incident History Log */}
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={16} className="text-purple-400" /> Maintenance & Incident Log Archives
                  </h4>

                  <div className="space-y-3">
                    {(localData.incidents && localData.incidents.length > 0 ? localData.incidents : DEFAULT_DATA.incidents || []).map((inc) => (
                      <div 
                        key={inc.id}
                        className="p-4 bg-[#140e25] border border-purple-900/40 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-sm font-bold text-white">{inc.title}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              inc.status === 'resolved' || inc.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : inc.status === 'scheduled'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {inc.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{inc.message}</p>
                          <span className="text-[10px] font-mono text-purple-400 block">{inc.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={inc.status}
                            onChange={(e) => updateIncidentStatus(inc.id, e.target.value as any)}
                            className="bg-[#0e0a1a] border border-purple-900/60 rounded-lg px-2.5 py-1.5 text-xs text-purple-300 font-mono"
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="investigating">Investigating</option>
                            <option value="monitoring">Monitoring</option>
                            <option value="resolved">Resolved</option>
                          </select>

                          <button 
                            onClick={() => deleteIncidentNotice(inc.id)}
                            className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                            title="Delete Notice"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB: HOSTING PLANS & BILLING (WHMCS-STYLE) --- */}
            {activeTab === 'plans' && (
              <motion.div
                key="plans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* WHMCS Billing System Banner */}
                <div className="p-6 bg-gradient-to-r from-[#120c24] to-[#0c0818] border border-purple-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center text-purple-400">
                      <Coins size={24} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-tight">WHMCS Hosting Billing Station</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Manage hosting categories, physical nodes, locations, and multi-currency pricing dynamically.</p>
                    </div>
                  </div>
                  <button 
                    onClick={openAddPlan}
                    className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/30 relative z-10"
                  >
                    <Plus size={16} />
                    Create New Hosting Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* LEFT: TAXONOMY CONFIG (4 COLS) */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0e0a1a] border border-purple-900/40 p-6 rounded-2xl space-y-6">
                      <h3 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2 border-b border-purple-900/30 pb-3">
                        <Database size={14} className="text-purple-400" /> WHMCS OPTIONS MANAGER
                      </h3>

                      {/* CATEGORIES SECTION */}
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">1. Product Categories</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. MINI-VPS"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCategory()}
                            className="flex-1 bg-[#140e25] border border-purple-900/40 rounded-xl p-2.5 text-xs text-white uppercase focus:border-purple-500 outline-none font-mono"
                          />
                          <button 
                            onClick={addCategory}
                            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {localData.categories?.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#120e20] border border-purple-900/40 text-[9px] font-mono text-purple-300">
                              {cat}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Category X Clicked:", cat);
                                  deleteCategory(cat);
                                }} 
                                className="ml-1 p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-sm transition-all"
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* LOCATIONS SECTION */}
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">2. Physical Datacenters</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. USA (Dallas)"
                            value={newLocation}
                            onChange={e => setNewLocation(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addLocation()}
                            className="flex-1 bg-[#140e25] border border-purple-900/40 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 outline-none"
                          />
                          <button 
                            onClick={addLocation}
                            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {localData.locations?.map(loc => (
                            <span key={loc} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#120e20] border border-purple-900/40 text-[9px] font-mono text-slate-300">
                              <MapPin size={10} className="text-purple-400" />
                              {loc}
                              <button onClick={() => deleteLocation(loc)} className="text-slate-500 hover:text-red-400 transition-colors">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* HARDWARE NODES SECTION */}
                      <div className="space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">3. Compute Nodes</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="e.g. Ryzen-Compute-02"
                            value={newNodeOption}
                            onChange={e => setNewNodeOption(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addNodeOption()}
                            className="flex-1 bg-[#140e25] border border-purple-900/40 rounded-xl p-2.5 text-xs text-white focus:border-purple-500 outline-none font-mono"
                          />
                          <button 
                            onClick={addNodeOption}
                            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {localData.nodes?.map(node => (
                            <span key={node} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#120e20] border border-purple-900/40 text-[9px] font-mono text-slate-300">
                              <Server size={10} className="text-purple-400" />
                              {node}
                              <button onClick={() => deleteNodeOption(node)} className="text-slate-500 hover:text-red-400 transition-colors">
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-purple-900/20">
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          💡 <strong>Notice:</strong> Adding options modifies them in memory. Click the "SAVE ALL CONFIG" button in the upper header to persist taxonomy lists to database.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* RIGHT: PLAN LIST BOARD (8 COLS) */}
                  <div className="lg:col-span-8 space-y-8">
                    {localData.categories?.length === 0 ? (
                      <div className="p-10 bg-[#0e0a1a] border border-purple-900/30 rounded-2xl text-center">
                        <p className="text-sm text-slate-400 font-light">Please create at least one Product Category first!</p>
                      </div>
                    ) : (
                      localData.categories?.map(categoryName => {
                        const filteredPlans = (localData.plans?.filter(p => p.category === categoryName) || [])
                          .sort((a, b) => (a.order || 0) - (b.order || 0));
                        return (
                          <div key={categoryName} className="bg-[#0e0a1a] border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl">
                            {/* Category Header */}
                            <div className="px-6 py-4 bg-[#140e25] border-b border-purple-900/30 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Layers size={16} className="text-purple-400" />
                                <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-white">{categoryName}</h3>
                                <span className="px-2 py-0.5 rounded bg-purple-950 text-[9px] font-mono font-bold text-purple-300 border border-purple-900/40">
                                  {filteredPlans.length} plans
                                </span>
                              </div>
                            </div>

                            {/* Active Plans List */}
                            <div className="divide-y divide-purple-900/30 bg-[#0c0818]/40">
                              {filteredPlans.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-xs font-light">
                                  No plans registered under {categoryName}. Click "Create New Hosting Plan" to assign one.
                                </div>
                              ) : (
                                filteredPlans.map(plan => (
                                  <div key={plan.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-purple-950/10 transition-colors group">
                                    <div className="space-y-1.5 flex-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-white">{plan.name}</h4>
                                        {plan.badge && (
                                          <span className="px-1.5 py-0.5 bg-purple-600/30 border border-purple-500/30 text-purple-300 text-[8px] font-mono font-bold rounded">
                                            {plan.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-400 line-clamp-1 font-light max-w-xl">{plan.desc || 'No description configured.'}</p>
                                      
                                      <div className="flex flex-wrap gap-2.5 pt-1 text-[9px] font-mono text-slate-500">
                                        <span className="flex items-center gap-1">
                                          <MapPin size={10} className="text-purple-400" /> {plan.location || 'Any location'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Server size={10} className="text-purple-400" /> {plan.node || 'Any node'}
                                        </span>
                                        <span>•</span>
                                        <span>{plan.features?.length || 0} specs</span>
                                      </div>
                                    </div>

                                    {/* Multi-Currency Matrix Display */}
                                    <div className="flex items-center gap-8 shrink-0">
                                      <div className="text-right">
                                        <div className="text-[8px] font-mono uppercase tracking-wider text-slate-500">Price Model</div>
                                        <div className="text-xs font-mono font-bold text-white mt-0.5">
                                          ₹{plan.price_inr || '0'} <span className="text-[9px] text-slate-400 font-normal">INR</span>
                                        </div>
                                        <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                                          ${plan.price || '0'} USD • €{plan.price_eur || '0'} EUR
                                        </div>
                                      </div>

                                      {/* Quick Actions */}
                                      <div className="flex gap-1.5">
                                        <div className="flex flex-col gap-1 mr-2">
                                          <button 
                                            onClick={() => movePlan(plan.id, 'up')}
                                            disabled={filteredPlans.indexOf(plan) === 0}
                                            className="p-1 hover:text-purple-400 disabled:opacity-30 transition-colors"
                                            title="Move Up"
                                          >
                                            <ChevronRight size={14} className="-rotate-90" />
                                          </button>
                                          <button 
                                            onClick={() => movePlan(plan.id, 'down')}
                                            disabled={filteredPlans.indexOf(plan) === filteredPlans.length - 1}
                                            className="p-1 hover:text-purple-400 disabled:opacity-30 transition-colors"
                                            title="Move Down"
                                          >
                                            <ChevronRight size={14} className="rotate-90" />
                                          </button>
                                        </div>
                                        <button 
                                          onClick={() => openEditPlan(plan)}
                                          className="p-2 bg-purple-950/60 border border-purple-900/30 hover:border-purple-500 text-purple-300 rounded-lg transition-colors"
                                          title="Edit Spec"
                                        >
                                          <Edit2 size={13} />
                                        </button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                                          className="p-2 bg-red-950/40 border border-red-900/30 hover:border-red-500 text-red-400 rounded-lg transition-colors"
                                          title="Delete Spec"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* CREATE/EDIT PLAN FORM MODAL */}
                <AnimatePresence>
                  {isPlanModalOpen && (
                    <div className="fixed inset-0 z-[1100] bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        className="bg-[#0f0b1a] border border-purple-900/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8"
                      >
                        <button 
                          onClick={() => { setIsPlanModalOpen(false); setEditingPlan(null); }}
                          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-purple-950/40 transition-colors"
                        >
                          <X size={18} />
                        </button>

                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
                          {editingPlan ? 'Edit Hosting Plan Spec' : 'Create New Hosting Plan'}
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">
                          Configure specifications, multi-currency values, and features below. Syncs directly to active pages.
                        </p>

                        <form onSubmit={savePlanForm} className="space-y-6">
                          {/* Name & Badge Row */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Plan Name *</label>
                              <input 
                                type="text" 
                                required
                                placeholder="e.g. Starter Ryzen VPS"
                                value={planForm.name}
                                onChange={e => setPlanForm({ ...planForm, name: e.target.value })}
                                className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Plan Badge (Optional)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Popular, Value, Best Seller"
                                value={planForm.badge}
                                onChange={e => setPlanForm({ ...planForm, badge: e.target.value })}
                                className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                              />
                            </div>
                          </div>

                          {/* Category, Location, Node Row */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Product Category *</label>
                              <select 
                                value={planForm.category}
                                onChange={e => setPlanForm({ ...planForm, category: e.target.value })}
                                className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none uppercase font-mono"
                              >
                                {localData.categories?.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Target Location *</label>
                              <select 
                                value={planForm.location}
                                onChange={e => setPlanForm({ ...planForm, location: e.target.value })}
                                className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                              >
                                {localData.locations?.map(loc => (
                                  <option key={loc} value={loc}>{loc}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Compute Node Hardware *</label>
                              <select 
                                value={planForm.node}
                                onChange={e => setPlanForm({ ...planForm, node: e.target.value })}
                                className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                              >
                                {localData.nodes?.map(node => (
                                  <option key={node} value={node}>{node}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Multi-Currency Price Row */}
                          <div className="p-4 bg-[#120e20] border border-purple-900/30 rounded-2xl space-y-4">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">WHMCS Dynamic Multi-Currency Pricing</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">Price in INR (₹) *</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="e.g. 599"
                                  value={planForm.price_inr}
                                  onChange={e => setPlanForm({ ...planForm, price_inr: e.target.value })}
                                  className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">Price in USD ($) *</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="e.g. 7"
                                  value={planForm.price}
                                  onChange={e => setPlanForm({ ...planForm, price: e.target.value })}
                                  className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono font-bold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">Price in EUR (€)</label>
                                <input 
                                  type="text" 
                                  placeholder="Leave blank to auto-calculate"
                                  value={planForm.price_eur}
                                  onChange={e => setPlanForm({ ...planForm, price_eur: e.target.value })}
                                  className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Short Description */}
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Short Plan Description</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Perfect for launching standard production workloads and sites."
                              value={planForm.desc}
                              onChange={e => setPlanForm({ ...planForm, desc: e.target.value })}
                              className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-light"
                            />
                          </div>

                          {/* Features Text Area */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Spec & Features List (One feature per line)</label>
                              <span className="text-[9px] text-purple-400 font-mono">Each line displays as a separate check spec</span>
                            </div>
                            <textarea 
                              rows={5}
                              placeholder="e.g.&#10;2 vCPU Ryzen 9&#10;4 GB DDR4 RAM&#10;50 GB NVMe SSD&#10;Unmetered Bandwidth"
                              value={planForm.featuresText}
                              onChange={e => setPlanForm({ ...planForm, featuresText: e.target.value })}
                              className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                            />
                          </div>

                          {/* Save & Cancel Row */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-purple-900/30">
                            <button 
                              type="button"
                              onClick={() => { setIsPlanModalOpen(false); setEditingPlan(null); }}
                              className="px-5 py-3 bg-[#120e20] hover:bg-purple-950/40 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              disabled={isSaving}
                              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/30"
                            >
                              {isSaving ? 'Saving...' : editingPlan ? 'Save Specification' : 'Add Hosting Plan'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* --- TAB: TERMS OF SERVICE EDITOR --- */}
            {activeTab === 'tos' && (
              <motion.div
                key="tos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Terms of Service (/tos)</h3>
                  <p className="text-xs text-slate-400 mb-6">Edit terms of usage, SLA policies, and acceptable behaviors. Changes instantly render on the live public terms route.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="Terms of Service (TOS) Markdown Content"
                  value={localData.tos}
                  onChange={val => setLocalData({ ...localData, tos: val })}
                  placeholder="# Terms of Service&#10;&#10;## 1. Acceptable Use Policy (AUP)..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB: PRIVACY POLICY EDITOR --- */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Privacy Policy (/privacy)</h3>
                  <p className="text-xs text-slate-400 mb-6">Modify visitor privacy covenants, data safety compliance rules, and cookies guidelines.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="Privacy Policy Markdown Content"
                  value={localData.privacy}
                  onChange={val => setLocalData({ ...localData, privacy: val })}
                  placeholder="# Privacy Policy&#10;&#10;## 1. Data Collection..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB: REFUND POLICY EDITOR --- */}
            {activeTab === 'refund' && (
              <motion.div
                key="refund"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Refund Policy (/refund)</h3>
                  <p className="text-xs text-slate-400 mb-6">Formulate eligibility lists, refund guarantees, and instant request processes.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="Refund Policy Markdown Content"
                  value={localData.refund}
                  onChange={val => setLocalData({ ...localData, refund: val })}
                  placeholder="# Refund Policy&#10;&#10;## 30-Day Money-Back Guarantee..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB: ABOUT US EDITOR --- */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">About Us Page (/about)</h3>
                  <p className="text-xs text-slate-400 mb-6">Edit corporate history milestones, founding mission statements, and operational values.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="About Us Page Markdown Content"
                  value={localData.about}
                  onChange={val => setLocalData({ ...localData, about: val })}
                  placeholder="# About Hector Hosting&#10;&#10;## Our Mission&#10;To democratize enterprise computing..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB: INFRASTRUCTURE EDITOR --- */}
            {activeTab === 'infrastructure' && (
              <motion.div
                key="infrastructure"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Infrastructure (/infrastructure)</h3>
                  <p className="text-xs text-slate-400 mb-6">Explain physical node locations, hardware specifications, and network parameters.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="Our Global Infrastructure Markdown Details"
                  value={localData.infrastructure}
                  onChange={val => setLocalData({ ...localData, infrastructure: val })}
                  placeholder="# Our Global Infrastructure&#10;&#10;## Tier 4 Data Centers&#10;Housed across premium networks..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB: LEGAL NOTICES EDITOR --- */}
            {activeTab === 'legal' && (
              <motion.div
                key="legal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-6xl"
              >
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">Legal Notices (/legal)</h3>
                  <p className="text-xs text-slate-400 mb-6">Modify jurisdiction codes, corporate entities, and legal disclaimer notices.</p>
                </div>
                <MarkdownEditorWithPreview
                  label="Legal Information Markdown Content"
                  value={localData.legal}
                  onChange={val => setLocalData({ ...localData, legal: val })}
                  placeholder="# Legal Information&#10;&#10;## Compliance & Jurisdiction..."
                  heightClass="h-[550px]"
                />
              </motion.div>
            )}

            {/* --- TAB 13: SYSTEM ADMIN OPERATORS --- */}
            {activeTab === 'admins' && (
              <motion.div
                key="admins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl space-y-8"
              >
                <div className="bg-[#0e0a1a] border border-purple-900/40 p-8 rounded-3xl flex items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2.5">
                      <Shield className="text-purple-400" size={20} /> Infrastructure Access Control
                    </h4>
                    <p className="text-slate-400 text-xs font-light">
                      Grant administrative privileges to additional team members by adding their Firebase User UID.
                    </p>
                  </div>
                  <UserPlus className="text-purple-500/30 hover:text-purple-500/50 transition-colors shrink-0" size={56} />
                </div>

                <div className="bg-[#0e0a1a] border border-purple-900/40 p-8 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                    <Plus size={16} className="text-purple-400" /> Add New Admin Operator
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Firebase UID</label>
                      <input 
                        type="text" 
                        value={newAdmin.uid}
                        onChange={(e) => setNewAdmin({ ...newAdmin, uid: e.target.value })}
                        placeholder="e.g. xY7z... (from Firebase Auth)"
                        className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white font-mono focus:border-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">Operator Email</label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                          placeholder="admin@hectorhosting.com"
                          className="flex-1 bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                        />
                        <button 
                          onClick={async () => {
                            if (isSaving || !newAdmin.uid || !newAdmin.email) return;
                            setIsSaving(true);
                            try {
                              await dataService.addAdmin(newAdmin.uid, newAdmin.email);
                              setNewAdmin({ uid: '', email: '' });
                              loadAdmins();
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-purple-500 shadow-lg shadow-purple-600/30 shrink-0 disabled:opacity-50"
                        >
                          {isSaving ? 'Granting...' : 'Grant'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e0a1a] border border-purple-900/40 rounded-2xl overflow-hidden">
                  <div className="px-8 py-5 border-b border-purple-900/30 bg-[#140e25]">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Active Root Operators</h4>
                  </div>
                  <div className="divide-y divide-purple-900/30">
                    {admins.map((adm) => (
                      <div key={adm.uid} className="px-8 py-4 flex items-center justify-between group hover:bg-purple-950/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                            <Fingerprint size={20} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{adm.email}</div>
                            <div className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">{adm.uid}</div>
                          </div>
                        </div>
                        {adm.uid !== user.uid && (
                          <button 
                            onClick={() => {
                              logService.addLog('info', `Admin revocation requested for ${adm.email}`);
                              setConfirmModal({
                                isOpen: true,
                                title: 'Revoke Admin Privileges',
                                message: `Are you sure you want to revoke administrative access for ${adm.email}? This user will no longer be able to access this control station.`,
                                onConfirm: async () => {
                                  logService.addLog('warning', `User confirmed admin revocation for: ${adm.email}`);
                                  try {
                                    await dataService.deleteAdmin(adm.uid);
                                    logService.addLog('success', `Admin access revoked for ${adm.email}`);
                                    loadAdmins();
                                  } catch (err: any) {
                                    logService.addLog('error', `Revocation failed: ${err.message}`);
                                    alert(`Revocation failed: ${err.message}`);
                                  }
                                }
                              });
                            }}
                            className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={16} />
                          </button>
                        )}
                        {adm.uid === user.uid && (
                          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest px-3 py-1 bg-purple-600/20 rounded-full border border-purple-500/30">Self</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- TAB 10: SYSTEM LOGS --- */}
            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col h-full space-y-6 max-w-6xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <Terminal size={24} className="text-purple-400" /> Site Operation Logs
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">Real-time tracing of all administrative actions and database events.</p>
                  </div>
                  <button 
                    onClick={() => logService.clear()}
                    className="px-4 py-2 bg-purple-950/40 border border-purple-900/40 text-purple-300 text-xs font-bold rounded-lg hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
                  >
                    Clear All Logs
                  </button>
                </div>

                <div className="flex-1 bg-[#0a0714] border border-purple-900/40 rounded-2xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-purple-900/40 bg-purple-950/10 grid grid-cols-[140px_100px_1fr] gap-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    <div>Timestamp</div>
                    <div>Event Type</div>
                    <div>Message / Payload</div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px] custom-scrollbar">
                    {logs.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-600 italic">
                        No operations logged in current session.
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="grid grid-cols-[140px_100px_1fr] gap-4 py-1.5 border-b border-purple-900/10 hover:bg-purple-900/5 transition-colors group">
                          <div className="text-slate-500 group-hover:text-slate-400">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                          <div>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter ${
                              log.type === 'error' ? 'bg-red-500/20 text-red-400' :
                              log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                              log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {log.type}
                            </span>
                          </div>
                          <div className={`${
                            log.type === 'error' ? 'text-red-300' :
                            log.type === 'success' ? 'text-emerald-300' :
                            'text-slate-300'
                          }`}>
                            {log.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- CUSTOM CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-[#0f0b1a] border border-purple-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle className="text-red-400" size={28} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{confirmModal.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">{confirmModal.message}</p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HARDWARE NODE CONFIG MODAL --- */}
      <AnimatePresence>
        {isNodeModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-2xl w-full bg-[#0f0b1a] border border-purple-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
                    <Server size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                      {editingNode ? `Edit Hardware Node: ${editingNode.name}` : 'Provision Custom Cluster Node'}
                    </h3>
                    <p className="text-xs text-slate-400">Configure status telemetry, IP address, and hardware specifications.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNodeModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-white rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Node Cluster Identifier *
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.name}
                    onChange={e => setNodeForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. RYZEN 9 9950X or AMD EPYC 7443P"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Node IP Address (Public)
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.ip}
                    onChange={e => setNodeForm(prev => ({ ...prev, ip: e.target.value }))}
                    placeholder="e.g. 103.118.182.98"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Operational Role & Workload
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.role}
                    onChange={e => setNodeForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Primary Game Virtualization & Wings Daemon Hypervisor"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Node Status
                  </label>
                  <select
                    value={nodeForm.status}
                    onChange={e => setNodeForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  >
                    <option value="operational">Operational (Online)</option>
                    <option value="maintenance">Maintenance (Scheduled)</option>
                    <option value="degraded">Degraded Performance</option>
                    <option value="outage">Major Outage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Datacenter Facility
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.location}
                    onChange={e => setNodeForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Mumbai, India"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    CPU Specifications
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.cpu}
                    onChange={e => setNodeForm(prev => ({ ...prev, cpu: e.target.value }))}
                    placeholder="e.g. AMD Ryzen 9 9950X (16C/32T 5.7GHz)"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    RAM Memory
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.ram}
                    onChange={e => setNodeForm(prev => ({ ...prev, ram: e.target.value }))}
                    placeholder="e.g. 128 GB DDR5 ECC"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    NVMe Storage
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.storage}
                    onChange={e => setNodeForm(prev => ({ ...prev, storage: e.target.value }))}
                    placeholder="e.g. 2x 2TB Gen4 Enterprise NVMe"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1.5 block">
                    Uptime SLA Percentage
                  </label>
                  <input 
                    type="text" 
                    value={nodeForm.uptime}
                    onChange={e => setNodeForm(prev => ({ ...prev, uptime: e.target.value }))}
                    placeholder="e.g. 99.99%"
                    className="w-full bg-[#140e25] border border-purple-900/40 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <label className="flex items-center gap-3 p-3 bg-[#140e25] border border-purple-900/40 rounded-xl cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={nodeForm.hasPanel}
                      onChange={e => setNodeForm(prev => ({ ...prev, hasPanel: e.target.checked }))}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-[#0e0a1a] border-purple-900"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Hosts Hector Game Control Panel</span>
                      <span className="text-[10px] text-slate-400">Mark this node as the primary host for the web management panel.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsNodeModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveNodeModal}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Save size={15} />
                  <span>Save Node Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
