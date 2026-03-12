import { useState } from "react";
import api from "../api/client";

export default function AddMedicineModal({ onClose, refresh }) {

    const [name, setName] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [gst, setGst] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        await api.post("/medicines", {
            name,
            manufacturer,
            gst_percentage: gst,
            selling_price: price,
        });

        refresh();
        onClose();
    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">

            <div className="bg-white p-6 rounded w-96">

                <h3 className="text-xl font-bold mb-4">
                    Add Medicine
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <input
                        placeholder="Name"
                        className="border p-2 w-full"
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        placeholder="Manufacturer"
                        className="border p-2 w-full"
                        onChange={(e) => setManufacturer(e.target.value)}
                    />

                    <input
                        placeholder="GST %"
                        className="border p-2 w-full"
                        onChange={(e) => setGst(e.target.value)}
                    />

                    <input
                        placeholder="Price"
                        className="border p-2 w-full"
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save
                    </button>

                </form>

            </div>

        </div>

    );
}