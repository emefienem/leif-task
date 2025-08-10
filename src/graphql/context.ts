// import { auth0 } from "@/lib/auth0";
// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma";
// export async function createContext({
//   req,
//   res,
// }: {
//   req: NextApiRequest;
//   res: NextApiResponse;
// }) {
//   const session = await auth0.getSession(req);

//   if (!session || typeof session === "undefined") return {};

//   const {
//     user,
//     tokenSet: { accessToken },
//   } = session;

//   const dbUser = await prisma.user.findUnique({
//     where: { auth0Id: user.sub }, // user.sub === event.user.user_id
//   });

//   return {
//     user: dbUser,
//     accessToken,
//   };
// }

import { auth0 } from "@/lib/auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  let session = null;
  try {
    session = await auth0.getSession(req);
  } catch (err) {
    console.error("createContext getSession error:", err);
    session = null;
  }

  if (!session || !session.user) return {};

  const auth0Id = session.user.sub;
  const dbUser = await prisma.user.findUnique({
    where: { auth0Id },
  });

  return {
    user: dbUser,
    accessToken: session.tokenSet?.accessToken ?? null,
  };
}
