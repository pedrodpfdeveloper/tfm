import Link from "next/link";

export default function ContactoPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-lg text-[var(--text)]/80">
        Si tienes dudas, sugerencias o quieres ponerte en contacto conmigo sobre BocadoBoreal, puedes hacerlo a través de:
      </p>

      <div className="space-y-2">
        <p className="text-base">
          Teléfono:&nbsp;
          <a href="tel:+34684016685" className="text-[var(--primary)] font-semibold hover:underline">
            +34 684 016 685
          </a>
        </p>
        <p className="text-base">
          Correo electrónico:&nbsp;
          <a href="mailto:pedrodepedro.developer@gmail.com" className="text-[var(--primary)] font-semibold hover:underline">
            pedrodepedro.developer@gmail.com
          </a>
        </p>
      </div>

      <p className="text-sm text-[var(--text)]/70">
        Intentaré responderte lo antes posible. Gracias por usar BocadoBoreal.
      </p>

      <div>
        <Link href="/" className="text-[var(--primary)] hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
