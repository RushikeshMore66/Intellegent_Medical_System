import { useState } from "react";
import api from "../api/client";

export default function AddSupplierModal({ close, refresh }) {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gst, setGst] = useState("");

    const submit = async (e) => {

        e.preventDefault();

        await api.post("/suppliers", {
            name,
            phone,
            gst_number: gst
        });

        refresh();
        close();
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

            <div className="bg-white p-6 rounded w-96">

                <h3 className="text-xl font-bold mb-4">
                    Add Supplier
                </h3>

                <form onSubmit={submit} className="space-y-3">

                    <input
                        placeholder="Name"
                        className="border p-2 w-full"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        placeholder="Phone"
                        className="border p-2 w-full"
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <input
                        placeholder="GST Number"
                        className="border p-2 w-full"
                        onChange={(e) => setGst(e.target.value)}
                    />

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>

                </form>

            </div>

        </div>
    );
}