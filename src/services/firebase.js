// Firebase configuration
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// Your web app's Firebase configuration
// Replace with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyD92Z-0XCYBa6l7ek4KAoCu0aF94dTwJiw",
  authDomain: "busmatelk-d0106.firebaseapp.com",
  projectId: "busmatelk-d0106",
  storageBucket: "busmatelk-d0106.firebasestorage.app",
  messagingSenderId: "576378767226",
  appId: "1:576378767226:web:89eaafbb171ec141dab8c3",
  measurementId: "G-Z4W4ZYKWHM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication helpers
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  return true;
};

// User data helpers
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Route data helpers
export const getRoutes = async () => {
  try {
    const routesSnapshot = await getDocs(collection(db, "routes"));
    return routesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    throw error;
  }
};

export const getRouteById = async (routeId) => {
  try {
    const routeDoc = await getDoc(doc(db, "routes", routeId));
    if (routeDoc.exists()) {
      return { id: routeDoc.id, ...routeDoc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Favorites helpers
export const addFavorite = async (userId, routeId) => {
  try {
    await setDoc(doc(db, "favorites", `${userId}_${routeId}`), {
      userId,
      routeId,
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const removeFavorite = (userId, routeId) =>
  deleteDoc(doc(db, "favorites", `${userId}_${routeId}`)).then(() => true);

export const getUserFavorites = async (userId) => {
  try {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);
    return favoritesSnapshot.docs.map((doc) => doc.data().routeId);
  } catch (error) {
    throw error;
  }
};

// Real-time subscription helper
export const subscribeToRouteUpdates = (routeId, callback) => {
  return onSnapshot(doc(db, "routes", routeId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export { auth, db };
