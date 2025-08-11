import { getSession } from "@auth0/nextjs-auth0";
import { prisma } from "../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export async function createContext({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const session = await getSession(req, res);

  if (!session || typeof session === "undefined") return {};

  const { user: auth0User, accessToken } = session;

  let user = null;
  if (auth0User?.sub) {
    user = await prisma.user.findUnique({
      where: { auth0Id: auth0User.sub },
      select: {
        id: true,
        auth0Id: true,
        email: true,
        name: true,
        role: true,
        managerId: true,
      },
    });

    if (!user) {
      console.warn(`User with auth0Id ${auth0User.sub} not found in database`);
    }
  }

  return {
    user,
    auth0User,
    accessToken,
  };
}
