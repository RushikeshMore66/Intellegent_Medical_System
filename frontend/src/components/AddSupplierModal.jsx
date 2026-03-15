import { useState } from "react";
import api from "../api/client";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function AddSupplierModal({ close, refresh }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [gst, setGst] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/suppliers", {
                name,
                phone,
                gst_number: gst
            });
            refresh();
            close();
        } catch (err) {
            console.error("Failed to add supplier", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={close} title="Add New Supplier">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Supplier Name"
                    placeholder="e.g. Acme Medical Supplies"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                <Input
                    label="Phone Number"
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <Input
                    label="GST Number"
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                />

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
                        Save Supplier
                    </Button>
                </div>
            </form>
        </Modal>
    );
}