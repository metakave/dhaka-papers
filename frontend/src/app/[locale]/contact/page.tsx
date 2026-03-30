"use client";
import Layout from '@/components/layout/Layout';
import { useParams } from 'next/navigation';

export default function ContactPage() {
    const params = useParams();
    const locale = params.locale as string || "bn";
    const isBn = locale === "bn";
    return (
        <Layout>
            <div className="max-w-[850px] mx-auto py-12 md:py-20">
                <h1 className="text-5xl md:text-6xl font-black mb-12 tracking-tighter border-b-8 border-primary pb-4 inline-block italic">
                    {isBn ? "যোগাযোগ" : "Contact"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                    <div className="space-y-10">
                        <div className="bg-gray-50 p-8 border-l-8 border-primary shadow-sm">
                            <address className="not-italic text-lg text-gray-700 leading-relaxed font-bold">
                                {isBn ? "ঢাকা পেপারস" : "Dhaka Papers"}<br />
                                {isBn ? "হাউজ ৭৭ (লেভেল-১), রোড ৯, ব্লক – সি, নিকেতন," : "House 77 (Level-1), Road 9, Block - C, Niketan,"}<br />
                                {isBn ? "গুলশান-১, ঢাকা - ১২১২, বাংলাদেশ" : "Gulshan-1, Dhaka - 1212, Bangladesh"}
                            </address>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-widest mb-2">{isBn ? "ইমেইল" : "Email"}</h3>
                                <p className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-1">info@dhakapapers.com</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-widest mb-2">{isBn ? "ফোন" : "Phone"}</h3>
                                <p className="text-xl font-bold text-gray-900 border-b-2 border-gray-100 pb-1">{isBn ? "+৮৮০২ ৪৮৮-১৫০২১" : "+8802 488-15021"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-900 p-8 md:p-10 shadow-[20px_20px_0px_#D92128]">
                        <h2 className="text-3xl font-black mb-8 tracking-tighter italic">{isBn ? "আমাদের বার্তা পাঠান" : "Send Us a Message"}</h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">{isBn ? "আপনার নাম" : "Your Name"}</label>
                                <input type="text" className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent" placeholder={isBn ? "আপনার নাম লিখুন" : "Enter your name"} />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">{isBn ? "আপনার ইমেইল" : "Your Email"}</label>
                                <input type="email" className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent" placeholder="example@mail.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-black uppercase tracking-widest mb-2 text-gray-500">{isBn ? "বার্তা" : "Message"}</label>
                                <textarea rows={4} className="w-full border-b-4 border-gray-100 focus:border-primary outline-none py-3 text-lg font-bold transition-colors bg-transparent resize-none" placeholder={isBn ? "আপনার বার্তাটি এখানে লিখুন..." : "Write your message here..."}></textarea>
                            </div>
                            <button className="w-full py-5 bg-gray-900 text-white font-black uppercase tracking-[0.3em] hover:bg-primary transition-all duration-300 shadow-xl">
                                {isBn ? "বার্তা পাঠান" : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
