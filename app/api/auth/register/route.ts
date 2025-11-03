import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password, captchaToken } = await request.json();

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${recaptchaSecret}&response=${captchaToken}`,
    });

    const captchaValidation = await response.json();

    if (!captchaValidation.success) {
        return NextResponse.json(
            { message: 'Verificación de CAPTCHA fallida.' },
            { status: 400 }
        );
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
    });

    if (error) {
        console.error('Error de Supabase:', error);
        return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Usuario creado con éxito', user: data.user }, { status: 201 });
}