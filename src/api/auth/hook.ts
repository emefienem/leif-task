// src/api/auth/hook.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, message: "Method not allowed" });
    }

    const { id: auth0Id, email, name, secret } = req.body ?? {};

    console.log("[/api/auth/hook] incoming payload:", { auth0Id, email, name });

    // secret protection — must match VERCEL env var AUTH0_HOOK_SECRET
    if (!secret || secret !== process.env.AUTH0_SECRET) {
      console.warn("[/api/auth/hook] invalid secret");
      return res.status(403).json({ ok: false, message: "Invalid secret" });
    }

    if (!auth0Id || !email) {
      console.warn("[/api/auth/hook] missing fields", { auth0Id, email });
      return res
        .status(400)
        .json({ ok: false, message: "Missing id or email" });
    }

    // Use upsert to avoid race / duplicate errors. auth0Id is unique in your schema.
    const user = await prisma.user.upsert({
      where: { auth0Id },
      update: {
        email,
        name: name || null,
      },
      create: {
        auth0Id,
        email,
        name: name || null,
        role: "CARE_WORKER", // default role
      },
    });

    console.log("[/api/auth/hook] upserted user id:", user.id);

    return res.status(200).json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("[/api/auth/hook] error:", err);
    return res.status(500).json({ ok: false, error: (err as Error).message });
  }
}
