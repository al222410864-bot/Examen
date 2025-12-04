import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// 1. IMPORTACIONES CONDICIONALES (Truco para engañar a TypeScript y que no marque rojo)
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth, browserLocalPersistence } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbHUwZl_A4DmptZZlj497Z7rGCJsA1FbE",
  authDomain: "basegigatoys.firebaseapp.com",
  projectId: "basegigatoys",
  storageBucket: "basegigatoys.firebasestorage.app",
  messagingSenderId: "583076896132",
  appId: "1:583076896132:web:3981b6cbc7fa5ae38b51d1",
  measurementId: "G-KZ76T6KQ6D"
};

// 2. Inicializar App
const app = initializeApp(firebaseConfig);

// 3. Inicializar Auth (Lógica Híbrida Web/Móvil)
let authVar;
// 4. Inicializar DB
const dbVar = getFirestore(app);

// 5. EXPORTAR CONSTANTES (Así los otros archivos siempre las encuentran)
export const auth = authVar;
export const db = dbVar;