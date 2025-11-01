import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NextThemesProvider from '@/components/ThemeProvider';

const lora = Lora({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Sabores Caseros | Encuentra recetas con lo que tienes en casa',
    description: 'Explora recetas caseras, filtra por ingredientes y disfruta del placer de cocinar con lo que tienes en casa.',
    keywords: 'recetas, cocina casera, ingredientes, filtro de recetas, comida fácil, cocina económica',
    openGraph: {
        title: 'Sabores Caseros',
        description: 'Encuentra recetas con los ingredientes que tienes en casa.',
        url: 'https://saborescaseros.com',
        siteName: 'Sabores Caseros',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Sabores Caseros preview',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body className={lora.className}>
        <NextThemesProvider>
            <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </div>
        </NextThemesProvider>
        </body>
        </html>
    )
}