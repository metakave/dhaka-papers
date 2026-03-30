'use client';

import Layout from '@/components/layout/Layout';
import Hero from '@/components/sections/Hero';
import NewsGrid from '@/components/sections/NewsGrid';
import { useHomepage } from '@/hooks/queries/useHomepage';
import { toBengaliNumber } from '@/utils/dateUtils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string || "bn";
  const { data, isLoading } = useHomepage(locale);

  // Hero takes Featured + First 5 Latest (3 Side + 2 Secondary)
  // NewsGrid takes the rest of Latest
  const newsGridItems = data?.latest?.slice(5) || [];

  return (
    <Layout>
      <div className="py-2">
        <Hero
          featured={data?.featured || null}
          latest={data?.latest || []}
          isLoading={isLoading}
        />
      </div>

      <div className="my-16 md:my-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-8 xl:col-span-9">
          <div className="flex items-center justify-between border-b-2 border-gray-900 mb-12">
            <h2 className="text-3xl md:text-5xl font-black py-4 inline-block border-b-8 border-primary -mb-[2px] tracking-tighter uppercase italic">
              {locale === "bn" ? "সাম্প্রতিক খবর" : "Recent News"}
            </h2>
          </div>
          <NewsGrid news={newsGridItems} isLoading={isLoading} />
        </div>

        {/* Sidebar - Prothom Alo Styled Trending */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-32 flex flex-col gap-12">
            <div>
              <div className="border-b border-gray-900 mb-8">
                <h3 className="text-2xl font-black pb-2 inline-block border-b-4 border-primary -mb-[1px] tracking-tight">
                  {locale === "bn" ? "সবচেয়ে জনপ্রিয়" : "Most Popular"}
                </h3>
              </div>
              <div className="flex flex-col">
                {isLoading ? (
                  <div className="text-gray-400 italic">লোড হচ্ছে...</div>
                ) : (
                  data?.popular?.map((news, idx) => (
                    <Link key={news.id} href={`/news/${news.slug}`} className="flex gap-6 py-6 border-b border-gray-100 last:border-0 group cursor-pointer items-start">
                      <span className="text-5xl font-black text-gray-400 group-hover:text-primary transition-colors duration-300 leading-none min-w-[40px]">
                        {toBengaliNumber(idx + 1)}
                      </span>
                      <p className="text-lg font-bold leading-tight group-hover:text-primary hover:underline transition-all duration-200">
                        {news.title}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
