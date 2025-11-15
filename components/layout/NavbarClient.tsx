"use client";

import { useState, useEffect, useRef } from 'react';
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const router = useRouter();
    const supabase = createClient();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    const getInitials = (email: string | undefined) => {
        if (!email) return '';
        return email.charAt(0).toUpperCase();
    };

    return (
        <nav
            className={`
                    w-full sticky top-0 z-50 transition-all duration-300
                    border-b border-[var(--navbar-border-light)] dark:border-[var(--navbar-border-dark)] border-solid
                    ${isScrolled
                ? 'shadow-md bg-[var(--background-50)]/80 backdrop-blur-lg'
                : 'bg-[var(--background-50)]'
            }
                `}
        >
            <div className="max-w-[88rem] mx-auto flex justify-between items-center p-4 px-6">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-[var(--primary)]">BocadoBoreal</h1>
                </Link>
                <div className="hidden md:flex items-center space-x-6 text-lg">
                    <Link href="/recetas" className="hover:text-[var(--primary)] transition-colors">Recetas</Link>
                    <Link href="/#faq" className="hover:text-[var(--primary)] transition-colors">FAQ</Link>
                    <Link href="/contacto" className="hover:text-[var(--primary)] transition-colors">Contacto</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeSwitcher />

                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--background)] flex items-center justify-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                            >
                                {getInitials(user.email)}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-[var(--background-50)] rounded-lg shadow-lg border border-[var(--gray-200)] overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[var(--gray-200)]">
                                        <p className="text-xs text-[var(--text-color)]/80">Sesión iniciada como:</p>
                                        <p className="text-sm font-medium text-[var(--text-color)] truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--primary-100)] transition-colors"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/login" className="px-4 py-2 border rounded-xl border-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors">
                                Iniciar sesión
                            </Link>

                            <Link href="/register" className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded-xl hover:bg-[var(--primary-600)] transition-colors">
                                Registrarse
                            </Link>
                        </div>
                    )}
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-[var(--navbar-border-light)] text-[var(--text-color)]"
                        aria-label="Abrir menú de navegación"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--navbar-border-light)] bg-[var(--background-50)]">
                    <div className="max-w-[88rem] mx-auto px-6 py-3 flex flex-col space-y-3">
                        <Link href="/recetas" className="hover:text-[var(--primary)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Recetas
                        </Link>
                        <Link href="/#faq" className="hover:text-[var(--primary)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            FAQ
                        </Link>
                        <Link href="/contacto" className="hover:text-[var(--primary)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Contacto
                        </Link>
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    className="hover:text-[var(--primary)] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="hover:text-[var(--primary)] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}