import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";

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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        const s = await api.get("/suppliers?limit=100&offset=0");
        const m = await api.get("/medicines?limit=100&offset=0");

        setSuppliers(s.data.data);
        setMedicines(m.data.data);
    };

    const addItem = () => {

        setItems([
            ...items,
            {
                medicine_id: medicineId,
                batch_number: batch,
                expiry_date: expiry,
                quantity: Number(qty),
                purchase_price: Number(purchasePrice),
                selling_price: Number(sellingPrice)
            }
        ]);

        setBatch("");
        setExpiry("");
        setQty("");
    };

    const createPurchase = async () => {

        await api.post("/purchases", {
            supplier_id: supplierId,
            items: items
        });

        alert("Purchase created successfully");

        setItems([]);
    };

    return (

        <DashboardLayout>

            <h2 className="text-2xl font-bold mb-6">
                Purchase Entry
            </h2>

            {/* Supplier Selection */}

            <div className="mb-6">

                <label className="block mb-2">
                    Supplier
                </label>

                <select
                    className="border p-2 rounded w-64"
                    onChange={(e) => setSupplierId(e.target.value)}
                >

                    <option>Select supplier</option>

                    {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}

                </select>

            </div>

            {/* Add Item */}

            <div className="grid grid-cols-6 gap-3 mb-6">

                <select
                    className="border p-2"
                    onChange={(e) => setMedicineId(e.target.value)}
                >
                    <option>Select medicine</option>

                    {medicines.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="Batch"
                    className="border p-2"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                />

                <input
                    type="date"
                    className="border p-2"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />

                <input
                    placeholder="Qty"
                    className="border p-2"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                />

                <input
                    placeholder="Purchase Price"
                    className="border p-2"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                />

                <input
                    placeholder="Selling Price"
                    className="border p-2"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                />

            </div>

            <button
                onClick={addItem}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
            >
                Add Item
            </button>

            {/* Purchase Table */}

            <table className="w-full bg-white shadow rounded mb-6">

                <thead className="bg-gray-200">

                    <tr>
                        <th className="p-3 text-left">Medicine</th>
                        <th className="p-3 text-left">Batch</th>
                        <th className="p-3 text-left">Qty</th>
                    </tr>

                </thead>

                <tbody>

                    {items.map((i, index) => (

                        <tr key={index} className="border-t">

                            <td className="p-3">{i.medicine_id}</td>
                            <td className="p-3">{i.batch_number}</td>
                            <td className="p-3">{i.quantity}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <button
                onClick={createPurchase}
                className="bg-green-600 text-white px-6 py-3 rounded"
            >
                Create Purchase
            </button>

        </DashboardLayout>

    );
}