import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { auth0 } from "@/lib/auth0";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth0.getSession();

  if (!session || !session.user || !session.user.email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No valid session or user email" });
  }
  const auth0Id = session.user.sub;
  const { email, secret } = req.body;
  //   const MANAGER_ID = "fixed-manager-id";

  if (req.method !== "POST") {
    return res.status(403).json({ message: "Method not allowed" });
  }
  if (secret !== process.env.AUTH0_SECRET) {
    return res.status(403).json({ message: `You must provide the secret` });
  }
  if (email) {
    await prisma.user.create({
      data: {
        id: auth0Id,
        email: session.user.email!,
        name: session.user.name || null,
        role: "CARE_WORKER",
        // managerId: MANAGER_ID,
      },
    });
    return res.status(200).json({
      message: `User with email: ${email} has been created successfully!`,
    });
  }
};

export default handler;
