import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import AddSupplierModal from "../components/AddSupplierModal";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Truck, Plus, Search, Trash2, Edit2, Phone, Clipboard } from "lucide-react";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [deferredSearch, setDeferredSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDeferredSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/suppliers?search=${deferredSearch}&limit=50&offset=0`);
            setSuppliers(res.data.data);
        } catch (err) {
            console.error("Failed to fetch suppliers", err);
        } finally {
            setLoading(false);
        }
    }, [deferredSearch]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const deleteSupplier = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
                    <p className="text-slate-500 mt-1">Manage your medical supply partners.</p>
                </div>
                <Button 
                    onClick={() => setShowModal(true)} 
                    icon={<Plus size={18} />}
                >
                    Add Supplier
                </Button>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Search suppliers..."
                            icon={Search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Details</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Number</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : suppliers.length > 0 ? (
                                suppliers.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                                                    <Truck size={18} />
                                                </div>
                                                <span className="font-medium text-slate-900">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <Phone size={14} className="text-slate-400" />
                                                {s.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Clipboard size={14} className="text-slate-400" />
                                                <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-medium">
                                                    {s.gst_number || "N/A"}
                                                </code>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteSupplier(s.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        No suppliers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {showModal && (
                <AddSupplierModal
                    close={() => setShowModal(false)}
                    refresh={fetchSuppliers}
                />
            )}
        </div>
    );
}