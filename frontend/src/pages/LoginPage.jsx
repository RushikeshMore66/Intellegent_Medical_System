import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await loginUser(email, password);
            localStorage.setItem("token", data.access_token);
            window.location.href = "/dashboard";
        } catch (error) {
            setError("Invalid email or password. Please try again.");
            console.error("Login failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-[400px] px-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20 mb-4 transform -rotate-6">
                        <LogIn className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PharmaOS</h1>
                    <p className="text-slate-500 mt-2 font-medium">Welcome back! Please enter your details.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-start gap-3 mb-6 animate-shake">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span className="text-sm font-medium leading-tight">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            icon={Mail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={Lock}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex items-center justify-between py-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20 transition-all cursor-pointer" />
                                <span className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">Forgot password?</a>
                        </div>

                        <Button 
                            type="submit" 
                            size="lg" 
                            className="w-full mt-2" 
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}