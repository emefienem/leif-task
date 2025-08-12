import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // other config options
};

// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   // disable: process.env.NODE_ENV === "development",
//   disable: false,
//   buildExcludes: [/middleware-manifest.json$/],
// })(nextConfig);
