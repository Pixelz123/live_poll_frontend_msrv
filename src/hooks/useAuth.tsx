'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

// Matches the server's AuthResponceDTO
interface User {
  username: string;
  token: string;
}

// Matches the server's UserDTO
interface UserCredentials {
    username: string;
    password: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for cookie management
const setAuthCookie = (data: User) => {
    // This function will only run on the client side
    if (typeof window === 'undefined') return;
    const cookieValue = JSON.stringify(data);
    // Set cookie to expire in 7 days
    document.cookie = `quizwhiz_auth=${encodeURIComponent(cookieValue)}; path=/; max-age=604800; SameSite=Lax`;
};

const getAuthCookie = (): User | null => {
    // This function will only run on the client side
    if (typeof window === 'undefined') return null;
    const cookie = document.cookie.split('; ').find(row => row.startsWith('quizwhiz_auth='));
    if (!cookie) return null;

    try {
        const value = cookie.split('=')[1];
        if (!value) return null;
        return JSON.parse(decodeURIComponent(value));
    } catch (e) {
        return null;
    }
};

const removeAuthCookie = () => {
    // This function will only run on the client side
    if (typeof window === 'undefined') return;
    document.cookie = 'quizwhiz_auth=; path=/; max-age=0; SameSite=Lax';
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = getAuthCookie();
    if (storedUser) {
        setUser(storedUser);
    }
  }, []);

  const handleAuthSuccess = useCallback((userData: User) => {
    setAuthCookie(userData);
    setUser(userData);
    router.push('/');
    toast({
        title: `Welcome, ${userData.username}!`,
        description: "You've successfully logged in.",
    });
  }, [router, toast]);

  const login = async (credentials: UserCredentials) => {
    try {
      // NOTE: Replace with your actual backend login endpoint
      const response = await fetch('http://localhost:8851/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed. Please check your credentials.'}));
        throw new Error(errorData.message || 'Login failed.');
      }

      const userData: User = await response.json();
      handleAuthSuccess(userData);
    } catch (error) {
       console.error("Login error:", error);
       throw error; // Re-throw to be caught in the form component
    }
  };

  const register = async (credentials: UserCredentials) => {
    try {
       // NOTE: Replace with your actual backend registration endpoint
      const response = await fetch('http://localhost:8851/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

       if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed. The username may already be taken.'}));
        throw new Error(errorData.message || 'Registration failed.');
      }
      
      const userData: User = await response.json();
      handleAuthSuccess(userData);
    } catch (error) {
       console.error("Registration error:", error);
       throw error; // Re-throw to be caught in the form component
    }
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
