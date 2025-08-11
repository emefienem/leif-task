"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import SyncUserToDb from "./SynUsersToDB";
import { CareAppProvider } from "@/context/CareAppContext";

export default function AuthClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      {/* <CareAppProvider> */}
      <SyncUserToDb />
      {children}
      {/* </CareAppProvider> */}
    </UserProvider>
  );
}
