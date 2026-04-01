import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhaka Papers | Modern News Media",
  description: "Stay updated with the latest news from home and abroad.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
