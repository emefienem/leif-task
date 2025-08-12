"use client";
import { useEffect } from "react";

export default function Servicing() {
  useEffect(() => {
    console.log("Attempting SW registration");
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => {
          console.log("SW registered:", reg);
        })
        .catch((err) => {
          console.error("SW registration failed:", err);
        });
    } else {
      console.log("SW not supported");
    }
  }, []);

  return null;
}
