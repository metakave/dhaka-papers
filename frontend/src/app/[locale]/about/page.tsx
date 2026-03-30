"use client";
import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AboutPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";
    const isBn = locale === "bn";
    return (
        <Layout>
            <div className="max-w-[1000px] mx-auto py-12 md:py-24">
                {/* Hero Section */}
                <div className="text-center mb-20 px-4">
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic text-gray-900 leading-none">
                        {isBn ? "ঢাকা পেপারস: সংবাদের " : "Dhaka Papers: A "}<span className="text-primary underline decoration-8 underline-offset-8">{isBn ? "নতুন" : "New"}</span> {isBn ? "যুগ" : "Era of News"}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                        {isBn ? "আমরা কেবল সংবাদ পাঠক নই, আমরা সত্যের অনুসন্ধানকারী।" : "We are not just news readers, we are seekers of truth."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
                    <div className="md:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary"></span>
                                {isBn ? "আমাদের গল্প" : "Our Story"}
                            </h2>
                            <div className="prose prose-lg prose-red text-gray-700 leading-relaxed font-medium space-y-6">
                                <p>
                                    {isBn ? "২০২৬ সালে যাত্রা শুরু করা ঢাকা পেপারস একটি ডিজিটাল-ফার্স্ট সংবাদ মাধ্যম। আমরা এমন এক সময়ে যাত্রা শুরু করেছি যখন সংবাদের বিশ্বাসযোগ্যতা সবচাইতে বেশি জরুরি। আমাদের লক্ষ্য ডিজিটাল প্ল্যাটফর্মে গভীর সাংবাদিকতা এবং দ্রুততম সময়ে সঠিক তথ্য সরবরাহ করা।" : "Starting its journey in 2026, Dhaka Papers is a digital-first news media. We began at a time when news credibility is more important than ever. Our goal is to provide deep journalism on digital platforms and deliver accurate information in the shortest possible time."}
                                </p>
                                <p>
                                    {isBn ? "আমরা বিশ্বাস করি সাংবাদিকতা কেবল তথ্য জানানো নয়, বরং সমাজকে পথ দেখানো। আমাদের প্রতিটি সংবাদের পেছনে থাকে ঘণ্টার পর ঘণ্টা গবেষণা এবং একাধিক স্তরের তথ্য যাচাই।" : "We believe journalism is not just about reporting information, but about leading society. Behind every news story we produce, there are hours of research and multiple levels of fact-checking."}
                                </p>
                            </div>
                        </section>

                        <section className="bg-gray-50 p-10 border-l-8 border-primary shadow-xl rotate-1">
                            <div className="-rotate-1">
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic">{isBn ? "আমাদের অঙ্গীকার" : "Our Commitment"}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-black text-primary text-xl mb-2">{isBn ? "সত্যনিষ্ঠা" : "Integrity"}</h3>
                                        <p className="font-bold text-gray-600">{isBn ? "আমরা কখনো তথ্যের সাথে আপোষ করি না। নিখুঁত সত্যই আমাদের একমাত্র অগ্রাধিকার।" : "We never compromise on information. Pure truth is our only priority."}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-primary text-xl mb-2">{isBn ? "নির্ভীক কণ্ঠ" : "Fearless Voice"}</h3>
                                        <p className="font-bold text-gray-600">{isBn ? "ক্ষমতার দাপটে আমরা দমে যাই না। সাধারণ মানুষের কণ্ঠস্বর হিসেবে আমরা অবিচল।" : "We do not yield to power. We stand firm as the voice of the ordinary people."}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="md:col-span-5 space-y-12">
                        <div className="bg-[#121212] border-t-8 border-primary text-white p-12 rounded-sm shadow-2xl sticky top-32">
                            <h2 className="text-3xl font-black mb-10 border-b border-gray-800 pb-4 tracking-tighter uppercase italic text-primary">{isBn ? "আমাদের প্রভাব" : "Our Impact"}</h2>
                            <div className="space-y-12">
                                <div className="group">
                                    <p className="text-6xl font-black text-white italic group-hover:text-primary transition-colors">{isBn ? "১০০%" : "100%"}</p>
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-300 mt-3 border-l-4 border-primary pl-4">{isBn ? "নিরপেক্ষতা" : "Neutrality"}</p>
                                </div>
                                <div className="group">
                                    <p className="text-6xl font-black text-white italic group-hover:text-primary transition-colors">{isBn ? "২৪/৭" : "24/7"}</p>
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-300 mt-3 border-l-4 border-primary pl-4">{isBn ? "সংবাদ সেবা" : "News Service"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-4 border-gray-100 p-8 rounded-sm">
                            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{isBn ? "আমাদের সাথে থাকুন" : "Stay With Us"}</h3>
                            <p className="text-gray-500 font-bold mb-6">{isBn ? "ফেসবুক, টুইটার এবং ইন্সটাগ্রামে আমাদের ফলো করে সর্বশেষ আপডেটের সাথে যুক্ত থাকুন।" : "Follow us on Facebook, Twitter, and Instagram to stay connected with the latest updates."}</p>
                            <Link href={`/${locale}/contact`} className="inline-block py-4 px-8 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all">
                                {isBn ? "যোগাযোগ করুন" : "Contact Us"}
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* Core Values / Grid Section */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: isBn ? "স্বচ্ছতা" : "Transparency", desc: isBn ? "আমাদের কাজের প্রতিটি পদক্ষেপে আমরা স্বচ্ছতা বজায় রাখি।" : "We maintain transparency in every step of our work." },
                        { title: isBn ? "উদ্ভাবন" : "Innovation", desc: isBn ? "আধুনিক প্রযুক্তির মাধ্যমে সংবাদকে আরও আকর্ষণীয় করি।" : "We make news more attractive through modern technology." },
                        { title: isBn ? "দায়বদ্ধতা" : "Accountability", desc: isBn ? "পাঠকের প্রতি আমাদের দায়বদ্ধতা সবকিছুর ঊর্ধ্বে।" : "Our accountability to the readers is above everything else." }
                    ].map((v, i) => (
                        <div key={i} className="p-10 border-2 border-gray-100 hover:border-primary transition-all duration-500 group">
                            <h3 className="text-4xl font-black mb-4 group-hover:text-primary transition-colors italic tracking-tighter">{v.title}</h3>
                            <p className="text-gray-600 font-bold text-lg leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

