import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        try {
            await registerUser({ name, email, password });
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.detail || "Registration failed. This email may already be in use.");
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

            <div className="w-full max-w-[450px] px-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20 mb-4 transform -rotate-6">
                        <UserPlus className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2 font-medium">Join PharmaOS and manage your pharmacy with ease.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-start gap-3 mb-6 animate-shake">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span className="text-sm font-medium leading-tight">{error}</span>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-xl flex items-start gap-3 mb-6">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold">Account created!</span>
                                <span className="text-xs">Redirecting you to the login page...</span>
                            </div>
                        </div>
                    )}

                    {!isSuccess && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Input
                                label="Full Name"
                                placeholder="e.g. John Doe"
                                icon={User}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="••••••••"
                                    icon={Lock}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                                By signing up, you agree to our <a href="#" className="font-bold hover:underline">Terms of Service</a> and <a href="#" className="font-bold hover:underline">Privacy Policy</a>.
                            </p>

                            <Button 
                                type="submit" 
                                size="lg" 
                                className="w-full mt-2" 
                                isLoading={isLoading}
                            >
                                Register Now
                            </Button>
                        </form>
                    )}
                </div>

                <p className="text-center mt-8 text-slate-500 text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

