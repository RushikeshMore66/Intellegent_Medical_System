import { useState } from "react";
import api from "../api/client";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function AddMedicineModal({ close, refresh }) {
    const [name, setName] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [category, setCategory] = useState("");
    const [gst, setGst] = useState("");
    const [mrp, setMrp] = useState("");
    const [price, setPrice] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/medicines", {
                name,
                manufacturer,
                category,
                gst_percentage: parseFloat(gst),
                mrp: parseFloat(mrp),
                selling_price: parseFloat(price),
            });
            refresh();
            close();
        } catch (err) {
            console.error("Failed to add medicine", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={close} title="Add New Medicine">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Medicine Name"
                    placeholder="e.g. Paracetamol 500mg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Manufacturer"
                        placeholder="Cipla Ltd."
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        required
                    />
                    <Input
                        label="Category"
                        placeholder="Tablet, Syrup, etc."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="GST %"
                        type="number"
                        placeholder="12"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                        required
                    />
                    <Input
                        label="MRP (₹)"
                        type="number"
                        step="0.01"
                        placeholder="30.00"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                        required
                    />
                    <Input
                        label="Sale Price (₹)"
                        type="number"
                        step="0.01"
                        placeholder="25.50"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <div className="flex gap-3 mt-4">
                    <Button 
                        type="button" 
                        variant="secondary" 
                        className="flex-1"
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        className="flex-1"
                        isLoading={isLoading}
                    >
                        Save Medicine
                    </Button>
                </div>
            </form>
        </Modal>
    );
}