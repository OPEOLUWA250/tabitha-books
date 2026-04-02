import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tabitha Books | Curated Books for the Mindful Reader",
  description:
    "Discover stories that transform, inspire, and empower. Leadership, fiction, and lifestyle books—carefully selected for your journey.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tabitha Books",
  },
  applicationName: "Tabitha Books",
  keywords: [
    "books",
    "reading",
    "leadership",
    "fiction",
    "personal-development",
    "lifestyle",
  ],
  creator: "Tabitha Books",
  publisher: "Tabitha Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
