// import { prisma } from "@/lib/prisma";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { auth0 } from "@/lib/auth0";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await auth0.getSession();

//   if (!session || !session.user. || !session.user.email) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized: No valid session or user email" });
//   }
//   const auth0Id = session.user.sub;
//   const { email, secret } = req.body;
//   //   const MANAGER_ID = "fixed-manager-id";

//   if (req.method !== "POST") {
//     return res.status(403).json({ message: "Method not allowed" });
//   }
//   if (secret !== process.env.AUTH0_SECRET) {
//     return res.status(403).json({ message: `You must provide the secret` });
//   }
//   if (email) {
//     await prisma.user.create({
//       data: {
//         id: auth0Id,
//         email: session.user.email!,
//         name: session.user.name || null,
//         role: "CARE_WORKER",
//         // managerId: MANAGER_ID,
//       },
//     });
//     return res.status(200).json({
//       message: `User with email: ${email} has been created successfully!`,
//     });
//   }
// };

// export default handler;

import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// src/api/auth/hook.ts
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== "POST") {
      // Still respond with 200, just log it
      console.warn("Invalid method");
      return res.status(200).json({ message: "Ignored: Invalid method" });
    }

    const { id, email, name, secret } = req.body;

    if (secret !== process.env.AUTH0_SECRET) {
      console.warn("Invalid secret");
      return res.status(200).json({ message: "Ignored: Invalid secret" });
    }

    if (!id || !email) {
      console.warn("Missing required fields");
      return res.status(200).json({ message: "Ignored: Missing fields" });
    }

    await prisma.user.create({
      data: { id, email, name: name || null, role: "CARE_WORKER" },
    });

    return res.status(200).json({ message: "User created" });
  } catch (error) {
    if ((error as any).code === "P2002") {
      // Prisma unique constraint — user already exists
      return res.status(200).json({ message: "User already exists" });
    }
    console.error("Unexpected error", error);
    return res.status(200).json({ message: "Ignored: Internal error" });
  }
};

export default handler;
