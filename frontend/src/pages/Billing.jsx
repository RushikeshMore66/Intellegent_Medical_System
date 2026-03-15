import { useState } from "react";
import api from "../api/client";
import { createInvoice } from "../api/billing";
import { toast } from "react-toastify";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  Pill,
  ChevronRight,
  User
} from "lucide-react";

export default function Billing() {
    const [search, setSearch] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchMedicine = async (value) => {
        setSearch(value);
        if (!value) {
            setMedicines([]);
            return;
        }

        try {
            const res = await api.get(`/medicines?search=${value}&limit=10&offset=0`);
            setMedicines(res.data.data);
        } catch (error) {
            console.error("Error searching medicines:", error);
        }
    };

    const addToCart = async (medicine) => {
        try {
            const res = await api.get(`/inventory/medicine/${medicine.id}`);
            const batches = res.data;

            if (!batches || batches.length === 0) {
                toast.warning("No stock available for " + medicine.name);
                return;
            }

            const availableBatch = batches.find(b => b.quantity > 0);

            if (!availableBatch) {
                toast.warning("Out of stock for " + medicine.name);
                return;
            }

            const cartItemKey = `${medicine.id}-${availableBatch.id}`;
            const exists = cart.find((item) => item.cartItemKey === cartItemKey);

            if (exists) {
                if (exists.qty >= availableBatch.quantity) {
                    toast.info(`Only ${availableBatch.quantity} items available in this batch.`);
                    return;
                }
                setCart(
                    cart.map((item) =>
                        item.cartItemKey === cartItemKey
                            ? { ...item, qty: item.qty + 1 }
                            : item
                    )
                );
            } else {
                setCart([...cart, {
                    ...medicine,
                    cartItemKey,
                    batch_id: availableBatch.id,
                    available_qty: availableBatch.quantity,
                    selling_price: availableBatch.selling_price,
                    qty: 1
                }]);
                toast.success(`Added ${medicine.name} to cart`);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add to cart");
        }
    };

    const changeQty = (cartItemKey, newQty) => {
        if (newQty < 1) return;

        setCart(
            cart.map((item) => {
                if (item.cartItemKey === cartItemKey) {
                    if (newQty > item.available_qty) {
                        toast.info(`Only ${item.available_qty} items available.`);
                        return item;
                    }
                    return { ...item, qty: newQty };
                }
                return item;
            })
        );
    };

    const removeItem = (cartItemKey) => {
        setCart(cart.filter(item => item.cartItemKey !== cartItemKey));
    };

    const { totalAmount, totalGST } = cart.reduce(
        (acc, item) => {
            const itemTotal = item.selling_price * item.qty;
            const itemGST = itemTotal * ((item.gst_percentage || 0) / 100);
            return {
                totalAmount: acc.totalAmount + itemTotal,
                totalGST: acc.totalGST + itemGST
            };
        },
        { totalAmount: 0, totalGST: 0 }
    );

    const generateInvoice = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const items = cart.map((item) => ({
                medicine_id: item.id,
                batch_id: item.batch_id,
                quantity: item.qty
            }));

            const result = await createInvoice(items);
            toast.success("Invoice created successfully");

            const invoiceId = result.invoice_id;
            window.open(`http://127.0.0.1:8000/billing/invoice/${invoiceId}/pdf`, "_blank");
            setCart([]);
            setSearch("");
            setMedicines([]);
        } catch (error) {
            toast.error("Invoice creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing POS</h1>
                <p className="text-slate-500 mt-1">Generate new invoices and manage sales.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Medicine Selection Panel */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <Card className="!p-4">
                        <Input
                            placeholder="Search medicine by name or brand..."
                            icon={Search}
                            value={search}
                            onChange={(e) => searchMedicine(e.target.value)}
                            className="!bg-white"
                        />
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {medicines.length > 0 ? medicines.map((m) => (
                            <Card 
                                key={m.id} 
                                className="hover:border-brand-300 hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => addToCart(m)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                                            <Pill size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 leading-tight">{m.name}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5">{m.manufacturer}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">₹{m.selling_price}</p>
                                        <Badge variant="blue" className="mt-1">{m.gst_percentage}% GST</Badge>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between pointer-events-none">
                                    <span className="text-xs font-medium text-slate-400 group-hover:text-brand-600">Click to add</span>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500" />
                                </div>
                            </Card>
                        )) : search && !loading ? (
                            <div className="col-span-full py-12 text-center text-slate-400">
                                No medicines found.
                            </div>
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-400 opacity-50">
                                Start typing to find medicines...
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart / Invoice Summary Panel */}
                <div className="lg:col-span-5">
                    <Card noPadding className="sticky top-24 overflow-hidden shadow-lg border-2 border-brand-100">
                        <CardHeader 
                            title="Order Summary" 
                            icon={<ShoppingCart size={20} />}
                            action={<Badge variant="brand">{cart.length} Items</Badge>}
                            className="bg-slate-50"
                        />
                        
                        <div className="bg-white min-h-[300px] max-h-[450px] overflow-y-auto no-scrollbar">
                            {cart.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                        <ShoppingCart size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">Your cart is empty</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100">
                                    {cart.map((item) => (
                                        <li key={item.cartItemKey} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-medium text-slate-900 truncate">{item.name}</h5>
                                                    <p className="text-xs text-slate-500 mt-0.5">Batch: {item.batch_id.slice(0, 8)}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-semibold text-slate-900">₹{(item.selling_price * item.qty).toFixed(2)}</p>
                                                    <p className="text-[10px] text-slate-400">GST: ₹{(item.selling_price * item.qty * (item.gst_percentage / 100)).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                                                    <button 
                                                        onClick={() => changeQty(item.cartItemKey, item.qty - 1)}
                                                        className="p-1 text-slate-500 hover:bg-white hover:text-brand-600 rounded-md shadow-sm transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-slate-700">{item.qty}</span>
                                                    <button 
                                                        onClick={() => changeQty(item.cartItemKey, item.qty + 1)}
                                                        className="p-1 text-slate-500 hover:bg-white hover:text-brand-600 rounded-md shadow-sm transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeItem(item.cartItemKey)}
                                                    className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Total Value Added Tax (GST)</span>
                                <span>₹{totalGST.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="font-bold text-slate-900 text-lg">Grand Total</span>
                                <span className="font-extrabold text-brand-600 text-2xl">₹{(totalAmount + totalGST).toFixed(2)}</span>
                            </div>
                            
                            <Button 
                                className="w-full mt-4 !py-4 text-lg !rounded-xl shadow-indigo-100 shadow-xl" 
                                size="lg"
                                onClick={generateInvoice}
                                disabled={cart.length === 0}
                                isLoading={loading}
                                icon={<FileText size={20} />}
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}