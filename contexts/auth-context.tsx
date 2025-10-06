"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type AuthState,
  signIn,
  signOut,
  getCurrentUser,
  createUserAccount,
} from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (
    email: string,
    password: string,
    name: string,
    role: "hr" | "manager" | "employee"
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await signIn(email, password);
      localStorage.setItem("currentUser", JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await signOut();
      localStorage.removeItem("currentUser");

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const createUser = async (
    email: string,
    password: string,
    name: string,
    role: "hr" | "manager" | "employee"
  ) => {
    if (!state.user) {
      throw new Error("Must be logged in to create users");
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await createUserAccount(email, password, name, role, state.user);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
