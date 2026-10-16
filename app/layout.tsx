import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/pwa/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anit Kushwaha | Software Developer",
  },
  title: "Anit Kushwaha | Software Developer",
  description:
    "Software Developer specializing in React.js, Next.js, Node.js, TypeScript, and full-stack web development.",
  keywords: [
    "Anit Kushwaha",
    "Software Developer",
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Full-Stack Developer",
    "Web Developer",
  ],
  authors: [{ name: "Anit Kushwaha" }],
  openGraph: {
    type: "website",
    title: "Anit Kushwaha | Software Developer",
    description:
      "Software Developer specializing in React.js, Next.js, Node.js, TypeScript, and full-stack web development.",
    siteName: "Anit Kushwaha Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anit Kushwaha | Software Developer",
    description:
      "Software Developer specializing in React.js, Next.js, Node.js, TypeScript, and full-stack web development.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-gray-100">
        <main className="flex-1 w-full relative">{children}</main>
        <InstallPrompt />
      </body>
    </html>
  );
}
