import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/client";

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const fetchSuppliers = async () => {
        const res = await api.get(`/suppliers?search=${search}&limit=10&offset=0`);
        setSuppliers(res.data.data);
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const deleteSupplier = async (id) => {
        await api.delete(`/suppliers/${id}`);
        fetchSuppliers();
    };

    return (
        <DashboardLayout>

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">
                    Suppliers
                </h2>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Supplier
                </button>

            </div>

            <input
                type="text"
                placeholder="Search supplier..."
                className="border p-2 mb-4 w-64 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="w-full bg-white shadow rounded">

                <thead className="bg-gray-200">

                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">GST</th>
                        <th className="p-3 text-left">Action</th>
                    </tr>

                </thead>

                <tbody>

                    {suppliers.map((s) => (

                        <tr key={s.id} className="border-t">

                            <td className="p-3">{s.name}</td>
                            <td className="p-3">{s.phone}</td>
                            <td className="p-3">{s.gst_number}</td>

                            <td className="p-3">

                                <button
                                    onClick={() => deleteSupplier(s.id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            {showModal && (
                <AddSupplierModal
                    close={() => setShowModal(false)}
                    refresh={fetchSuppliers}
                />
            )}

        </DashboardLayout>
    );
}