import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
    const supabase = await createClient(cookies());
    const { data: { user } } = await supabase.auth.getUser();

    return <NavbarClient user={user} />;
}
