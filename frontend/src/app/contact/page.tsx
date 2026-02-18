import Layout from '@/components/layout/Layout';

export default function ContactPage() {
    return (
        <Layout>
            <div className="max-w-[850px] mx-auto py-12 md:py-20">
                <h1 className="text-5xl md:text-6xl font-black mb-12 tracking-tighter border-b-8 border-primary pb-4 inline-block italic">
                    যোগাযোগ
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    <div className="space-y-10">
                        <div className="bg-gray-50 p-8 border-l-8 border-primary shadow-sm">
                            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">প্রধান কার্যালয়</h2>
                            <address className="not-italic text-lg text-gray-700 leading-relaxed font-bold">
                                ঢাকা পেপারস লিমিটেড<br />
                                ১২/এ, কারওয়ান বাজার<br />
                                ঢাকা - ১২১৫, বাংলাদেশ
                            </address>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-widest mb-2">ইমেইল</h3>
                                <p className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-1">info@dhakapapers.com</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-widest mb-2">ফোন</h3>
                                <p className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-1">০১৭৩৬-১২৩৯০২</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-900 p-8 md:p-10 shadow-[20px_20px_0px_#D92128]">
                        <h2 className="text-3xl font-black mb-8 tracking-tighter italic">আমাদের বার্তা পাঠান</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">আপনার নাম</label>
                                <input type="text" className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent" placeholder="আপনার নাম লিখুন" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">আপনার ইমেইল</label>
                                <input type="email" className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent" placeholder="example@mail.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">বার্তা</label>
                                <textarea rows={4} className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent resize-none" placeholder="আপনার বার্তাটি এখানে লিখুন..."></textarea>
                            </div>
                            <button className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.3em] hover:bg-primary transition-all duration-300 shadow-xl">
                                বার্তা পাঠান
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
