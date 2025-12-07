import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const initAdmin = () => {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
};

export const getAdminMessaging = () => {
  initAdmin();
  return getMessaging();
};
