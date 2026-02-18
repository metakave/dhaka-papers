import Layout from '@/components/layout/Layout';

export default function PrivacyPage() {
    return (
        <Layout>
            <div className="max-w-[800px] mx-auto py-12 md:py-24 px-4">
                {/* Header */}
                <div className="mb-20 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic mb-6">
                        গোপনীয়তা <span className="text-primary italic">নীতি</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-bold uppercase tracking-[0.2em] border-l-8 border-primary pl-6">
                        আপনার তথ্যের সুরক্ষা আমাদের অগ্রাধিকার।
                    </p>
                </div>

                <div className="space-y-16">
                    <section>
                        <h2 className="text-3xl font-black mb-6 text-gray-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary"></span>
                            ১. ভূমিকা
                        </h2>
                        <div className="prose prose-lg text-gray-700 leading-relaxed font-medium space-y-6">
                            <p>
                                ঢাকা পেপারস (dhakapapers.com) এ আমরা আপনার গোপনীয়তাকে গুরুত্ব সহকারে বিবেচনা করি। এই নীতিমালায় আমরা ব্যাখ্যা করছি কীভাবে আপনার তথ্য সংগ্রহ করা হয় এবং কেন তা সুরক্ষিত রাখা হয়।
                            </p>
                            <p>
                                আমাদের সেবা ব্যবহারের মাধ্যমে আপনি এই গোপনীয়তা নীতির শর্তাবলীতে সম্মতি প্রদান করছেন। আমরা সংগৃহীত কোনো তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না।
                            </p>
                        </div>
                    </section>

                    <section className="bg-gray-50 p-10 border-l-8 border-primary shadow-sm">
                        <h2 className="text-3xl font-black mb-6 text-gray-900 uppercase italic tracking-tight">
                            ২. সংগৃহীত তথ্য
                        </h2>
                        <ul className="space-y-4 text-gray-700 font-bold">
                            <li className="flex items-start gap-3">
                                <span className="text-primary text-xl">●</span>
                                সরাসরি আপনার দেওয়া তথ্য (যেমন: নাম, ইমেইল ঠিকানা)।
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary text-xl">●</span>
                                স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য (যেমন: আইপি অ্যাড্রেস, ব্রাউজার টাইপ)।
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary text-xl">●</span>
                                কুকিজ এবং লোকাল স্টোরেজ ডাটা।
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-3xl font-black mb-6 text-gray-900 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary"></span>
                            ৩. তথ্যের ব্যবহার
                        </h2>
                        <div className="prose prose-lg text-gray-700 leading-relaxed font-medium space-y-6">
                            <p>
                                আমরা প্রধানত নিম্নলিখিত উদ্দেশ্যে আপনার তথ্য ব্যবহার করি:
                            </p>
                            <ul className="list-disc pl-8 space-y-3">
                                <li>আমাদের সংবাদ সেবা এবং কন্টেন্ট উন্নত করতে।</li>
                                <li>আপনার পছন্দের খবর এবং ক্যাটাগরি অনুযায়ী কাস্টমাইজড নিউজ ফিড দিতে।</li>
                                <li>প্রযুক্তিগত সমস্যা সমাধান এবং সিকিউরিটি নিশ্চিত করতে।</li>
                            </ul>
                        </div>
                    </section>

                    <section className="border-t-4 border-gray-100 pt-16">
                        <h2 className="text-3xl font-black mb-6 text-gray-900">
                            ৪. তথ্যের নিরাপত্তা
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed font-medium mb-8">
                            আমরা সর্বোচ্চ পর্যায়ের এনক্রিপশন এবং সিকিউরিটি প্রোটোকল ব্যবহার করি যাতে আপনার ব্যক্তিগত তথ্য চুরি বা অপব্যবহার না হয়। আমাদের ডাটাবেস নিয়মিত অডিট করা হয়।
                        </p>
                        <div className="bg-[#121212] p-8 text-white rounded-sm">
                            <h3 className="text-xl font-black mb-4 uppercase text-primary">যোগাযোগ</h3>
                            <p className="text-gray-400 font-bold">
                                আপনার যদি এই নীতি সম্পর্কে কোনো প্রশ্ন থাকে, তবে সরাসরি আমাদের সাথে যোগাযোগ করুন:
                                <span className="block mt-2 text-white italic underline">privacy@dhakapapers.com</span>
                            </p>
                        </div>
                    </section>

                    <div className="text-center pt-16 border-t border-gray-100">
                        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
                            সর্বশেষ আপডেট: ২০ জানুয়ারি ২০২৬
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
