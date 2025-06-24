// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para interactuar con Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB200_9MnOJrrGT3JcabdzYF4ZEgjMjP-A",
  authDomain: "veteprodemo.firebaseapp.com",
  projectId: "veteprodemo",
  storageBucket: "veteprodemo.firebasestorage.app",
  messagingSenderId: "989394402465",
  appId: "1:989394402465:web:6db190bb7d9fa8a7d984e0",
  measurementId: "G-ZBRSQW5KM2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener Firestore
const db = getFirestore(app);

export { db };
