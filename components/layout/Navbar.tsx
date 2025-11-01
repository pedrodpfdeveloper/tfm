"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav
            className={`
    w-full sticky top-0 z-50 transition-all duration-300
    ${isScrolled
                ? 'shadow-md bg-[var(--background-50)]/80 backdrop-blur-lg'
                : 'bg-[var(--background-50)]'
            }
  `}
        >
            <div className="max-w-[88rem] mx-auto flex justify-between items-center p-4 px-6">
                <h1 className="text-2xl font-bold text-[var(--primary)]">Sabores Caseros</h1>
                <div className="hidden md:flex items-center space-x-6 text-lg">
                    <Link href="/#recetas" className="hover:text-[var(--primary)] transition-colors">Recetas</Link>
                    <Link href="/#faq" className="hover:text-[var(--primary)] transition-colors">FAQ</Link>
                    <Link href="/#footer" className="hover:text-[var(--primary)] transition-colors">Contacto</Link>
                </div>
                <div className="flex items-center space-x-2">
                    <ThemeSwitcher />
                    <Link href="/login" className="px-4 py-2 border rounded-xl border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors">
                        Iniciar sesión
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-xl hover:bg-[var(--primary-600)] transition-colors">
                        Registrarse
                    </Link>
                </div>
            </div>
        </nav>

    );
}