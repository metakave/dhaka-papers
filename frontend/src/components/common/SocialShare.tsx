'use client';

import React, { useState } from 'react';
import { FacebookIcon, TwitterIcon, WhatsAppIcon, LinkIcon, CheckIcon } from '@/components/common/Icons';

interface SocialShareProps {
    title: string;
    url?: string;
}

import { useParams } from 'next/navigation';

export default function SocialShare({ title, url }: SocialShareProps) {
    const params = useParams();
    const locale = (params?.locale as string) || 'bn';
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const sharePlatforms = [
        {
            name: 'Facebook',
            icon: <FacebookIcon className="w-5 h-5" />,
            color: 'bg-[#1877F2]',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            title: locale === 'en' ? 'Share on Facebook' : 'Facebook-এ শেয়ার করুন'
        },
        {
            name: 'Twitter',
            icon: <TwitterIcon className="w-4 h-4" />,
            color: 'bg-[#000000]',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
            title: locale === 'en' ? 'Share on Twitter' : 'Twitter-এ শেয়ার করুন'
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon className="w-5 h-5" />,
            color: 'bg-[#25D366]',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
            title: locale === 'en' ? 'Share on WhatsApp' : 'WhatsApp-এ শেয়ার করুন'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const labels = {
        share: locale === 'en' ? 'Share:' : 'শেয়ার করুন:',
        copy: locale === 'en' ? 'Copy Link' : 'লিঙ্ক কপি করুন',
        copied: locale === 'en' ? 'Link Copied' : 'লিঙ্ক কপি হয়েছে'
    };


    return (
        <div className="flex flex-wrap items-center gap-4 py-8 border-y border-gray-100 my-8">
            <span className="text-sm font-black uppercase tracking-widest text-gray-500 mr-2">{labels.share}</span>

            <div className="flex items-center gap-3">
                {sharePlatforms.map((platform) => (
                    <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platform.color} text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg shadow-gray-200 flex items-center justify-center`}
                        title={platform.title}
                    >
                        {platform.icon}
                    </a>
                ))}

                <button
                    onClick={copyToClipboard}
                    className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-gray-200 ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    title={copied ? labels.copied : labels.copy}
                >
                    {copied ? <CheckIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
