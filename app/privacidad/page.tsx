import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Política de privacidad</h1>
      <p className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

      <p>
        En BocadoBoreal nos tomamos en serio tu privacidad. Los datos que se recojan a través del
        sitio (como el correo electrónico utilizado para registrarte) se utilizarán únicamente para
        ofrecerte el servicio y mejorar la experiencia de uso.
      </p>

      <p>
        No compartimos tus datos personales con terceros salvo obligación legal o para el correcto
        funcionamiento del servicio (por ejemplo, proveedores de infraestructura).
      </p>

      <p>
        Puedes solicitar información sobre tus datos o ejercer tus derechos de acceso, rectificación
        o eliminación contactando con nosotros.
      </p>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contacto sobre privacidad</h2>
        <p>
          Para cualquier cuestión relacionada con la privacidad o el tratamiento de datos personales,
          puedes contactar en:
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
