import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import Spinner from "../components/Spinner";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  Eye, 
  CheckCircle2,
  DollarSign
} from "lucide-react";

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const loadReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/billing/invoices?limit=50&offset=0");
            const invoices = res.data.data;
            setReports(invoices);

            const revenue = invoices.reduce((sum, i) => sum + i.total_amount, 0);
            setTotalRevenue(revenue);
            setTotalInvoices(invoices.length);
        } catch (err) {
            console.error("Failed to load reports", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sales Reports</h1>
                    <p className="text-slate-500 mt-1">Review your pharmacy's sales performance and history.</p>
                </div>
                <Button variant="secondary" icon={<Download size={18} />}>
                    Export CSV
                </Button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-brand-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm font-medium">
                                <TrendingUp size={14} />
                                <span>+12.5% vs last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                            <DollarSign size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Invoices</p>
                            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalInvoices}</h3>
                            <p className="text-xs text-slate-400 mt-2">Processed successfully</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="!bg-slate-50/50 border-dashed">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-full sm:w-48">
                        <Input
                            label="From Date"
                            type="date"
                            icon={Calendar}
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Input
                            label="To Date"
                            type="date"
                            icon={Calendar}
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" icon={<Filter size={18} />}>
                        Apply Filters
                    </Button>
                </div>
            </Card>

            {/* Reports Table */}
            <Card noPadding>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice Number</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : reports.length > 0 ? (
                                reports.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded w-fit">
                                                #{r.invoice_number || r.id.slice(0, 8).toUpperCase()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {new Date(r.created_at).toLocaleDateString()} at {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
                                                <CheckCircle2 size={14} />
                                                Paid
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-900">
                                            ₹{r.total_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <a
                                                href={`http://127.0.0.1:8000/billing/invoice/${r.id}/pdf`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                            >
                                                <Eye size={14} />
                                                View PDF
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No sales records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}