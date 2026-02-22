import { notFound } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';

async function getReport(slug: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/special-reports/${slug}`, {
        next: { revalidate: 60 } // Cache for 1 minute
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function SpecialReportPage({ params }: { params: { slug: string } }) {
    const report = await getReport(params.slug);

    if (!report) {
        notFound();
    }

    return (
        <main className="special-report-container bg-black text-white min-h-screen overflow-x-hidden">
            {/* Custom Styles for the Interactive Experience */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .sr-hero {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 100%);
                    padding: 2rem;
                }
                .sr-title {
                    font-size: 5rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.05em;
                    margin-bottom: 1rem;
                    background: linear-gradient(to bottom, #ffffff 50%, #666666 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .sr-item {
                    min-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 4rem 2rem;
                    position: relative;
                    border-bottom: 1px solid #333;
                }
                .sr-item-content {
                    max-width: 900px;
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                }
                .sr-item-image {
                    position: relative;
                    aspect-ratio: 4/5;
                    border: 2px solid white;
                    box-shadow: 0 0 30px rgba(255,255,255,0.1);
                    transform: rotate(-2deg);
                    transition: transform 0.5s ease;
                }
                .sr-item-image:hover {
                    transform: rotate(0deg) scale(1.05);
                }
                .sr-item-details {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .sr-item-date {
                    font-family: monospace;
                    color: #ff3333;
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                }
                .sr-item-name {
                    font-size: 3rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    line-height: 1.1;
                }
                .sr-item-text {
                    color: #cccccc;
                    line-height: 1.6;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                }
                .sr-item-qr {
                    width: 80px;
                    height: 80px;
                    background: white;
                    padding: 5px;
                }
                .scroll-hint {
                    position: absolute;
                    bottom: 2rem;
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
                @media (max-width: 768px) {
                    .sr-item-content { grid-template-columns: 1fr; gap: 2rem; }
                    .sr-title { font-size: 3rem; }
                }
            `}} />

            <section className="sr-hero">
                <h1 className="sr-title">{report.title}</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    {report.description || "A solemn investigative series into extrajudicial killings."}
                </p>
                <div className="scroll-hint">
                    <p className="text-sm font-mono tracking-widest text-gray-500 mb-2">SCROLL TO WITNESS</p>
                    <div className="w-px h-12 bg-gray-500 mx-auto"></div>
                </div>
            </section>

            {report.items && report.items.map((item: any, idx: number) => (
                <section key={item.id} className="sr-item" id={`item-${idx + 1}`}>
                    <div className="sr-item-content">
                        <div className="sr-item-image">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-700">NO IMAGE</div>
                            )}
                        </div>
                        <div className="sr-item-details">
                            <div className="sr-item-date">{item.date_str}</div>
                            <h2 className="sr-item-name">{item.title}</h2>
                            <div className="sr-item-text">
                                {item.details}
                            </div>
                            <div className="flex items-center gap-6">
                                {item.qr_code_url && (
                                    <div className="sr-item-qr">
                                        <Image src={item.qr_code_url} alt="QR Code" width={70} height={70} />
                                    </div>
                                )}
                                {item.news_url && (
                                    <a
                                        href={item.news_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
                                    >
                                        READ SOURCE NEWS
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            <footer className="py-20 text-center border-t border-gray-900">
                <p className="text-gray-600 font-mono text-xs tracking-tighter">
                    Dhakapapers Special Investigative Report &copy; {new Date().getFullYear()}
                </p>
            </footer>
        </main>
    );
}
