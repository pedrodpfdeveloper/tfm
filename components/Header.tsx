'use client';

import Link from "next/link";

export default function Header() {
    const isLoggedIn = false;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-text/10 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="font-serif text-2xl font-bold text-primary">
                    BocadoBoreal
                </Link>
                <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                    <Link href="#features" className="transition-colors hover:text-primary">
                        ¿Por qué nosotros?
                    </Link>
                    <Link href="#recipes" className="transition-colors hover:text-primary">
                        Recetas Populares
                    </Link>
                    <Link href="#faq" className="transition-colors hover:text-primary">
                        FAQ
                    </Link>
                </nav>
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <Link href="/perfil" className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105">
                            Mi Perfil
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:inline-block rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:text-primary">
                                Iniciar Sesión
                            </Link>
                            <Link href="/registro" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}