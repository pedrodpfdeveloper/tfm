"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setIsSubmitting(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-50)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background)] shadow-lg rounded-xl border border-[var(--gray-200)]">
                <h1 className="text-3xl font-bold text-center text-[var(--primary)]">Iniciar Sesión</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color)]">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background-50)] border-[var(--gray-300)]"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color)]">
                            Contraseña
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background-50)] border-[var(--gray-300)]"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--gray-500)]"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M3 3l18 18" />
                                        <path d="M10.477 10.485A3 3 0 0113.5 13.5" />
                                        <path d="M9.88 16.12A5.5 5.5 0 0112 6.5c4.47 0 7.5 5.5 7.5 5.5a12.3 12.3 0 01-1.67 2.51" />
                                        <path d="M6.53 6.53A12.3 12.3 0 004.5 12s3.03 5.5 7.5 5.5a7.7 7.7 0 003.3-.77" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5"
                                    >
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <p className="text-sm text-center text-red-500">{error}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 font-bold text-[var(--background)] bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-[var(--text-color)]">
                    ¿No tienes una cuenta?{' '}
                    <Link href="/register" className="font-medium text-[var(--primary)] hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}