"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string || "bn";

  // Function to get the URL for a specific locale (subdomain-based)
  const getUrlForLocale = (locale: string) => {
    if (typeof window === "undefined") return "#";
    
    const host = window.location.host;
    const protocol = window.location.protocol;
    let pathnameWithoutLocale = pathname?.replace(/^\/(en|bn)/, "") || "/";
    if (pathnameWithoutLocale.startsWith("/news/") || pathnameWithoutLocale.startsWith("/tag/")) {
      pathnameWithoutLocale = "/";
    }
    
    let newHost = host;
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");

    if (locale === "en") {
      if (!host.startsWith("en.")) {
        const cleanHost = host.replace(/^www\./i, "");
        newHost = `en.${cleanHost}`;
      }
    } else {
      // Bengali - root domain
      if (host.startsWith("en.")) {
        const cleanHost = host.replace(/^en\./i, "");
        newHost = isLocal ? cleanHost : `www.${cleanHost}`;
      }
    }

    return `${protocol}//${newHost}${pathnameWithoutLocale}`;
  };

  return (
    <div className="flex items-center bg-gray-100/50 rounded-full p-1 border border-gray-200 shadow-inner">
      <a
        href={getUrlForLocale("bn")}
        className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-black rounded-full transition-all duration-300 tracking-widest uppercase flex items-center justify-center ${
          currentLocale === "bn"
            ? "bg-primary text-white shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
        }`}
      >
        বাংলা
      </a>
      <a
        href={getUrlForLocale("en")}
        className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-black rounded-full transition-all duration-300 tracking-widest uppercase flex items-center justify-center ${
          currentLocale === "en"
            ? "bg-primary text-white shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
        }`}
      >
        EN
      </a>
    </div>
  );
}
