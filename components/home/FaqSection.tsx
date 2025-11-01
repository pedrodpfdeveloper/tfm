export default function FaqSection() {
    return (
        <section id="faq" className="py-20 max-w-5xl mx-auto px-6">
            <h3 className="text-4xl font-bold text-center mb-10">Preguntas frecuentes</h3>
            <div className="space-y-6">
                <details className="p-6 bg-[var(--background-50)] rounded-xl shadow-md">
                    <summary className="cursor-pointer text-xl font-semibold text-[var(--primary)]">¿Necesito registrarme para ver recetas?</summary>
                    <p className="mt-3 text-[var(--text-700)]">No, puedes ver una selección de recetas sin registrarte. Si te registras, tendrás acceso completo a todo el catálogo.</p>
                </details>
                <details className="p-6 bg-[var(--background-50)] rounded-xl shadow-md">
                    <summary className="cursor-pointer text-xl font-semibold text-[var(--primary)]">¿Puedo subir mis propias recetas?</summary>
                    <p className="mt-3 text-[var(--text-700)]">Próximamente podrás compartir tus creaciones con la comunidad. ¡Estamos trabajando en ello!</p>
                </details>
                <details className="p-6 bg-[var(--background-50)] rounded-xl shadow-md">
                    <summary className="cursor-pointer text-xl font-semibold text-[var(--primary)]">¿Tiene costo registrarse?</summary>
                    <p className="mt-3 text-[var(--text-700)]">No, el registro es completamente gratuito.</p>
                </details>
            </div>
        </section>
    );
}