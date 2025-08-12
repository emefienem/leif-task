import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // Here you can query prisma if you want role from DB as well
  const user = await prisma.user.findUnique({
    where: { auth0Id: session.user.sub },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.status(200).json({ user });
}
