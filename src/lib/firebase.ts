import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

// Read config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyBFKrrv46_LBYHAHCb-QtDDDAk1AmSUxcA",
  authDomain: "basic-zepplin-vzp2g.firebaseapp.com",
  projectId: "basic-zepplin-vzp2g",
  storageBucket: "basic-zepplin-vzp2g.firebasestorage.app",
  messagingSenderId: "987841960824",
  appId: "1:987841960824:web:4795f0c168c6c51459868d",
};

const customDatabaseId = "ai-studio-remixsmkislamcip-961bb8cb-be19-4b85-b96e-6f35497f34c2";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db = customDatabaseId
  ? getFirestore(app, customDatabaseId)
  : getFirestore(app);

// Generic Firestore Helper Functions for Database & File/Document Storage
export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: T[] = [];
    querySnapshot.forEach((docSnapshot) => {
      items.push({ id: docSnapshot.id, ...docSnapshot.data() } as unknown as T);
    });
    return items;
  } catch (error) {
    console.warn(`Firestore fetch failed for collection ${collectionName}:`, error);
    return [];
  }
}

export async function saveDocument<T extends Record<string, any>>(
  collectionName: string,
  docData: T,
  customId?: string
): Promise<string> {
  try {
    const docId = customId || docData.id || String(Date.now());
    const docRef = doc(db, collectionName, String(docId));
    await setDoc(docRef, { ...docData, id: docId }, { merge: true });
    return String(docId);
  } catch (error) {
    console.error(`Error saving document to ${collectionName}:`, error);
    throw error;
  }
}

export async function removeDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

export function subscribeCollection<T>(
  collectionName: string,
  callback: (data: T[]) => void
) {
  try {
    const q = collection(db, collectionName);
    return onSnapshot(
      q,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnapshot) => {
          items.push({ id: docSnapshot.id, ...docSnapshot.data() } as unknown as T);
        });
        callback(items);
      },
      (error) => {
        console.warn(`Realtime snapshot subscription error for ${collectionName}:`, error);
      }
    );
  } catch (err) {
    console.warn(`Failed to set up listener for ${collectionName}:`, err);
    return () => {};
  }
}
