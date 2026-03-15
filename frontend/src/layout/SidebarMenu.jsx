import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import {
  LayoutDashboard,
  Pill,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  BarChart,
  Users,
} from "lucide-react";

export default function SidebarMenu({ isMobile = false }) {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (err) {
                console.error("Failed to fetch user in sidebar", err);
            }
        };
        fetchUser();
    }, []);

    const navItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/medicines", icon: Pill, label: "Medicines" },
        { path: "/inventory", icon: Package, label: "Inventory" },
        { path: "/billing", icon: ShoppingCart, label: "Billing POS" },
        { path: "/suppliers", icon: Truck, label: "Suppliers" },
        { path: "/purchases", icon: FileText, label: "Purchases" },
        { path: "/reports", icon: BarChart, label: "Reports" },
    ];

    if (user?.role === "admin") {
        navItems.push({ path: "/users", icon: Users, label: "Users" });
    }

    return (
        <aside className={`${isMobile ? "flex w-full ring-0 border-0" : "fixed inset-y-0 left-0 w-64 z-20 hidden md:flex border-r border-slate-800"} bg-slate-900 text-slate-300 flex flex-col`}>
            {!isMobile && (
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-white">
                        <div className="bg-brand-500 rounded p-1.5 flex items-center justify-center">
                            <Pill size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">PharmaOS</span>
                    </div>
                </div>
            )}


            <div className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                                    isActive
                                        ? "bg-brand-600/10 text-brand-400 font-medium"
                                        : "hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <item.icon 
                                    size={18} 
                                    className={`${isActive ? "text-brand-500" : "text-slate-400 group-hover:text-slate-300"}`} 
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}