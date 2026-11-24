import type { Metadata } from "next";
import { Fredoka, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rosvie Pepito | Frontend Developer",
  description: "Frontend & WordPress Developer building responsive, pixel-perfect websites with React, Next.js, WordPress, and design-to-code workflows. Available for remote work.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`portfolio-document ${jetBrainsMono.variable} ${fredoka.variable} antialiased`}
    >
      <body className="portfolio-body">{children}</body>
    </html>
  );
}