"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { User } from "../../generated/prisma";
import { logout } from "@/actions/auth";

type LocationSettings = {
  latitude: number;
  longitude: number;
  radius: number;
};

type CareAppContextType = {
  user?: User; // you can type this more specifically from Auth0 user type
  isLoading: boolean;
  authError: Error | undefined;
  currentlyClockedIn: boolean;
  setCurrentlyClockedIn: React.Dispatch<React.SetStateAction<boolean>>;
  locationSettings: LocationSettings;
  setLocationSettings: React.Dispatch<React.SetStateAction<LocationSettings>>;
  logout: () => void;
};

const CareAppContext = createContext<CareAppContextType | undefined>(undefined);

// const auth0user = await getSession
export const CareAppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const { user: auth0User, error: authError, isLoading } = useUser();

  useEffect(() => {
    if (!auth0User) {
      setUser(undefined);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(undefined);
      }
    };

    fetchUser();
  }, [auth0User]);

  const [currentlyClockedIn, setCurrentlyClockedIn] = useState(false);

  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    latitude: 6.5244,
    longitude: 3.3792,
    radius: 2,
  });

  useEffect(() => {
    const savedStatus = localStorage.getItem("currentlyClockedIn");
    if (savedStatus !== null) {
      setCurrentlyClockedIn(savedStatus === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentlyClockedIn", String(currentlyClockedIn));
  }, [currentlyClockedIn]);

  return (
    <CareAppContext.Provider
      value={{
        user,
        isLoading,
        authError,
        currentlyClockedIn,
        setCurrentlyClockedIn,
        locationSettings,
        setLocationSettings,
        logout: logout,
      }}
    >
      {children}
    </CareAppContext.Provider>
  );
};

export const useCareApp = () => {
  const context = useContext(CareAppContext);
  if (!context) {
    throw new Error("useCareApp must be used within a CareAppProvider");
  }
  return context;
};
