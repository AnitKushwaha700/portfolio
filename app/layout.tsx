import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background text-gray-100">
        <main className="flex-1 w-full relative">{children}</main>
      </body>
    </html>
  );
}
