/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, 
  query, orderBy, onSnapshot, where 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';
import { Settings, Plan, Testimonial, Feedback, AppData } from '../types';

export const dataService = {
  // Site Config
  async getSettings(): Promise<Partial<AppData> | null> {
    const path = 'config/site';
    try {
      const snap = await getDoc(doc(db, path));
      return snap.exists() ? snap.data() as Partial<AppData> : null;
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, path);
      return null;
    }
  },

  async updateSettings(settings: Partial<AppData>) {
    const path = 'config/site';
    try {
      await setDoc(doc(db, path), settings, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  // Plans
  async getPlans(): Promise<Plan[]> {
    const path = 'plans';
    try {
      const snap = await getDocs(query(collection(db, path)));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Plan));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async addPlan(plan: Omit<Plan, 'id'>) {
    const path = 'plans';
    try {
      const docRef = await addDoc(collection(db, path), plan);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async updatePlan(id: string, plan: Partial<Plan>) {
    const path = `plans/${id}`;
    try {
      await updateDoc(doc(db, 'plans', id), plan);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async deletePlan(id: string) {
    const path = `plans/${id}`;
    try {
      await deleteDoc(doc(db, 'plans', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const path = 'testimonials';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as Testimonial));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async addTestimonial(t: Omit<Testimonial, 'id'>) {
    const path = 'testimonials';
    try {
      const docRef = await addDoc(collection(db, path), t);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  async updateTestimonial(id: string, t: Partial<Testimonial>) {
    const path = `testimonials/${id}`;
    try {
      await updateDoc(doc(db, 'testimonials', id), t);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async deleteTestimonial(id: string) {
    const path = `testimonials/${id}`;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  },

  // Feedbacks
  async addFeedback(feedback: Omit<Feedback, 'id'>) {
    const path = 'feedbacks';
    try {
      const docRef = await addDoc(collection(db, path), feedback);
      return docRef.id;
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
  },

  subscribeFeedbacks(callback: (feedbacks: Feedback[]) => void) {
    const path = 'feedbacks';
    return onSnapshot(
      query(collection(db, path), orderBy('time', 'desc')), 
      (snap) => {
        const feedbacks = snap.docs.map(d => ({ ...d.data(), id: d.id } as Feedback));
        // Defensive: Deduplicate feedbacks by document ID
        const uniqueFeedbacks = Array.from(new Map(feedbacks.map(item => [item.id, item])).values());
        callback(uniqueFeedbacks);
      },
      (e) => handleFirestoreError(e, OperationType.LIST, path)
    );
  },

  // Admins
  async getAdmins(): Promise<{ uid: string, email: string }[]> {
    const path = 'admins';
    try {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map(d => ({ uid: d.id, ...d.data() } as { uid: string, email: string }));
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, path);
      return [];
    }
  },

  async addAdmin(uid: string, email: string) {
    const path = `admins/${uid}`;
    try {
      await setDoc(doc(db, 'admins', uid), { email });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  },

  async deleteAdmin(uid: string) {
    const path = `admins/${uid}`;
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, path);
    }
  },

  // Seed Default Data
  async seedAllDefaultData(defaultData: AppData) {
    try {
      // 1. Config Site
      await setDoc(doc(db, 'config/site'), {
        settings: defaultData.settings,
        privacy: defaultData.privacy,
        refund: defaultData.refund,
        tos: defaultData.tos,
        legal: defaultData.legal,
        infrastructure: defaultData.infrastructure,
        about: defaultData.about,
        categories: defaultData.categories,
        locations: defaultData.locations,
        nodes: defaultData.nodes
      }, { merge: true });

      // 2. Plans
      for (const plan of defaultData.plans) {
        const { id, ...planData } = plan;
        if (id) {
          await setDoc(doc(db, 'plans', id), planData, { merge: true });
        } else {
          await addDoc(collection(db, 'plans'), planData);
        }
      }

      // 3. Testimonials
      for (const t of defaultData.testimonials) {
        const { id, ...tData } = t;
        if (id) {
          await setDoc(doc(db, 'testimonials', id), tData, { merge: true });
        } else {
          await addDoc(collection(db, 'testimonials'), tData);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to seed default data:', e);
      return false;
    }
  }
};
