import { handleLogout } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handleLogout(req, res, {
    returnTo: process.env.AUTH0_BASE_URL, // redirect after logout
    // logoutParams: {
    //   federated: true, // ths would clear Auth0 SSO session too
    // },
  });
}
