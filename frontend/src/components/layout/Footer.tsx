"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/queries/useCategories";
import { useParams } from "next/navigation";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@/components/common/Icons";

export default function Footer() {
  const { data: categories, isLoading, error } = useCategories();
  const params = useParams();
  const locale = params.locale as string || "bn";

  const renderCategoryLinks = () => {
    if (isLoading)
      return <div className="text-gray-600 text-sm italic">{locale === "bn" ? "লোড হচ্ছে..." : "Loading..."}</div>;
    if (error || !categories) return null;

    return categories.map((cat) => (
      <Link
        key={cat.id}
        href={`/${cat.slug}`}
        className="text-gray-400 hover:text-primary transition-colors text-lg font-bold"
      >
        {locale === "bn" ? (cat.name_bn || cat.name) : (cat.name || cat.name_bn)}
      </Link>
    ));
  };

  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 mt-20 border-t-8 border-primary relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container px-4 relative z-10">
        {/* 1. Header Section: Logo & Brand Description */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="md:w-3/5">
            <Link
              href="/"
              className="inline-block mb-10 transition-transform hover:scale-105 duration-500"
            >
              <Image src={locale === "en" ? "/images/logo-footer-en-v2.png" : "/images/logo-footer-bn-v2.png"} alt={locale === "en" ? "Dhaka Papers" : "ঢাকা পেপারস"} width={500} height={120} className="h-20 w-auto object-contain select-none" priority />
            </Link>
            <p className={`text-gray-300 ${locale === "en" ? "text-lg tracking-wide leading-loose" : "text-xl leading-relaxed"} max-w-2xl font-light`}>
              {locale === "bn" 
                ? "আমরা সংবাদের সত্যতায় বিশ্বাসী। আধুনিক সাংবাদিকতার মাধ্যমে আপনার কাছে পৌঁছাতে চাই প্রতিদিন।" 
                : "We believe in the power of truth and the integrity of journalism. Our mission is to deliver accurate, fast, and unbiased news to our readers every single day."}
            </p>
          </div>
        </div>

        {/* 2. Category Grid Section - High Breathability */}
        <div className="border-t border-gray-800/50 pt-20 mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-12">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className={`text-gray-400 hover:text-primary transition-all duration-300 font-black uppercase ${locale === "en" ? "text-sm tracking-[0.15em]" : "text-lg"}`}
              >
                {locale === "bn" ? (cat.name_bn || cat.name) : (cat.name || cat.name_bn)}
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Social & Apps Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 pt-12 border-t border-gray-800/50 mb-16">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
              {locale === "bn" ? "অনুসরণ করুন" : "CONNECT WITH US"}
            </h4>
            <div className="flex items-center gap-6">
              {[
                { icon: FacebookIcon, href: "https://www.facebook.com/dhakapapers", size: "w-5 h-5" },
                { icon: TwitterIcon, href: "https://x.com/dhakapapers", size: "w-4 h-4" },
                { icon: InstagramIcon, href: "https://www.instagram.com/dhakapapers", size: "w-5 h-5" },
                { icon: YouTubeIcon, href: "https://www.youtube.com/@dhakapapers", size: "w-5 h-5" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all duration-500 transform hover:-translate-y-2 border border-white/5 hover:border-primary/50"
                >
                  <social.icon className={social.size} />
                </Link>
              ))}
            </div>
          </div>

          {/* Helper Links Section */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
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

        {/* 4. Final Bottom Bar: Symmetrical Credits */}
        <div className="pt-12 border-t border-gray-800/30 flex flex-col items-center text-center gap-4">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-80 hover:opacity-100 transition-opacity duration-500">
            © {locale === "bn" ? "২০২৬ ঢাকা পেপারস - ঢাকা, বাংলাদেশ" : "2026 DHAKA PAPERS - GLOBAL NEWS PORTAL"}
          </p>
        </div>
      </div>
    </footer>
  );
}
