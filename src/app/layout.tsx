import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ClientApolloProvider } from "@/components/ClientApolloComponent";
import AuthClientWrapper from "@/components/AuthClientWrapper";
import Servicing from "@/components/Service";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Lief Clock",
  description:
    "Careworkers can clock in an clock out with an optional note while Managers should set perimetes for clockin and clock out and also see when care workers clock in and out",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lief Clock",
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Lief PWA",
    title: {
      default: "Lief PWA APP",
      template: "%s - Lief PWA App",
    },
    description:
      "Careworkers can clock in an clock out with an optional note while Managers should set perimetes for clockin and clock out and also see when care workers clock in and out",
  },
  // twitter: {
  //   card: "summary",
  //   title: {
  //     default: APP_DEFAULT_TITLE,
  //     template: '%s - Lief PWA App',
  //   },
  //   description: 'Careworkers can clock in an clock out with an optional note while Managers should set perimetes for clockin and clock out and also see when care workers clock in and out',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Servicing />
        <AuthClientWrapper>
          <ClientApolloProvider>{children}</ClientApolloProvider>
        </AuthClientWrapper>
      </body>
    </html>
  );
}
