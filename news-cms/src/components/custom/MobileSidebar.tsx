'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Newspaper, Layers, Users, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const sidebarItems = [
    { title: 'Overview', href: '/', icon: LayoutDashboard },
    { title: 'News', href: '/news', icon: Newspaper },
    { title: 'সংবাদ সংক্ষেপ', href: '/briefs', icon: BookOpen },
    { title: 'Categories', href: '/categories', icon: Layers },
    { title: 'Users', href: '/users', icon: Users },
];

export function MobileSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-gray-900 text-white border-r-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tight mb-8 text-white">News CMS</h1>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
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
            </SheetContent>
        </Sheet>
    );
}
