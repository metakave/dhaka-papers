"use client";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || "bn";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUrlForLocale = (locale: string) => {
    if (typeof window === "undefined") return "#";

    const host = window.location.host;
    const protocol = window.location.protocol;
    
    // Check if we are on a production-like domain or localhost
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes(".local");
    const baseDomain = isLocal ? host.replace(/^(en\.|www\.)/, "") : "dhakapapers.com";

    let newHost = host;
    if (locale === "en") {
      newHost = isLocal ? `en.${baseDomain}` : "en.dhakapapers.com";
    } else {
      newHost = isLocal ? baseDomain : "www.dhakapapers.com";
    }

    // Default to home page for language switching to ensure valid landing
    return `${protocol}//${newHost}/`;
  };

  const handleSwitch = (e: React.MouseEvent, locale: string) => {
    e.preventDefault();
    if (locale === currentLocale) return;
    
    const url = getUrlForLocale(locale);
    if (url && url !== "#") {
      window.location.href = url;
    }
  };

  return (
    <div className="flex items-center bg-gray-100/50 rounded-full p-1 border border-gray-200 shadow-inner">
      <a
        href={mounted ? getUrlForLocale("bn") : "#"}
        onClick={(e) => handleSwitch(e, "bn")}
        className={`px-2 md:px-4 py-1 md:py-1.5 text-[10px] md:text-xs font-black rounded-full transition-all duration-300 tracking-widest uppercase flex items-center justify-center ${
          currentLocale === "bn"
            ? "bg-primary text-white shadow-md scale-105"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
        }`}
      >
        বাংলা
      </a>
      <a
        href={mounted ? getUrlForLocale("en") : "#"}
        onClick={(e) => handleSwitch(e, "en")}
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
