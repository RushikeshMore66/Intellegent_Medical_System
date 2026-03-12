import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";
import { createInvoice } from "../api/billing";
import { toast } from "react-toastify";

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
            // Fetch available batches for this medicine
            const res = await api.get(`/inventory/medicine/${medicine.id}`);
            const batches = res.data;

            if (!batches || batches.length === 0) {
                alert("No stock available for " + medicine.name);
                return;
            }

            // Simple approach: pick the first batch with quantity > 0
            const availableBatch = batches.find(b => b.quantity > 0);

            if (!availableBatch) {
                alert("Out of stock for " + medicine.name);
                return;
            }

            const cartItemKey = `${medicine.id}-${availableBatch.id}`;
            const exists = cart.find((item) => item.cartItemKey === cartItemKey);

            if (exists) {
                if (exists.qty >= availableBatch.quantity) {
                    alert(`Only ${availableBatch.quantity} items available in this batch.`);
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
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add to cart");
        }
    };

    const changeQty = (cartItemKey, value) => {
        const newQty = Number(value);
        if (newQty < 1) return;

        setCart(
            cart.map((item) => {
                if (item.cartItemKey === cartItemKey) {
                    if (newQty > item.available_qty) {
                        alert(`Only ${item.available_qty} items available in this batch.`);
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

    // Calculate totals
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
        try {
            const items = cart.map((item) => ({
                medicine_id: item.id,
                batch_id: item.batch_id,
                quantity: item.qty
            }));

            const result = await createInvoice(items);

            toast.success("Invoice created successfully");

            const invoiceId = result.invoice_id;

            window.open(
                `http://127.0.0.1:8000/billing/invoice/${invoiceId}/pdf`,
                "_blank"
            );

            setCart([]);

        } catch (error) {

            toast.error("Invoice failed");

        }

    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT PANEL */}
                <div>
                    <h2 className="text-xl font-bold mb-3">Search Medicine</h2>
                    <input
                        type="text"
                        placeholder="Type medicine name..."
                        className="border p-2 w-full mb-4 rounded"
                        value={search}
                        onChange={(e) => searchMedicine(e.target.value)}
                    />

                    {medicines.length > 0 && (
                        <div className="bg-white shadow rounded max-h-96 overflow-y-auto">
                            {medicines.map((m) => (
                                <div
                                    key={m.id}
                                    onClick={() => addToCart(m)}
                                    className="p-3 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-semibold">{m.name}</div>
                                        <div className="text-sm text-gray-500">{m.manufacturer}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-blue-600">₹{m.selling_price}</div>
                                        <div className="text-xs text-gray-500">GST: {m.gst_percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <div>
                    <h2 className="text-xl font-bold mb-3">Invoice</h2>
                    <div className="bg-white shadow rounded p-4">
                        {cart.length === 0 && (
                            <p className="text-gray-500 py-4 text-center">No items added to cart</p>
                        )}

                        {cart.map((item) => (
                            <div key={item.cartItemKey} className="flex flex-col mb-3 pb-3 border-b">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">(Batch: {item.batch_id.substring(0, 6)}...)</span>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.cartItemKey)}
                                        className="text-red-500 text-sm hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Qty:</span>
                                        <input
                                            type="number"
                                            value={item.qty}
                                            min="1"
                                            max={item.available_qty}
                                            className="w-16 border rounded p-1 text-center"
                                            onChange={(e) => changeQty(item.cartItemKey, e.target.value)}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <div>₹{(item.selling_price * item.qty).toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">
                                            + ₹{(item.selling_price * item.qty * (item.gst_percentage / 100)).toFixed(2)} GST
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {cart.length > 0 && (
                            <>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Total GST</span>
                                        <span>₹{totalGST.toFixed(2)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-bold text-xl text-blue-700">
                                        <span>Total Amount</span>
                                        <span>₹{(totalAmount + totalGST).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={generateInvoice}
                                    className="w-full mt-4 bg-green-600 text-white p-3 rounded"
                                >
                                    Generate Invoice
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}