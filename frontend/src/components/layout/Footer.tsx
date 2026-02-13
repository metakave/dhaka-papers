"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/queries/useCategories";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
} from "@/components/common/Icons";

export default function Footer() {
  const { data: categories, isLoading, error } = useCategories();

  const renderCategoryLinks = () => {
    if (isLoading)
      return <div className="text-gray-600 text-sm italic">লোড হচ্ছে...</div>;
    if (error || !categories) return null;

    return categories.map((cat) => (
      <Link
        key={cat.id}
        href={`/${cat.slug}`}
        className="text-gray-400 hover:text-primary transition-colors text-lg font-bold"
      >
        {cat.name_bn || cat.name}
      </Link>
    ));
  };

  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-12 mt-20 border-t-8 border-primary">
      <div className="container px-4">
        {/* 1. Header Section: Logo & Brand Description */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
          <div className="md:w-1/2">
            <Link
              href="/"
              className="inline-block mb-6 transition-transform hover:scale-105 duration-300"
            >
              <h2 className="text-6xl md:text-8xl font-black text-primary italic tracking-tighter select-none leading-none">
                খবর
              </h2>
            </Link>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
              আমরা সংবাদের সত্যতায় বিশ্বাসী। আধুনিক সাংবাদিকতার মাধ্যমে আপনার
              কাছে পৌঁছাতে চাই প্রতিদিন।
            </p>
          </div>
        </div>

        {/* 2. Category Grid Section - High Breathability */}
        <div className="border-t border-gray-900 pt-16 mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6 gap-x-8">
            {renderCategoryLinks()}
          </div>
        </div>

        {/* 3. Social & Apps Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10 border-t border-gray-900 mb-12">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
              অনুসরণ করুন
            </h4>
            <div className="flex items-center gap-5">
              <Link
                href="https://www.facebook.com/dhakapapers"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <FacebookIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://x.com/dhakapapers"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <TwitterIcon className="w-4 h-4" />
              </Link>
              <Link
                href="https://www.instagram.com/dhakapapers"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@dhakapapers"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full text-gray-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
              >
                <YouTubeIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Helper Links Section */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Link
              href="/about"
              className="text-gray-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest"
            >
              যোগাযোগ
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-primary transition-colors text-sm font-black uppercase tracking-widest"
            >
              গোপনীয়তা নীতি
            </Link>
          </div>
        </div>

        {/* 4. Final Bottom Bar: Symmetrical Credits */}
        <div className="pt-10 border-t border-gray-900 flex flex-col items-center text-center gap-3">
          <p className="text-gray-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em]">
            © ২০২৬ খবর লিমিটেড - ঢাকা, বাংলাদেশ
          </p>
        </div>
      </div>
    </footer>
  );
}
