import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import AddMedicineModal from "../components/AddMedicineModal";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Pill, Plus, Search, Trash2, Edit2, Filter } from "lucide-react";

export default function Medicines() {
    const [medicines, setMedicines] = useState([]);
    const [search, setSearch] = useState("");
    const [deferredSearch, setDeferredSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDeferredSearch(search);
            setOffset(0); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchMedicines = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `/medicines?search=${deferredSearch}&limit=${limit}&offset=${offset}`
            );
            setMedicines(res.data.data);
            setTotal(res.data.total);
        } catch (err) {
            console.error("Failed to fetch medicines", err);
        } finally {
            setLoading(false);
        }
    }, [deferredSearch, limit, offset]);

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                await api.delete(`/medicines/${id}`);
                fetchMedicines();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Medicines</h1>
                    <p className="text-slate-500 mt-1">Manage your pharmacy's medicine master list.</p>
                </div>
                <Button 
                    onClick={() => setShowModal(true)} 
                    icon={<Plus size={18} />}
                >
                    Add Medicine
                </Button>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Search by name or category..."
                            icon={Search}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="secondary" size="sm" icon={<Filter size={16} />}>
                            Filters
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Manufacturer</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">GST %</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Selling Price</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : medicines.length > 0 ? (
                                medicines.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                                                    <Pill size={16} />
                                                </div>
                                                <span className="font-medium text-slate-900">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {m.manufacturer}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="blue">{m.gst_percentage}%</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                            ₹{m.selling_price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(m.id)}
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
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        No medicines found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {total > limit && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} entries
                        </span>
                        <Pagination
                            total={total}
                            limit={limit}
                            offset={offset}
                            onPageChange={setOffset}
                        />
                    </div>
                )}
            </Card>

            {showModal && (
                <AddMedicineModal
                    close={() => setShowModal(false)}
                    refresh={fetchMedicines}
                />
            )}
        </div>
    );
}