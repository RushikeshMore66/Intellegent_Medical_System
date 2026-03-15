import { useState } from "react";
import api from "../api/client";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function AddUserModal({ close, refresh }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("pharmacist");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post("/users/", {
                name,
                email,
                password,
                role
            });
            refresh();
            close();
        } catch (err) {
            console.error("Failed to add user", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={close} title="Invite New User">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Full Name"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Set Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Role</label>
                    <select 
                        className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="pharmacist">Pharmacist</option>
                        <option value="admin">Administrator</option>
                    </select>
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
                        Send Invitation
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
