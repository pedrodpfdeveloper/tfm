"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background-100)] rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-[var(--primary)]">Iniciar Sesión</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[var(--primary)] bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[var(--primary)] bg-transparent"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-600)] transition-colors"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
}