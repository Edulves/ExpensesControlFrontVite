import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../utils/cookies";

type PopupState = {
    type: "success" | "error";
    message: string;
} | null;

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState<PopupState>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPopup(null);

        try {
            const response = await fetch("https://localhost:7280/api/Auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Calcula dias até a expiração (mínimo 1 dia)
                const expirationDate = new Date(data.expiration);
                const now = new Date();
                const diffMs = expirationDate.getTime() - now.getTime();
                const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                setCookie("authToken", data.token, days);
                setCookie("tokenExpiration", data.expiration, days);
                setPopup({ type: "success", message: "Login realizado com sucesso!" });
                setTimeout(() => navigate("/dashboard"), 1200);
            } else {
                const errorData = await response.json().catch(() => null);
                const message = errorData?.message || errorData?.title || `Falha no login (status ${response.status})`;
                setPopup({ type: "error", message });
            }
        } catch (error) {
            setPopup({
                type: "error",
                message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-surface min-h-screen flex items-center justify-center font-body-lg text-on-surface antialiased p-4 md:p-8">
            <main className="w-full max-w-md bg-surface-container-lowest border border-border-subtle rounded-xl p-6 shadow-sm">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="font-display-lg text-5xl font-bold text-primary mb-1 tracking-tight">Expenses Control</h1>
                    <p className="font-body-lg text-base text-on-surface-variant">Financial Calm</p>
                </div>

                {/* Form */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="email">
                            Email Address
                        </label>
                        <div className="relative">
                            <span
                                aria-hidden="true"
                                className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant"
                            >
                                mail
                            </span>
                            <input
                                className="w-full pl-10 pr-2 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                id="email"
                                placeholder="name@company.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="password">
                                Password
                            </label>
                            <a className="font-body-sm text-sm text-primary hover:underline transition-all" href="#">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative">
                            <span
                                aria-hidden="true"
                                className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline-variant"
                            >
                                lock
                            </span>
                            <input
                                className="w-full pl-10 pr-2 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                id="password"
                                placeholder="••••••••"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full bg-primary text-on-primary font-body-lg text-base py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <span aria-hidden="true" className="material-symbols-outlined text-sm">
                                    arrow_forward
                                </span>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border-subtle" />
                    </div>
                    <span className="relative bg-surface-container-lowest px-4 font-body-sm text-sm text-on-surface-variant">
                        or continue with
                    </span>
                </div>

                {/* Social Login */}
                <button
                    className="w-full bg-surface-container-lowest border border-border-subtle text-primary font-body-lg text-base py-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 mb-6"
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                {/* Sign Up Link */}
                <p className="text-center font-body-sm text-sm text-on-surface-variant">
                    Don't have an account?{" "}
                    <a className="text-primary font-semibold hover:underline transition-all" href="#">
                        Create Account
                    </a>
                </p>
            </main>

            {/* Popup Modal */}
            {popup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div
                        className={`w-full max-w-sm bg-surface-container-lowest border rounded-xl p-6 shadow-lg text-center ${
                            popup.type === "success" ? "border-positive-emerald" : "border-negative-rose"
                        }`}
                    >
                        <div
                            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                                popup.type === "success" ? "bg-positive-emerald/10 text-positive-emerald" : "bg-negative-rose/10 text-negative-rose"
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{popup.type === "success" ? "check_circle" : "error"}</span>
                        </div>
                        <h2
                            className={`font-display-md text-display-md mb-1 ${popup.type === "success" ? "text-positive-emerald" : "text-negative-rose"}`}
                        >
                            {popup.type === "success" ? "Sucesso!" : "Erro"}
                        </h2>
                        <p className="font-body-lg text-base text-on-surface-variant mb-6">{popup.message}</p>
                        <button
                            className="w-full bg-primary text-on-primary font-body-lg text-base py-2 rounded-lg hover:bg-primary-container transition-colors"
                            type="button"
                            onClick={() => setPopup(null)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
