import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";

export default function SidebarMenu() {
    const [user, setUser] = useState(null);

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

    return (
        <div className="w-64 h-screen bg-blue-600 text-white flex flex-col">

            <div className="p-6 text-2xl font-bold border-b border-blue-500">
                PharmaOS
            </div>

            <nav className="flex flex-col p-4 space-y-3 flex-1 overflow-y-auto">

                <Link to="/dashboard" className="hover:bg-blue-500 p-2 rounded">
                    Dashboard
                </Link>

                <Link to="/medicines" className="hover:bg-blue-500 p-2 rounded">
                    Medicines
                </Link>

                <Link to="/inventory" className="hover:bg-blue-500 p-2 rounded">
                    Inventory
                </Link>

                <Link to="/billing" className="hover:bg-blue-500 p-2 rounded">
                    Billing
                </Link>

                <Link to="/suppliers" className="hover:bg-blue-500 p-2 rounded">
                    Suppliers
                </Link>

                <Link to="/purchases" className="hover:bg-blue-500 p-2 rounded">
                    Purchases
                </Link>

                <Link to="/reports" className="hover:bg-blue-500 p-2 rounded">
                    Reports
                </Link>

                {user?.role === "admin" && (
                    <Link to="/users" className="hover:bg-blue-500 p-2 rounded bg-blue-700">
                        Users
                    </Link>
                )}

            </nav>
            {user && (
                <div className="p-4 border-t border-blue-500 text-sm">
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-blue-200 capitalize">{user.role}</p>
                </div>
            )}
        </div>
    );
}