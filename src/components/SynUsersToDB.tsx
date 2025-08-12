"use client";
import React, { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function SyncUserToDb() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    // const key = `user-synced-${user.sub}`;
    // if (localStorage.getItem(key)) return;

    (async () => {
      try {
        const res = await fetch("/api/users", { method: "POST" });
        if (res.ok) {
          // localStorage.setItem(key, "1");
          console.log("User synced to DB");
        } else {
          console.warn("User sync failed", await res.text());
        }
      } catch (err) {
        console.error("User sync error", err);
      }
    })();
  }, [user, isLoading]);

  return null;
}
