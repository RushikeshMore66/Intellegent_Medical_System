import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { 
  Package, 
  AlertTriangle, 
  History, 
  BarChart3, 
  Search,
  Filter,
  ArrowRight
} from "lucide-react";

export default function Inventory() {
    const [stock, setStock] = useState([]);
    const [expiry, setExpiry] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(false);

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const [stockRes, expiryRes, lowRes] = await Promise.all([
                api.get("/inventory/stock-summary"),
                api.get("/inventory/near-expiry"),
                api.get("/inventory/low-stock")
            ]);

            setStock(stockRes.data);
            setExpiry(expiryRes.data);
            setLowStock(lowRes.data);
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const tabs = [
        { id: "all", label: "All Stock", icon: <Package size={16} />, count: stock.length },
        { id: "low", label: "Low Stock", icon: <AlertTriangle size={16} />, count: lowStock.length, color: "text-red-600" },
        { id: "expiry", label: "Near Expiry", icon: <History size={16} />, count: expiry.length, color: "text-amber-600" }
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 mt-1">Monitor stock levels, batch expiries, and replenishment needs.</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id 
                            ? "bg-white text-brand-600 shadow-sm" 
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                        <span className={activeTab === tab.id ? "text-brand-600" : tab.color || "text-slate-400"}>
                            {tab.icon}
                        </span>
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                activeTab === tab.id 
                                ? "bg-brand-100 text-brand-600" 
                                : "bg-slate-200 text-slate-600"
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Inventory View */}
            <Card noPadding className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            {activeTab === "expiry" ? (
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine ID</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : activeTab === "expiry" ? (
                                expiry.length > 0 ? expiry.map((batch) => (
                                    <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{batch.batch_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{batch.medicine_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">{batch.expiry_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900 font-semibold">{batch.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Badge variant="yellow">Near Expiry</Badge>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No batches near expiry.</td>
                                    </tr>
                                )
                            ) : activeTab === "low" ? (
                                lowStock.length > 0 ? lowStock.map((item) => (
                                    <tr key={item.medicine_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{item.medicine_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-red-600">{item.total_quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Badge variant="red">Critical Low</Badge>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">No low stock items.</td>
                                    </tr>
                                )
                            ) : (
                                stock.length > 0 ? stock.map((item) => (
                                    <tr key={item.medicine_id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{item.medicine_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">{item.total_quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {item.total_quantity < 20 ? (
                                                <Badge variant="red">Low Stock</Badge>
                                            ) : (
                                                <Badge variant="green">Healthy</Badge>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">Inventory is empty.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}