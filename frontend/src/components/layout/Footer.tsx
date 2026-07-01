"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Footer() {
  const params = useParams();
  const locale = params.locale as string || "bn";

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 mt-20 border-t-8 border-primary relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container px-4 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          {/* 1. Header Section: Logo & Brand Description */}
          <div className="flex flex-col justify-between items-start mb-16">
            <div className="w-full">
              <Link
                href="/"
                className="inline-block mb-10 transition-transform hover:scale-105 duration-500"
              >
                <Image src={locale === "en" ? "/images/logo-footer-en-v2.png" : "/images/logo-footer-bn-v2.png"} alt={locale === "en" ? "Dhaka Papers" : "ঢাকা পেপারস"} width={500} height={120} className="h-20 w-auto object-contain select-none" priority />
              </Link>
              <p className={`text-gray-300 ${locale === "en" ? "text-sm tracking-wide leading-loose" : "text-base leading-relaxed"} max-w-none font-light`}>
                {locale === "bn" 
                  ? "আমরা সংবাদের সত্যতায় বিশ্বাসী। আধুনিক সাংবাদিকতার মাধ্যমে আপনার কাছে পৌঁছাতে চাই প্রতিদিন।" 
                  : "We believe in the power of truth and the integrity of journalism. Our mission is to deliver accurate, fast, and unbiased news to our readers every single day."}
              </p>

              {/* Category Links Row */}
              <div className="mt-12 pt-8 border-t border-gray-800/30">
                <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-between items-center gap-6 lg:gap-4 w-full">
                  {[
                    { href: "/politics", label_bn: "রাজনীতি", label_en: "Politics" },
                    { href: "/economics", label_bn: "অর্থনীতি", label_en: "Economics" },
                    { href: "/science", label_bn: "বিজ্ঞান", label_en: "Science" },
                    { href: "/news-briefs", label_bn: "সংবাদ সংক্ষেপ", label_en: "News Brief" },
                    { href: "/international", label_bn: "আন্তর্জাতিক", label_en: "International" },
                    { href: "/investigation", label_bn: "অনুসন্ধান", label_en: "Investigation" },
                    { href: "/literature-lifestyle", label_bn: "সাহিত্য ও জীবনযাপন", label_en: "Literature & Lifestyle" },
                    { href: "/opinion", label_bn: "মতামত", label_en: "Opinions" },
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className={`text-gray-400 hover:text-primary transition-all duration-300 font-bold hover:scale-105 select-none text-center whitespace-nowrap ${
                        locale === "en" ? "text-xs uppercase tracking-wider" : "text-sm"
                      }`}
                    >
                      {locale === "bn" ? link.label_bn : link.label_en}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Helper Links Section */}
          <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 pt-12 border-t border-gray-800/50 mb-16">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              {[
                { href: "/about", label_bn: "আমাদের সম্পর্কে", label_en: "ABOUT" },
                { href: "/contact", label_bn: "যোগাযোগ", label_en: "CONTACT" },
                { href: "/privacy", label_bn: "গোপনীয়তা নীতি", label_en: "PRIVACY" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-gray-500 hover:text-primary transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  {locale === "bn" ? link.label_bn : link.label_en}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Final Bottom Bar: Symmetrical Credits */}
          <div className="pt-12 border-t border-gray-800/30 flex flex-col items-center text-center gap-4">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-80 hover:opacity-100 transition-opacity duration-500">
              © {locale === "bn" ? "২০২৬ ঢাকা পেপারস - ঢাকা, বাংলাদেশ" : "2026 DHAKA PAPERS - GLOBAL NEWS PORTAL"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

