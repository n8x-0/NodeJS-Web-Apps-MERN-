"use client";

import { getSession } from "@/utils/getSession";
import { createContext, useEffect, useState } from "react";

type UserSession = { _id: string; username: string; email: string; image: string; error?: string };
interface SessionPrv {
  userSession: UserSession | undefined;
  getUserSession: () => Promise<void>;
}

export const sessionCont = createContext<SessionPrv | undefined>(undefined);

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setSession] = useState<UserSession | undefined>(undefined);

  const getUserSession = async () => {
    console.log("calling session");
    try {
      const session = await getSession();
      if (session.error) {
        setSession(undefined);
      } else {
        setSession(session);
      }
    } catch (error) {
      console.error("Error fetching session", error);
      setSession(undefined);
    }
  };

  useEffect(() => {
    getUserSession();
  }, []);

  const sessionMethods: SessionPrv = {
    userSession,
    getUserSession,
  };
  
  return (
    <sessionCont.Provider value={sessionMethods}>
      {children}
    </sessionCont.Provider>
  );
};

export default SessionProvider;