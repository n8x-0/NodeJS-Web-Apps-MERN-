"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface AuthSession {
  _id: string;
  username: string;
  email: string;
  image: string;
  bio?:string
  // add other fields as needed
}

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  refreshSession: () => void;
}

export const AuthSessionContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch session");
      }
      const data = await res.json();
      setSession(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const refreshSession = () => {
    fetchSession();
  };

  return (
    <AuthSessionContext.Provider value={{ session, loading, refreshSession }}>
      {children}
    </AuthSessionContext.Provider>
  );
}