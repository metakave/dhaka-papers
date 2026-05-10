import QueryProvider from "@/providers/QueryProvider";
import { Metadata } from 'next';

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
    const { locale } = await params;
    const isBn = locale === 'bn';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dhakapapers.com';
    const enBaseUrl = baseUrl.replace(/^(https?:\/\/)(www\.)?/, '$1en.');
    const siteName = isBn ? 'ঢাকা পেপারস' : 'Dhaka Papers';
    const description = isBn
        ? 'বাংলাদেশ ও বিশ্বের সর্বশেষ খবর, বিশ্লেষণ এবং অনুসন্ধানী প্রতিবেদন।'
        : 'Latest news, analysis and investigative reporting from Bangladesh and around the world.';
    const ogImage = `${baseUrl}/og-default.jpg`;
    return {
        title: { default: siteName, template: `%s | ${siteName}` },
        description,
        metadataBase: new URL(isBn ? baseUrl : enBaseUrl),
        openGraph: {
            siteName,
            description,
            type: 'website',
            locale: isBn ? 'bn_BD' : 'en_US',
            images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@dhakapapers',
            description,
            images: [ogImage],
        },
    };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEnglish = locale === "en";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {locale === "bn" ? (
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        ) : (
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --font-main: ${locale === "bn" ? "'Noto Serif Bengali', serif" : "'Inter', sans-serif"};
            }
            body {
              font-family: var(--font-main);
            }
          `
        }} />
      </head>
      <body suppressHydrationWarning className={isEnglish ? "en-mode" : "bn-mode"}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
