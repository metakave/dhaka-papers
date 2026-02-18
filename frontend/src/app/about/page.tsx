import Layout from '@/components/layout/Layout';

export default function AboutPage() {
    return (
        <Layout>
            <div className="max-w-[1000px] mx-auto py-12 md:py-24">
                {/* Hero Section */}
                <div className="text-center mb-20 px-4">
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter italic text-gray-900 leading-none">
                        ঢাকা পেপারস: সংবাদের <span className="text-primary underline decoration-8 underline-offset-8">নতুন</span> যুগ
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto">
                        আমরা কেবল সংবাদ পাঠক নই, আমরা সত্যের অনুসন্ধানকারী।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
                    <div className="md:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary"></span>
                                আমাদের গল্প
                            </h2>
                            <div className="prose prose-lg prose-red text-gray-700 leading-relaxed font-medium space-y-6">
                                <p>
                                    ২০২৬ সালে যাত্রা শুরু করা ঢাকা পেপারস একটি ডিজিটাল-ফার্স্ট সংবাদ মাধ্যম। আমরা এমন এক সময়ে যাত্রা শুরু করেছি যখন সংবাদের বিশ্বাসযোগ্যতা সবচাইতে বেশি জরুরি। আমাদের লক্ষ্য ডিজিটাল প্ল্যাটফর্মে গভীর সাংবাদিকতা এবং দ্রুততম সময়ে সঠিক তথ্য সরবরাহ করা।
                                </p>
                                <p>
                                    আমরা বিশ্বাস করি সাংবাদিকতা কেবল তথ্য জানানো নয়, বরং সমাজকে পথ দেখানো। আমাদের প্রতিটি সংবাদের পেছনে থাকে ঘণ্টার পর ঘণ্টা গবেষণা এবং একাধিক স্তরের তথ্য যাচাই।
                                </p>
                            </div>
                        </section>

                        <section className="bg-gray-50 p-10 border-l-8 border-primary shadow-xl rotate-1">
                            <div className="-rotate-1">
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tight italic">আমাদের অঙ্গীকার</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-black text-primary text-xl mb-2">সত্যনিষ্ঠা</h3>
                                        <p className="font-bold text-gray-600">আমরা কখনো তথ্যের সাথে আপোষ করি না। নিখুঁত সত্যই আমাদের একমাত্র অগ্রাধিকার।</p>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-primary text-xl mb-2">নির্ভীক কণ্ঠ</h3>
                                        <p className="font-bold text-gray-600">ক্ষমতার দাপটে আমরা দমে যাই না। সাধারণ মানুষের কণ্ঠস্বর হিসেবে আমরা অবিচল।</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="md:col-span-5 space-y-12">
                        <div className="bg-[#121212] border-t-8 border-primary text-white p-12 rounded-sm shadow-2xl sticky top-32">
                            <h2 className="text-3xl font-black mb-10 border-b border-gray-800 pb-4 tracking-tighter uppercase italic text-primary">আমাদের প্রভাব</h2>
                            <div className="space-y-12">
                                <div className="group">
                                    <p className="text-6xl font-black text-white italic group-hover:text-primary transition-colors">১০০%</p>
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-300 mt-3 border-l-4 border-primary pl-4">নিরপেক্ষতা</p>
                                </div>
                                <div className="group">
                                    <p className="text-6xl font-black text-white italic group-hover:text-primary transition-colors">২৪/৭</p>
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-300 mt-3 border-l-4 border-primary pl-4">সংবাদ সেবা</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-4 border-gray-100 p-8 rounded-sm">
                            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">আমাদের সাথে থাকুন</h3>
                            <p className="text-gray-500 font-bold mb-6">ফেসবুক, টুইটার এবং ইন্সটাগ্রামে আমাদের ফলো করে সর্বশেষ আপডেটের সাথে যুক্ত থাকুন।</p>
                            <Link href="/contact" className="inline-block py-4 px-8 bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all">
                                যোগাযোগ করুন
                            </Link>
                        </div>
                    </aside>
                </div>

                {/* Core Values / Grid Section */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "স্বচ্ছতা", desc: "আমাদের কাজের প্রতিটি পদক্ষেপে আমরা স্বচ্ছতা বজায় রাখি।" },
                        { title: "উদ্ভাবন", desc: "আধুনিক প্রযুক্তির মাধ্যমে সংবাদকে আরও আকর্ষণীয় করি।" },
                        { title: "দায়বদ্ধতা", desc: "পাঠকের প্রতি আমাদের দায়বদ্ধতা সবকিছুর ঊর্ধ্বে।" }
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

import Link from 'next/link';
