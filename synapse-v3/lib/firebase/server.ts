// /lib/firebase/server.ts

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Monta o objeto da service account a partir das variáveis de ambiente separadas
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
  // A chave privada precisa ter as quebras de linha restauradas
  privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Previne a reinicialização da app no ambiente de desenvolvimento (hot reload)
const adminApp = !getApps().length
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApp();

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };