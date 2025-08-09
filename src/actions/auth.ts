"use server";

import { redirect } from "next/navigation";

export async function login() {
  redirect("/auth/login");
}

export async function signup() {
  redirect("/auth/login?screen_hint=signup");
}

export async function logout() {
  redirect("/auth/logout");
}
