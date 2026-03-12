import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";

export default function Inventory() {

    const [stock, setStock] = useState([]);
    const [expiry, setExpiry] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const fetchInventory = async () => {

        const stockRes = await api.get("/inventory/stock-summary");
        const expiryRes = await api.get("/inventory/near-expiry");
        const lowRes = await api.get("/inventory/low-stock");

        setStock(stockRes.data);
        setExpiry(expiryRes.data);
        setLowStock(lowRes.data);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (

        <DashboardLayout>

            <h2 className="text-2xl font-bold mb-6">
                Inventory
            </h2>

            {/* STOCK SUMMARY */}

            <div className="mb-8">

                <h3 className="text-xl font-semibold mb-3">
                    Stock Summary
                </h3>

                <table className="w-full bg-white shadow rounded">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="p-3 text-left">Medicine ID</th>
                            <th className="p-3 text-left">Total Quantity</th>
                        </tr>

                    </thead>

                    <tbody>

                        {stock.map((item) => (

                            <tr key={item.medicine_id} className="border-t">

                                <td className="p-3">{item.medicine_id}</td>

                                <td className="p-3">{item.total_quantity}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* NEAR EXPIRY */}

            <div className="mb-8">

                <h3 className="text-xl font-semibold mb-3 text-yellow-600">
                    Near Expiry
                </h3>

                <table className="w-full bg-white shadow rounded">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="p-3 text-left">Batch</th>
                            <th className="p-3 text-left">Expiry Date</th>
                            <th className="p-3 text-left">Quantity</th>
                        </tr>

                    </thead>

                    <tbody>

                        {expiry.map((batch) => (

                            <tr key={batch.id} className="border-t">

                                <td className="p-3">{batch.batch_number}</td>

                                <td className="p-3">{batch.expiry_date}</td>

                                <td className="p-3">{batch.quantity}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* LOW STOCK */}

            <div>

                <h3 className="text-xl font-semibold mb-3 text-red-600">
                    Low Stock
                </h3>

                <table className="w-full bg-white shadow rounded">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="p-3 text-left">Medicine ID</th>
                            <th className="p-3 text-left">Quantity</th>
                        </tr>

                    </thead>

                    <tbody>

                        {lowStock.map((item) => (

                            <tr key={item.medicine_id} className="border-t">

                                <td className="p-3">{item.medicine_id}</td>

                                <td className="p-3">{item.total_quantity}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    );
}