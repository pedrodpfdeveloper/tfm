import { getAuthWithRole } from "@/lib/auth";
import { getAllRoles, getAllUsersWithRoles } from "@/lib/data";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage() {
    const { user, isAdmin } = await getAuthWithRole();

    if (!user || !isAdmin) {
        redirect("/");
    }

    const [users, roles] = await Promise.all([
        getAllUsersWithRoles(),
        getAllRoles(),
    ]);

    return (
        <div className="max-w-[88rem] mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Panel de administración</h1>
            <AdminDashboardClient initialUsers={users} roles={roles} />
        </div>
    );
}
