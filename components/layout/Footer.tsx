import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="footer" className="bg-[var(--background-200)] py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-[var(--text-700)]">© {new Date().getFullYear()} BocadoBoreal. Todos los derechos reservados.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-[var(--primary)]">Términos</Link>
                    <Link href="#" className="hover:text-[var(--primary)]">Privacidad</Link>
                    <Link href="#" className="hover:text-[var(--primary)]">Contacto</Link>
                </div>
            </div>
        </footer>
    );
}