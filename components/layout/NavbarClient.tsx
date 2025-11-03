"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface NavbarClientProps {
    user: User | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

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
                <Link href="/">
                    <h1 className="text-2xl font-bold text-[var(--primary)]">Sabores Caseros</h1>
                </Link>
                <div className="hidden md:flex items-center space-x-6 text-lg">
                    <Link href="/#recetas" className="hover:text-[var(--primary)] transition-colors">Recetas</Link>
                    <Link href="/#faq" className="hover:text-[var(--primary)] transition-colors">FAQ</Link>
                    <Link href="/#footer" className="hover:text-[var(--primary)] transition-colors">Contacto</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeSwitcher />
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm hidden sm:block">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 border rounded-xl border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link href="/login" className="px-4 py-2 border rounded-xl border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors">
                                Iniciar sesión
                            </Link>
                            <Link href="/register" className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-xl hover:bg-[var(--primary-600)] transition-colors">
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}