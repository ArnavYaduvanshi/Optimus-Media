"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
    LogOutIcon,
    MenuIcon,
    LayoutDashboardIcon,
    Share2Icon,
    UploadIcon,
    ImageIcon,
} from "lucide-react";

const sidebarItems = [
    { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
    { href: "/social-share", icon: Share2Icon, label: "Social Share" },
    { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleLogoClick = () => {
        router.push("/");
    };

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] flex">
            {/* Sidebar */}
            <aside className={`bg-[#2a2a2a] w-64 min-h-screen flex flex-col border-r border-gray-700 fixed left-0 top-0 bottom-0 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Logo Section */}
                <div className="flex items-center justify-start px-6 py-6 border-b border-gray-700">
                    <ImageIcon className="w-8 h-8 text-blue-500 mr-3" />
                    <span className="text-lg font-bold text-white">Optimus Media</span>
                </div>
                
                {/* Navigation */}
                <nav className="flex-grow px-3 py-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        pathname === item.href
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Fixed Header */}
                <header className="bg-[#2a2a2a] border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-white hover:bg-gray-700 p-2 rounded-lg"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <Link href="/" onClick={handleLogoClick}>
                            <div className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
                                Optimus Media
                            </div>
                        </Link>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {user && (
                            <>
                                <div className="avatar">
                                    <div className="w-8 h-8 rounded-full">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.username || user.emailAddresses[0].emailAddress}
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>
                                <span className="text-sm text-gray-300 truncate max-w-xs lg:max-w-md">
                                    {user.username || user.emailAddresses[0].emailAddress}
                                </span>
                                <button
                                    className="text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
                                    onClick={handleSignOut}
                                >
                                    <LogOutIcon className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-[#1a1a1a] overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}