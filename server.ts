import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

// Fallback to .env.example if values are missing
try {
  if (fs.existsSync('.env.example')) {
    const exampleConfig = dotenv.parse(fs.readFileSync('.env.example'));
    for (const k in exampleConfig) {
      if (!process.env[k]) {
        process.env[k] = exampleConfig[k];
      }
    }
  }
} catch (e) {
  console.warn("Could not load fallback from .env.example", e);
}

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore using the client SDK so it uses the API key and properly routes via security rules
const firestore = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Remove the old minimal admin init since we are using client sdk now.

// Test Firestore connection on startup
(async () => {
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const testDoc = await getDoc(doc(firestore, 'config', 'site'));
    console.log("Initial Firestore connection test:", testDoc.exists() ? "Success (doc found)" : "Success (doc not found)");
  } catch (e: any) {
    console.error("CRITICAL: Initial Firestore connection failed:", e.message);
  }
})();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Hector Hosting API" });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
