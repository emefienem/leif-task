"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareWorkerDashboard from "@/components/CareWorkerDashboard";
import { Spin } from "antd";

export default function CareWorkerPage() {
  const [mainUser, setMainUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/getUserProtection")
      .then((res) => {
        if (res.status === 401 || res.status === 404) {
          router.replace("/api/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          if (data.user.role !== "CARE_WORKER") {
            router.replace("/unauthorized");
          } else {
            setMainUser(data.user);
          }
        }
      })
      .catch(() => router.replace("/api/auth/login"));
  }, [router]);

  if (!mainUser)
    return (
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Spin />
      </div>
    );

  return <CareWorkerDashboard mainUser={mainUser} />;
}
