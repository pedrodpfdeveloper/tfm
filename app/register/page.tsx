"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from "react-google-recaptcha";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const captchaToken = recaptchaRef.current?.getValue();
        if (!captchaToken) {
            setError("Por favor, completa el CAPTCHA.");
            return;
        }

        setIsSubmitting(true);

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, captchaToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Ocurrió un error al registrar la cuenta.");
        } else {
            setSuccessMessage("¡Cuenta creada con éxito! Serás redirigido al inicio de sesión.");
            recaptchaRef.current?.reset();
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-50)]">
            <div className="w-full max-w-md p-8 space-y-6 bg-[var(--background)] shadow-lg rounded-xl border border-[var(--gray-200)]">
                <h1 className="text-3xl font-bold text-center text-[var(--primary)]">Crear una cuenta</h1>

                <form onSubmit={handleRegister} className="space-y-6">
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
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background-50)] border-[var(--gray-300)]"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-center text-red-500">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-sm text-center text-green-500">{successMessage}</p>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 font-bold text-[var(--background)] bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-600)] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-[var(--text-color)]">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="font-medium text-[var(--primary)] hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}