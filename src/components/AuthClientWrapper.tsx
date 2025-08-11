"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import SyncUserToDb from "./SynUsersToDB";

export default function AuthClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SyncUserToDb />
      {children}
    </UserProvider>
  );
}
