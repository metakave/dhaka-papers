"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/queries/useCategories";
import {
  FacebookIcon,
  TwitterIcon,
  YouTubeIcon,
  SearchIcon,
  CloseIcon,
  InstagramIcon,
} from "@/components/common/Icons";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: categories, isLoading, error } = useCategories();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsSticky(window.scrollY > 80);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const renderNavItems = () => {
    if (isLoading)
      return <div className="text-gray-400 text-sm italic">লোড হচ্ছে...</div>;
    if (error) return null;
    if (!categories) return null;

    return (
      <ul className="flex items-center gap-x-12">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/${cat.slug}`}
              className="text-[17px] font-black text-gray-900 hover:text-primary transition-colors tracking-tight whitespace-nowrap uppercase italic"
            >
              {cat.name_bn || cat.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderMenuLinks = () => {
    if (isLoading || error || !categories) return null;

    return categories.map((cat) => (
      <Link
        key={cat.id}
        href={`/${cat.slug}`}
        onClick={() => setIsMenuOpen(false)}
        className="text-2xl md:text-4xl font-black text-gray-900 hover:text-primary transition-all text-left md:text-center italic border-l-4 md:border-l-0 md:border-b-4 border-transparent hover:border-primary pl-4 md:pl-0 pb-1 md:pb-4 truncate md:overflow-visible"
      >
        {cat.name_bn || cat.name}
      </Link>
    ));
  };

  return (
    <>
      <header
        className={`w-full bg-white z-[150] border-b border-gray-100 transition-transform duration-500 fixed top-0 left-0
                ${isSticky ? "md:-translate-y-[100px] shadow-sm" : "translate-y-0"}`}
      >
        {/* Top Red Bar */}
        <div className="w-full h-1 bg-primary"></div>

        <div className="container px-4">
          {/* --- MOBILE HEADER --- */}
          <div className="md:hidden flex items-center h-[56px] relative">
            <div className="w-1/4 flex justify-start">
              <button
                className="p-2 text-3xl"
                onClick={() => setIsMenuOpen(true)}
              >
                <span className="font-bold text-gray-900">☰</span>
              </button>
            </div>
            <div className="w-1/2 flex justify-center">
              <Link href="/">
                <h1 className="text-3xl font-black text-primary tracking-tighter italic">
                  খবর
                </h1>
              </Link>
            </div>
            <div className="w-1/4 flex justify-end">
              <button
                className="text-gray-400 p-2"
                onClick={() => setIsSearchOpen(true)}
              >
                <SearchIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* --- DESKTOP HEADER --- */}
          <div className="hidden md:flex flex-col">
            {/* Branding Row - 100px */}
            <div className="flex items-center justify-between h-[100px]">
              <div className="w-1/3 flex items-center gap-6">
                <Link
                  href="https://www.facebook.com/dhakapapers"
                  target="_blank"
                  className="p-1 text-gray-400 hover:text-primary transition-all"
                >
                  <FacebookIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="https://x.com/dhakapapers"
                  target="_blank"
                  className="p-1 text-gray-400 hover:text-primary transition-all"
                >
                  <TwitterIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="https://www.youtube.com/@dhakapapers"
                  target="_blank"
                  className="p-1 text-gray-400 hover:text-primary transition-all"
                >
                  <YouTubeIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/dhakapapers"
                  target="_blank"
                  className="p-1 text-gray-400 hover:text-primary transition-all"
                >
                  <InstagramIcon className="w-5 h-5" />
                </Link>
              </div>

              <div className="w-1/3 flex justify-center">
                <Link href="/">
                  <h1 className="text-[70px] leading-none font-black text-primary tracking-tighter italic select-none">
                    খবর
                  </h1>
                </Link>
              </div>

              <div className="w-1/3 flex justify-end items-center gap-8 text-gray-400">
                <div className="text-right">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-gray-600">
                    মঙ্গলবার, ২০ জানুয়ারি ২০২৬
                  </p>
                </div>
                <button
                  className="hover:text-primary transition-all"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <SearchIcon className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="flex items-center h-[60px] border-t border-gray-50">
              <nav className="flex items-center justify-center w-full">
                {renderNavItems()}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[56px] md:h-[160px]"></div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[250] flex flex-col p-6 animate-in fade-in slide-in-from-top duration-300">
          <div className="container flex flex-col h-full max-w-5xl mx-auto">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-900 transition-transform hover:scale-110"
              >
                <CloseIcon className="w-10 h-10 md:w-16 md:h-16" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center pb-20">
              <div className="w-full relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="খবর খুঁজুন..."
                  className="w-full text-4xl md:text-7xl font-black bg-transparent border-b-8 border-primary py-8 text-primary focus:outline-none placeholder:text-gray-100 italic tracking-tighter"
                />
                <div className="mt-8 flex items-center justify-between text-gray-400 uppercase tracking-[0.3em] font-black text-xs md:text-sm">
                  <span>টাইপ করে এন্টার চাপুন</span>
                  <span>সার্চ ইঞ্জিন ১.০</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[200] overflow-y-auto animate-in fade-in duration-300">
          <div className="container px-6 py-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-16 border-b border-gray-50 pb-8">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                <h1 className="text-6xl md:text-8xl font-black text-primary italic tracking-tighter">
                  খবর
                </h1>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-900"
              >
                <CloseIcon className="w-12 h-12" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-10 gap-y-6 md:gap-y-16 max-w-7xl mx-auto w-full mb-20 px-4">
              {renderMenuLinks()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
