import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-blue-600 text-white flex flex-col">

            <div className="p-6 text-2xl font-bold border-b border-blue-500">
                PharmaOS
            </div>

            <nav className="flex flex-col p-4 space-y-3">

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

            </nav>
        </div>
    );
}