import { handleLogin } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handleLogin(req, res, {
      authorizationParams: {
        prompt: "login", // to help me force the login screen every time
      },
    });
  } catch (error: any) {
    res.status(error.status || 500).end(error.message);
  }
}
