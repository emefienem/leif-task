import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

// import { getSession } from "@auth0/nextjs-auth0";
// import prisma from "@/lib/prisma"; // or however you import your DB client

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let session;
  try {
    session = await getSession(req, res);
  } catch (err) {
    console.error("Error getting session:", err);
    return res.status(500).json({ error: "Session retrieval failed" });
  }

  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const auth0Id = session.user.sub!;
  const email = session.user.email!;
  const name = session.user.name ?? session.user.nickname ?? null;

  try {
    const manager = await prisma.user.findFirst({ where: { role: "MANAGER" } });
    const roleToAssign = manager ? "CARE_WORKER" : "MANAGER";

    const user = await prisma.user.upsert({
      where: { auth0Id },
      update: { email, name },
      create: {
        auth0Id,
        email,
        name,
        role: roleToAssign,
        managerId: roleToAssign === "CARE_WORKER" ? manager?.id ?? null : null,
      },
    });

    return res.status(200).json({ ok: true, user });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error upserting user:", error.message);
      return res.status(500).json({ ok: false, error: error.message });
    }
    console.error("Error upserting user:", error);
    return res.status(500).json({ ok: false, error: "Unknown error" });
  }
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const session = await getSession(req, res);
//   if (!session || !session.user) {
//     return res.status(401).json({ error: "Not authenticated" });
//   }

//   const auth0Id = session.user.sub!;
//   const email = session.user.email!;
//   const name = session.user.name ?? session.user.nickname ?? null;

//   try {
//     const manager = await prisma.user.findFirst({ where: { role: "MANAGER" } });
//     const roleToAssign = manager ? "CARE_WORKER" : "MANAGER";

//     const user = await prisma.user.upsert({
//       where: { auth0Id },
//       update: {
//         email,
//         name,
//         // not allowing role update here to prevent accidental changes
//       },
//       create: {
//         auth0Id,
//         email,
//         name,
//         role: roleToAssign,
//         managerId: roleToAssign === "CARE_WORKER" ? manager?.id ?? null : null,
//       },
//     });

//     return res.status(200).json({ ok: true, user });
//   } catch (error) {
//     console.error("Error upserting user:", error);
//     return res.status(500).json({ ok: false, error: "DB error" });
//   }
// }
