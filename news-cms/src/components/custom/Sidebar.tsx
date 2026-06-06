'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Newspaper, Layers, Users, FileText, BookOpen } from 'lucide-react';

const sidebarItems = [
    { title: 'Overview', href: '/', icon: LayoutDashboard },
    { title: 'News', href: '/news', icon: Newspaper },
    { title: 'সংবাদ সংক্ষেপ', href: '/briefs', icon: BookOpen },
    { title: 'Categories', href: '/categories', icon: Layers },
    { title: 'Special Reports', href: '/special-reports', icon: FileText },
    { title: 'Users', href: '/users', icon: Users },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex h-full w-64 flex-col justify-between border-r bg-gray-900 text-white">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight mb-8 text-white">News CMS</h1>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-800",
                                pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
