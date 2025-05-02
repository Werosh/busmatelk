import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, getUserProfile, createUserProfile } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create the authentication context
export const AuthContext = createContext(); // CHANGED: Added 'export' here

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setError(null);

      if (user) {
        try {
          // Get the user profile when user is logged in
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile");
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Register new user with profile creation
  const register = async (email, password, profileData) => {
    try {
      setError(null);
      const { registerUser } = await import("../services/firebase");
      const user = await registerUser(email, password);

      // Create user profile in Firestore
      await createUserProfile(user.uid, {
        email,
        displayName: profileData.displayName || "",
        phoneNumber: profileData.phoneNumber || "",
        ...profileData,
      });

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login existing user
  const login = async (email, password) => {
    try {
      setError(null);
      const { loginUser } = await import("../services/firebase");
      return await loginUser(email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setError(null);
      const { logoutUser } = await import("../services/firebase");
      await logoutUser();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error("No user is logged in");
      }

      await createUserProfile(currentUser.uid, {
        ...userProfile,
        ...data,
        updatedAt: new Date(),
      });

      // Update local state
      setUserProfile((prev) => ({
        ...prev,
        ...data,
      }));

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// You can still keep the default export if needed
export default AuthContext;
