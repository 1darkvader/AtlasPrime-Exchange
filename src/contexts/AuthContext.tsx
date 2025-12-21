"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI, type User, type LoginCredentials, type SignupCredentials } from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message?: string; errors?: Record<string, string> }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "atlasprime_token";
const USER_KEY = "atlasprime_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          // Validate token with backend
          const response = await authAPI.getCurrentUser(storedToken);

          if (response.success && response.user) {
            setUser(response.user);
            setToken(storedToken);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);

      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);

        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));

        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.message,
        errors: response.errors,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      const response = await authAPI.signup(credentials);

      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);

        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));

        return { success: true, message: response.message };
      }

      return {
        success: false,
        message: response.message,
        errors: response.errors,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: "An error occurred during registration. Please try again.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await authAPI.updateProfile(user.id, updates);

      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    try {
      const response = await authAPI.getCurrentUser(token);

      if (response.success && response.user) {
        // Check if KYC status changed
        const kycStatusChanged = user && user.kycStatus !== response.user.kycStatus;

        setUser(response.user);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));

        // Log notification if KYC status changed
        if (kycStatusChanged) {
          console.log('✅ KYC Status Updated:', user.kycStatus, '→', response.user.kycStatus);
        }
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  }, [token, user]);

  // Auto-refresh user data every 10 seconds to get KYC status updates
  useEffect(() => {
    if (!token || !user) return;

    // Set up polling interval for real-time status updates
    const intervalId = setInterval(() => {
      refreshUser();
    }, 10000); // 10 seconds - faster updates for KYC approval

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [token, user, refreshUser]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
