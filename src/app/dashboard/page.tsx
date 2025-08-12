"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/getUserProtection");
        if (!res.ok) {
          router.replace("/api/auth/login");
          return;
        }
        const data = await res.json();
        const role = data?.user?.role;

        if (role === "MANAGER") {
          router.replace("/manager");
        } else if (role === "CARE_WORKER") {
          router.replace("/care-worker");
        } else {
          router.replace("/unauthorized");
        }
      } catch (err) {
        router.replace("/api/auth/login");
      }
    }
    fetchUser();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <Spin />
    </div>
  );
}
