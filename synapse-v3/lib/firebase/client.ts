// /lib/firebase/client.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// As suas variáveis de ambiente do arquivo .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase, mas previne a reinicialização se já existir uma instância.
// Isso é importante para o funcionamento correto com o Next.js (Hot Reload).
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta a instância do serviço de autenticação para ser usada em outros arquivos.
const auth = getAuth(app);

export { app, auth };