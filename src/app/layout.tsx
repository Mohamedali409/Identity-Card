import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Ali — Full-Stack Developer | Digital Identity Card",
  description:
    "Interactive 3D Digital Business Card for Mohamed Ali — Full-Stack & Backend Developer (Node.js). Verified credentials, technical architecture, and tailored CV downloads.",
  authors: [{ name: "Mohamed Ali", url: "https://github.com/Mohamedali409" }],
  keywords: [
    "Mohamed Ali",
    "Full-Stack Developer",
    "Backend Developer",
    "Node.js Developer",
    "Software Engineer",
    "Digital Business Card",
    "Cairo Egypt Developer",
    "React",
    "Next.js",
    "DevOps",
  ],
  openGraph: {
    title: "Mohamed Ali — Interactive Developer Digital Identity Card",
    description:
      "Full-Stack & Backend Developer (Node.js). Scan or tap to view verified credentials, 3D digital card, and role-tailored CV downloads.",
    url: "https://github.com/Mohamedali409",
    siteName: "Mohamed Ali — Digital Identity",
    images: [
      {
        url: "/assets/avatar-mohamed.svg",
        width: 800,
        height: 600,
        alt: "Mohamed Ali — Developer Digital Identity",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  icons: {
    icon: "/assets/avatar-mohamed.svg",
    apple: "/assets/avatar-mohamed.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#04070D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-cyber-darkest text-slate-100 antialiased selection:bg-cyber-cyan selection:text-cyber-darkest`}
      >
        {children}
      </body>
    </html>
  );
}
