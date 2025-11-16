import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer id="footer" className="bg-[var(--background-200)] py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-3 mb-4 md:mb-0">
                    <Image
                        src="/favicon.png"
                        alt="BocadoBoreal logo"
                        width={28}
                        height={28}
                        className="rounded-lg"
                    />
                    <p className="text-[var(--text-700)]">{new Date().getFullYear()} BocadoBoreal. Todos los derechos reservados.</p>
                </div>
                <div className="flex space-x-4 mt-0 md:mt-0">
                    <Link href="/terminos" className="hover:text-[var(--primary)]">Términos</Link>
                    <Link href="/privacidad" className="hover:text-[var(--primary)]">Privacidad</Link>
                    <Link href="/contacto" className="hover:text-[var(--primary)]">Contacto</Link>
                </div>
            </div>
        </footer>
    );
}