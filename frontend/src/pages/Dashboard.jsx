import { useEffect, useState } from "react";
import api from "../api/client";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import Spinner from "../components/Spinner";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  History,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [today, setToday] = useState({});
    const [month, setMonth] = useState({});
    const [profit, setProfit] = useState({});
    const [trend, setTrend] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [expiry, setExpiry] = useState([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [t, m, p, s, l, e] = await Promise.all([
                api.get("/billing/analytics/today"),
                api.get("/billing/analytics/month"),
                api.get("/billing/analytics/total-profit"),
                api.get("/billing/analytics/sales-trend"),
                api.get("/inventory/low-stock"),
                api.get("/inventory/near-expiry")
            ]);

            setToday(t.data);
            setMonth(m.data);
            setProfit(p.data);
            setTrend(s.data);
            setLowStock(l.data);
            setExpiry(e.data);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (isLoading) return <Spinner />;

    const stats = [
        { 
            label: "Today's Sales", 
            value: `₹${today.total_sales || 0}`, 
            icon: ShoppingBag, 
            color: "brand",
            trend: "+12.5%",
            isUp: true 
        },
        { 
            label: "Monthly Sales", 
            value: `₹${month.total_sales || 0}`, 
            icon: TrendingUp, 
            color: "blue",
            trend: "+8.2%",
            isUp: true 
        },
        { 
            label: "Total Profit", 
            value: `₹${profit.total_profit || 0}`, 
            icon: DollarSign, 
            color: "green",
            trend: "+4.1%",
            isUp: true 
        },
        { 
            label: "Invoices Today", 
            value: today.invoice_count || 0, 
            icon: FileText, 
            color: "brand",
            trend: "-2.4%",
            isUp: false 
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className={`flex items-center text-xs font-medium ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {stat.trend}
                                    </span>
                                    <span className="text-xs text-slate-400">vs last period</span>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.color === 'brand' ? 'bg-brand-50' : 'bg-' + stat.color + '-50'}`}>
                                <stat.icon size={20} className={`${stat.color === 'brand' ? 'text-brand-600' : 'text-' + stat.color + '-600'}`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend */}
                <Card className="lg:col-span-2">
                    <CardHeader 
                        title="Sales Trend" 
                        subtitle="Revenue over the past 30 days"
                        action={
                            <Badge variant="brand">Last 30 Days</Badge>
                        }
                    />
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '12px', 
                                            border: 'none', 
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                                        }} 
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts Sidebar */}
                <div className="flex flex-col gap-6">
                    {/* Low Stock */}
                    <Card className="border-l-4 border-l-rose-500">
                        <CardHeader 
                            title="Low Stock" 
                            subtitle="Medicines requiring reorder"
                            className="!p-4"
                        />
                        <CardContent className="!p-4 pt-0">
                            <div className="space-y-3">
                                {lowStock.length > 0 ? lowStock.map((item) => (
                                    <div key={item.medicine_id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-rose-100 text-rose-600 rounded">
                                                <AlertTriangle size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{item.medicine_id}</span>
                                        </div>
                                        <Badge variant="red">{item.total_quantity} left</Badge>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500 py-2">No low stock alerts</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expiry Alerts */}
                    <Card className="border-l-4 border-l-amber-500">
                        <CardHeader 
                            title="Near Expiry" 
                            subtitle="Expiring within 30 days"
                            className="!p-4"
                        />
                        <CardContent className="!p-4 pt-0">
                            <div className="space-y-3">
                                {expiry.length > 0 ? expiry.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-1 p-2 rounded-lg bg-slate-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                                                {item.batch_number}
                                            </span>
                                            <Badge variant="yellow">{item.quantity} units</Badge>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                                            <History size={12} />
                                            Expires: {item.expiry_date}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-slate-500 py-2">No medicines expiring soon</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}