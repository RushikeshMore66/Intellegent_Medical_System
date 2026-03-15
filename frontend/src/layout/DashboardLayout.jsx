import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import Header from "./Header";
import { Pill, X } from "lucide-react";

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Desktop Sidebar */}
            <SidebarMenu />

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white">
                        <div className="bg-brand-500 rounded p-1.5 flex items-center justify-center">
                            <Pill size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PharmaOS</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                {/* Mobile version of the Sidebar Menu links could go here if needed, 
                    but SidebarMenu itself is currently hidden on mobile. 
                    For a quick fix, let's allow SidebarMenu to show on mobile when menu is open. */}
                <div className="flex-1 overflow-y-auto px-4 py-6">
                   <SidebarMenu isMobile />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 md:pl-64 transition-all duration-200 ease-in-out">
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}