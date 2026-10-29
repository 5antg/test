/**
 * Configuración oficial de Firebase para Sogamoso POT Digital
 * Proyecto: sogamoso-pot-digital
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDQrzyLP6FFVh_hJfRIbgXIcGO-aM_Txi0",
  authDomain: "sogamoso-pot-digital.firebaseapp.com",
  projectId: "sogamoso-pot-digital",
  storageBucket: "sogamoso-pot-digital.firebasestorage.app",
  messagingSenderId: "809030366998",
  appId: "1:809030366998:web:da5a7912e0fc79169b0237"
};

// Inicializar servicios
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
};
