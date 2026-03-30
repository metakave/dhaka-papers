import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReportContent from './ReportContent';

async function getReport(slug: string) {
    const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${API_URL}/special-reports/${slug}`, {
        next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function SpecialReportPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const report = await getReport(slug);

    if (!report) {
        notFound();
    }

    return (
        <main className="bg-[#0a0a0a] text-[#f3f4f6] min-h-screen selection:bg-red-600 selection:text-white font-main overflow-x-hidden">
            <Header />

            {/* Dramatic Hero Section */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-[72px]">
                {/* Red radial glow background */}
                <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(127,0,0,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(80,0,0,0.12) 0%, transparent 60%)' }} />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* Bottom fade to content */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/30 to-[#0a0a0a] z-0" />

                <div className="z-10 max-w-5xl mx-auto flex flex-col items-center">
                    <p className="text-red-600 font-mono tracking-[0.3em] uppercase text-sm md:text-base mb-6 
                                  border border-red-900/50 bg-red-950/20 px-4 py-2 rounded-full">
                        Dhakapapers Special Investigation
                    </p>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white
                                   [text-wrap:balance] mb-8">
                        {report.title}
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-400 max-w-3xl font-light leading-relaxed [text-wrap:balance]">
                        {report.description || "A solemn investigative series into extrajudicial killings."}
                    </p>
                </div>

                {/* Animated Scroll Indicator */}
                <div className="absolute bottom-12 flex flex-col items-center animate-bounce z-10">
                    <span className="text-xs font-mono tracking-widest text-gray-500 mb-4 uppercase">Scroll to explore</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-red-600 to-transparent"></div>
                </div>
            </section>

            {/* Integrated Investigative Content (Stage + Viz + Grid) */}
            <ReportContent items={report.items || []} />

            <Footer />
        </main>
    );
}
