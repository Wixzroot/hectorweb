import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { AppData, Plan, Feedback, Testimonial, SystemNode, Incident } from './types';
import { DEFAULT_DATA } from './constants';
import { dataService } from './services/dataService';
import { authService } from './services/authService';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './services/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ContentPage } from './components/ContentPage';
import { Home } from './pages/Home';
import { GameServersPage } from './pages/GameServersPage';
import { GamePricingPage } from './pages/GamePricingPage';
import { VpsHostingPage } from './pages/VpsHostingPage';
import { DiscordBotPage } from './pages/DiscordBotPage';
import { DedicatedServersPage } from './pages/DedicatedServersPage';
import { Footer } from './components/Footer';
import { WebHostingPage } from './pages/WebHostingPage';
import { CategoryPage } from './pages/CategoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { RefundPage } from './pages/RefundPage';
import { StatusPage } from './pages/StatusPage';

// ScrollToTop component to reset window scroll on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeCurrency] = useState<'INR'>('INR');
  const [feedbackForm, setFeedbackForm] = useState({ name: '', msg: '', rating: 5 });
  const [isLoading, setIsLoading] = useState(true);

  // Auth & Admin Check
  useEffect(() => {
    const unsub = authService.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const adminStatus = await authService.isAdmin(u.uid, u.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });
    return unsub;
  }, []);

  // Data Sync & Automatic Database Seeding on Data Loss/Empty state
  useEffect(() => {
    let hasCheckedSeed = false;

    const checkAndSeed = async () => {
      // User requested strictly database-driven plans with no file fallbacks or auto-seeding
      console.log("Strict database-only mode active.");
      return;
    };

    let configDocExists = false;

    const unsubSettings = onSnapshot(doc(db, 'config/site'), (snap) => {
      configDocExists = snap.exists();
      if (snap.exists()) {
        const settings = snap.data() as any;
        setData(prev => ({
          ...prev,
          settings: { ...prev.settings, ...(settings.settings || {}) },
          privacy: settings.privacy || prev.privacy,
          refund: settings.refund || prev.refund,
          tos: settings.tos || prev.tos,
          legal: settings.legal || prev.legal,
          infrastructure: settings.infrastructure || prev.infrastructure,
          about: settings.about || prev.about,
          categories: Array.from(new Set(settings.categories || prev.categories)),
          locations: Array.from(new Set(settings.locations || prev.locations)),
          nodes: Array.from(new Set(settings.nodes || prev.nodes)),
          systemNodes: settings.systemNodes || prev.systemNodes,
          incidents: settings.incidents || prev.incidents
        }));
      } else {
        checkAndSeed();
      }
    });

    const unsubNodes = onSnapshot(collection(db, 'nodes'), (snap) => {
      if (!snap.empty) {
        const nodes = snap.docs.map(d => ({ ...d.data(), id: d.id } as SystemNode));
        setData(prev => ({ ...prev, systemNodes: nodes }));
      }
    });

    const unsubIncidents = onSnapshot(query(collection(db, 'incidents'), orderBy('createdAt', 'desc')), (snap) => {
      if (!snap.empty) {
        const incidents = snap.docs.map(d => ({ ...d.data(), id: d.id } as Incident));
        setData(prev => ({ ...prev, incidents }));
      }
    });

    const unsubPlans = onSnapshot(collection(db, 'plans'), (snap) => {
      const plans = snap.docs.map(d => ({ ...d.data(), id: d.id } as Plan));
      // Defensive: Filter out any potential duplicate document IDs from the snapshot array
      const uniquePlans = Array.from(new Map(plans.map(item => [item.id, item])).values());
      setData(prev => ({ ...prev, plans: uniquePlans }));
    });

    const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snap) => {
      const testimonials = snap.docs.map(d => ({ ...d.data(), id: d.id } as Testimonial));
      // Defensive: Filter out any potential duplicate document IDs
      const uniqueTestimonials = Array.from(new Map(testimonials.map(item => [item.id, item])).values());
      setData(prev => ({ ...prev, testimonials: uniqueTestimonials }));
      setIsLoading(false);
    });

    const unsubFeedback = dataService.subscribeFeedbacks((feedbacks) => {
      setData(prev => ({ ...prev, feedbacks }));
    });

    return () => {
      unsubSettings();
      unsubNodes();
      unsubIncidents();
      unsubPlans();
      unsubTestimonials();
      unsubFeedback();
    };
  }, []);

  useEffect(() => {
    // Apply themes to document
    document.documentElement.setAttribute('data-theme', data.settings.theme);
    document.documentElement.setAttribute('data-color', data.settings.color);
    document.documentElement.setAttribute('data-font', data.settings.font);
  }, [data.settings]);

  const toggleTheme = () => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: prev.settings.theme === 'dark' ? 'light' : 'dark' }
    }));
  };

  const handleOrder = (plan: Plan) => {
    const phone = data.settings.whatsapp_number.replace(/\D/g, '');
    const priceVal = plan.price_inr || plan.price;

    const message = data.settings.whatsapp_message
      .replace('{plan}', plan.name)
      .replace('{price}', priceVal)
      .replace('{currency}', '₹')
      .replace('{features}', plan.features.join(', '))
      + `\n\nConfig:\n📍 Loc: ${plan.location}\n⚙️ Node: ${plan.node}`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.msg) return;

    const feedbackData: Omit<Feedback, 'id'> = {
      name: feedbackForm.name || 'Anonymous',
      msg: feedbackForm.msg,
      rating: feedbackForm.rating,
      time: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    await dataService.addFeedback(feedbackData);
    setFeedbackForm({ name: '', msg: '', rating: 5 });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdminMode) {
    return (
      <AdminPanel 
        data={data} 
        setData={setData} 
        onClose={() => setIsAdminMode(false)} 
        user={user}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar 
          settings={data.settings} 
          categories={data.categories}
          toggleTheme={toggleTheme} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={
              <Home 
                data={data}
                feedbackForm={feedbackForm}
                setFeedbackForm={setFeedbackForm}
                submitFeedback={submitFeedback}
              />
            } />
            <Route path="/game-servers" element={
              <GameServersPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/game-hosting" element={
              <GameServersPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/games" element={
              <GameServersPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/game/:gameId" element={
              <GamePricingPage 
                data={data}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/vps-hosting" element={
              <VpsHostingPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/vps" element={
              <VpsHostingPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/discord-bot-hosting" element={
              <DiscordBotPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/bot-hosting" element={
              <DiscordBotPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/dedicated-servers" element={
              <DedicatedServersPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/ded-servers" element={
              <DedicatedServersPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/web-hosting" element={
              <WebHostingPage 
                data={data}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/web" element={
              <WebHostingPage 
                data={data}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/plans" element={
              <VpsHostingPage 
                data={data}
                activeCurrency={activeCurrency}
                handleOrder={handleOrder}
              />
            } />
            <Route path="/about" element={<AboutPage data={data} />} />
            <Route path="/status" element={<StatusPage data={data} />} />
            <Route path="/contact" element={<ContactPage data={data} />} />
            <Route path="/infrastructure" element={<ContentPage title="Our Infrastructure" content={data.infrastructure} />} />
            <Route path="/privacy" element={<PrivacyPage data={data} />} />
            <Route path="/refund" element={<RefundPage data={data} />} />
            <Route path="/tos" element={<TermsPage data={data} />} />
            <Route path="/legal" element={<ContentPage title="Legal Notices" content={data.legal} />} />
            
            {/* Dynamic Category Catch-all */}
            <Route path="/:categoryId" element={
              <CategoryPage 
                data={data} 
                handleOrder={handleOrder} 
              />
            } />
          </Routes>
        </main>

        <Footer data={data} setIsAdminMode={setIsAdminMode} />
      </div>
    </BrowserRouter>
  );
}

