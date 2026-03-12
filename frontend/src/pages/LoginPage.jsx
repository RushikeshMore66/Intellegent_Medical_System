import { useState } from "react";
import { loginUser } from "../api/auth";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.access_token);

            window.location.href = "/dashboard";

        } catch (error) {
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-96">

                <h1 className="text-2xl font-bold text-center mb-6">
                    PharmaOS Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}