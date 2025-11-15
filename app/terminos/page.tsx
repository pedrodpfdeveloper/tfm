import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Términos y condiciones de uso</h1>
      <p className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

      <p>
        Al utilizar BocadoBoreal aceptas estos términos y condiciones de uso. Este sitio está pensado
        para ayudarte a encontrar y gestionar recetas de cocina para uso personal.
      </p>

      <p>
        No se garantiza la exactitud nutricional de las recetas ni la ausencia de errores en los
        contenidos. Usa tu propio criterio y sentido común, especialmente en casos de alergias o
        intolerancias alimentarias.
      </p>

      <p>
        Nos reservamos el derecho a modificar o retirar contenidos, así como a actualizar estos
        términos cuando sea necesario. Te recomendamos revisarlos periódicamente.
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contacto</h2>
        <p>
          Si tienes dudas sobre estos términos o sobre el funcionamiento de la web, puedes ponerte en contacto
          conmigo a través de:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Teléfono:&nbsp;
            <a href="tel:+34684016685" className="text-[var(--primary)] hover:underline">
              +34 684 016 685
            </a>
          </li>
          <li>
            Correo electrónico:&nbsp;
            <a href="mailto:pedrodepedro.developer@gmail.com" className="text-[var(--primary)] hover:underline">
              pedrodepedro.developer@gmail.com
            </a>
          </li>
        </ul>
      </section>

      <div>
        <Link href="/" className="text-[var(--primary)] hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
