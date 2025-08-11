import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // only POST (or GET) — we'll accept POST (idempotent upsert)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const managerId = "cme6u5bki000096kezf07hdbp";

  const auth0Id = session.user.sub; // e.g. "auth0|123456"
  const email = session.user.email;
  const name = session.user.name ?? session.user.nickname ?? null;

  if (!auth0Id || !email) {
    return res.status(400).json({ error: "Missing user info" });
  }

  try {
    // this would ensure prisma schema has auth0Id unique
    const user = await prisma.user.upsert({
      where: { auth0Id },
      update: {
        email,
        name,
        managerId,
      },
      create: {
        auth0Id,
        email,
        name,
        role: "CARE_WORKER", // default role for new signups
        managerId,
      },
    });

    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error("/api/users: error upserting user", err);
    return res.status(500).json({ ok: false, error: "DB error" });
  }
}
