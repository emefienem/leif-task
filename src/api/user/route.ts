// import { prisma } from "@/lib/prisma";
// import type { NextApiRequest, NextApiResponse } from "next";
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { auth0Id, name, email } = req.body;

//     if (!auth0Id || !email) {
//       return new Response(JSON.stringify({ error: "Missing fields" }), {
//         status: 400,
//       });
//     }

//     const user = await prisma.user.upsert({
//       where: { auth0Id },
//       update: {},
//       create: {
//         auth0Id,
//         name,
//         email,
//         role: "CARE_WORKER",
//       },
//     });

//     return new Response(JSON.stringify(user), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   }
// }

import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "../../../generated/prisma";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("Auth hook called with method:", req.method);
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  try {
    if (req.method !== "POST") {
      console.warn("Invalid method:", req.method);
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { id, email, name, secret } = req.body;

    // Validate secret
    if (!secret || secret !== process.env.AUTH0_SECRET) {
      console.warn("Invalid or missing secret");
      return res.status(401).json({ message: "Unauthorized: Invalid secret" });
    }

    // Validate required fields
    if (!id || !email) {
      console.warn("Missing required fields - id:", !!id, "email:", !!email);
      return res.status(400).json({
        message: "Bad request: Missing required fields (id, email)",
      });
    }

    console.log("Attempting to create user with auth0Id:", id);

    // Try to create the user
    const newUser = await prisma.user.create({
      data: {
        auth0Id: id,
        email,
        name: name || null,
        role: "CARE_WORKER",
      },
    });

    console.log("Successfully created user:", newUser.id);
    return res.status(201).json({
      message: "User created successfully",
      userId: newUser.id,
    });
  } catch (e) {
    console.error("Database error:", e);

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violations
      if (e.code === "P2002") {
        console.log("User already exists, returning success");
        return res.status(200).json({
          message: "User already exists",
        });
      }
    }

    // For any other error, return 500 but still allow Auth0 flow to continue
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
