import QueryProvider from "@/providers/QueryProvider";

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
