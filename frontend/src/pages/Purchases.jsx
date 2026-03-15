import { useState, useEffect } from "react";
import api from "../api/client";
import { toast } from "react-toastify";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Package, 
  Truck, 
  Calendar, 
  CreditCard,
  Hash,
  ArrowRight
} from "lucide-react";

export default function Purchases() {
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [supplierId, setSupplierId] = useState("");
    const [items, setItems] = useState([]);

    const [medicineId, setMedicineId] = useState("");
    const [batch, setBatch] = useState("");
    const [expiry, setExpiry] = useState("");
    const [qty, setQty] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const s = await api.get("/suppliers?limit=100&offset=0");
            const m = await api.get("/medicines?limit=100&offset=0");
            setSuppliers(s.data.data);
            setMedicines(m.data.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    const addItem = () => {
        if (!medicineId || !batch || !qty || !purchasePrice) {
            toast.error("Please fill required item details");
            return;
        }

        const med = medicines.find(m => m.id === medicineId);
        
        setItems([
            ...items,
            {
                medicine_id: medicineId,
                medicine_name: med ? med.name : "Unknown",
                batch_number: batch,
                expiry_date: expiry,
                quantity: Number(qty),
                purchase_price: Number(purchasePrice),
                selling_price: Number(sellingPrice)
            }
        ]);

        // Reset item fields
        setMedicineId("");
        setBatch("");
        setExpiry("");
        setQty("");
        setPurchasePrice("");
        setSellingPrice("");
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const createPurchase = async () => {
        if (!supplierId) {
            toast.error("Please select a supplier");
            return;
        }
        if (items.length === 0) {
            toast.error("Add at least one item to purchase");
            return;
        }

        setLoading(true);
        try {
            await api.post("/purchases", {
                supplier_id: supplierId,
                items: items
            });
            toast.success("Purchase recorded successfully");
            setItems([]);
            setSupplierId("");
        } catch (err) {
            toast.error("Failed to record purchase");
        } finally {
            setLoading(false);
        }
    };

    const totalCost = items.reduce((sum, item) => sum + (item.purchase_price * item.quantity), 0);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Purchase Entry</h1>
                <p className="text-slate-500 mt-1">Record new stock arrivals from suppliers.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Entry Form */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    <Card>
                        <CardHeader title="General Info" icon={<Truck size={20} />} />
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Select Supplier</label>
                            <select
                                className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                                value={supplierId}
                                onChange={(e) => setSupplierId(e.target.value)}
                            >
                                <option value="">Search for supplier...</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader title="Add Medicine" icon={<Plus size={20} />} />
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Medicine</label>
                                <select
                                    className="w-full h-11 px-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm"
                                    value={medicineId}
                                    onChange={(e) => setMedicineId(e.target.value)}
                                >
                                    <option value="">Select medicine...</option>
                                    {medicines.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Batch Number"
                                    placeholder="BN-123"
                                    icon={Hash}
                                    value={batch}
                                    onChange={(e) => setBatch(e.target.value)}
                                />
                                <Input
                                    label="Expiry Date"
                                    type="date"
                                    icon={Calendar}
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="Quantity"
                                    type="number"
                                    placeholder="0"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                />
                                <Input
                                    label="Purchase Price"
                                    type="number"
                                    placeholder="0.00"
                                    value={purchasePrice}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                />
                                <Input
                                    label="Selling Price"
                                    type="number"
                                    placeholder="0.00"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                />
                            </div>

                            <Button 
                                className="w-full mt-4" 
                                variant="secondary"
                                onClick={addItem}
                                icon={<Plus size={18} />}
                            >
                                Add to List
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Summary List */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    <Card noPadding className="shadow-lg border-2 border-slate-100">
                        <CardHeader 
                            title="Purchase Items" 
                            icon={<Package size={20} />}
                            action={<Badge variant="blue">{items.length} Items</Badge>}
                        />
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch & Expiry</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Price (P)</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.length > 0 ? items.map((i, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{i.medicine_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="text-slate-700">{i.batch_number}</div>
                                                <div className="text-slate-400 text-xs">{i.expiry_date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-slate-900">{i.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-slate-600">₹{i.purchase_price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">₹{(i.purchase_price * i.quantity).toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button 
                                                    onClick={() => removeItem(idx)}
                                                    className="text-rose-400 hover:text-rose-600 p-1.5 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-3">
                                                    <ShoppingCart size={40} className="text-slate-200" />
                                                    <p>No items added yet. Use the form on the left to add items.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Total Cost</span>
                                        <span className="text-2xl font-extrabold text-slate-900">₹{totalCost.toFixed(2)}</span>
                                    </div>
                                    <div className="w-[1px] h-10 bg-slate-200" />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Estimated Revenue</span>
                                        <span className="text-lg font-bold text-green-600">
                                            ₹{items.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                
                                <Button 
                                    size="lg" 
                                    className="w-full md:w-auto px-10 shadow-lg shadow-brand-200" 
                                    onClick={createPurchase}
                                    isLoading={loading}
                                    icon={<ArrowRight size={20} />}
                                >
                                    Complete Purchase
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}