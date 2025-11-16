import Link from 'next/link';
import Image from 'next/image';

interface HeroSectionProps {
    isLoggedIn?: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
    return (
        <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 max-w-7xl mx-auto">
            <div className="md:w-1/2 space-y-6">
                <h2 className="text-5xl font-bold leading-tight">
                    Descubre el sabor de lo <span className="text-[var(--primary)]">hecho en casa</span>
                </h2>
                <p className="text-lg text-[var(--text-600)]">
                    En <strong>BocadoBoreal</strong> puedes encontrar recetas deliciosas con los ingredientes que ya tienes en casa. Filtra, explora y cocina con amor.
                </p>
                <div className="flex space-x-4">
                    <Link href="/recetas" className="px-6 py-3 bg-[var(--primary)] text-[var(--background)] rounded-xl font-semibold hover:opacity-90 transition-opacity">Ver recetas</Link>
                    {!isLoggedIn && (
                        <Link href="/login" className="px-6 py-3 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-semibold hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors">Inicia sesión</Link>
                    )}
                </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                <Image
                    src="/landing_image.webp"
                    alt="Cocinando en casa"
                    width={500}
                    height={400}
                    className="rounded-2xl shadow-lg"
                    priority
                />
            </div>
        </section>
    );
}