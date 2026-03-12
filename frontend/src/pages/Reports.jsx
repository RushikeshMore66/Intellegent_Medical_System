import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";

export default function Reports() {

    const [reports, setReports] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);

    const loadReports = async () => {

        const res = await api.get("/billing/invoices?limit=50&offset=0");

        const invoices = res.data.data;

        setReports(invoices);

        const revenue = invoices.reduce(
            (sum, i) => sum + i.total_amount,
            0
        );

        setTotalRevenue(revenue);
        setTotalInvoices(invoices.length);
    };

    useEffect(() => {
        loadReports();
    }, []);

    return (

        <DashboardLayout>

            <h2 className="text-2xl font-bold mb-6">
                Sales Reports
            </h2>

            {/* Summary */}

            <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Total Revenue</p>
                    <h3 className="text-xl font-bold">
                        ₹{totalRevenue}
                    </h3>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-gray-500">Total Invoices</p>
                    <h3 className="text-xl font-bold">
                        {totalInvoices}
                    </h3>
                </div>

            </div>

            {/* Sales Table */}

            <table className="w-full bg-white shadow rounded">

                <thead className="bg-gray-200">

                    <tr>
                        <th className="p-3 text-left">Invoice</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>

                </thead>

                <tbody>

                    {reports.map((r) => (

                        <tr key={r.id} className="border-t">

                            <td className="p-3">
                                {r.invoice_number || r.id.slice(0, 8)}
                            </td>

                            <td className="p-3">
                                {new Date(r.created_at).toLocaleDateString()}
                            </td>

                            <td className="p-3">
                                ₹{r.total_amount}
                            </td>

                            <td className="p-3">

                                <a
                                    href={`http://127.0.0.1:8000/billing/${r.id}/pdf`}
                                    target="_blank"
                                    className="text-blue-600"
                                >
                                    View PDF
                                </a>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </DashboardLayout>

    );
}