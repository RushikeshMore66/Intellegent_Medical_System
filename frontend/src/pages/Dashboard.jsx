import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Dashboard() {

    const [today, setToday] = useState({});
    const [month, setMonth] = useState({});
    const [profit, setProfit] = useState({});
    const [trend, setTrend] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const loadData = async () => {

        const t = await api.get("/billing/analytics/today");
        const m = await api.get("/billing/analytics/month");
        const p = await api.get("/billing/analytics/total-profit");
        const s = await api.get("/billing/analytics/sales-trend");
        const l = await api.get("/inventory/low-stock");

        setToday(t.data);
        setMonth(m.data);
        setProfit(p.data);
        setTrend(s.data);
        setLowStock(l.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (

        <DashboardLayout>

            <h2 className="text-2xl font-bold mb-6">
                Dashboard
            </h2>

            {/* KPI Cards */}

            <div className="grid grid-cols-4 gap-4 mb-8">

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Today's Sales</p>
                    <h3 className="text-xl font-bold">
                        ₹{today.total_sales || 0}
                    </h3>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Monthly Sales</p>
                    <h3 className="text-xl font-bold">
                        ₹{month.total_sales || 0}
                    </h3>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Total Profit</p>
                    <h3 className="text-xl font-bold">
                        ₹{profit.total_profit || 0}
                    </h3>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Invoices Today</p>
                    <h3 className="text-xl font-bold">
                        {today.invoice_count || 0}
                    </h3>
                </div>

            </div>

            {/* Sales Trend */}

            <div className="bg-white p-6 shadow rounded mb-8">

                <h3 className="text-lg font-semibold mb-4">
                    Sales Trend
                </h3>

                <ResponsiveContainer width="100%" height={300}>

                    <LineChart data={trend}>

                        <XAxis dataKey="date" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2563eb"
                            strokeWidth={2}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            {/* Low Stock */}

            <div className="bg-white p-6 shadow rounded">

                <h3 className="text-lg font-semibold mb-4 text-red-600">
                    Low Stock Alerts
                </h3>

                <table className="w-full">

                    <thead>

                        <tr className="border-b">
                            <th className="p-2 text-left">Medicine ID</th>
                            <th className="p-2 text-left">Quantity</th>
                        </tr>

                    </thead>

                    <tbody>

                        {lowStock.map((item) => (

                            <tr key={item.medicine_id} className="border-b">

                                <td className="p-2">
                                    {item.medicine_id}
                                </td>

                                <td className="p-2">
                                    {item.total_quantity}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    );
}