import NavbarClient from './NavbarClient';
import { getAuthWithRole } from '@/lib/auth';

export default async function Navbar() {
    const { user, isAdmin } = await getAuthWithRole();

    return <NavbarClient user={user} isAdmin={isAdmin} />;
}
