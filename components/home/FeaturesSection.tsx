export default function FeaturesSection() {
    return (
        <section id="recetas" className="bg-[var(--background-100)] py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h3 className="text-4xl font-bold mb-10">¿Por qué usar Sabores Caseros?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-6 rounded-2xl shadow-md bg-[var(--background)]">
                        <h4 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Fácil de usar</h4>
                        <p>Filtra recetas por los ingredientes que tienes en casa. Nunca fue tan sencillo decidir qué cocinar.</p>
                    </div>
                    <div className="p-6 rounded-2xl shadow-md bg-[var(--background)]">
                        <h4 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Gratis y accesible</h4>
                        <p>Explora cientos de recetas sin registrarte. Regístrate gratis para acceder a todas.</p>
                    </div>
                    <div className="p-6 rounded-2xl shadow-md bg-[var(--background)]">
                        <h4 className="text-2xl font-semibold mb-3 text-[var(--primary)]">Inspiración diaria</h4>
                        <p>Recibe sugerencias personalizadas basadas en tus ingredientes y gustos.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}