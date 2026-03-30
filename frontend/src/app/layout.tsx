import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ঢাকা পেপারস | আধুনিক সংবাদ মাধ্যম",
  description: "দেশ-বিদেশের সর্বশেষ সংবাদ নিয়ে সব সময় আপনার পাশে।",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
