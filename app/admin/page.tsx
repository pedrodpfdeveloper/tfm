import { getAuthWithRole } from "@/lib/auth";
import { getAllRoles, getAllUsersWithRoles } from "@/lib/data";
import { redirect } from "next/navigation";
import { changeUserRoleAction, createUserAction, deleteUserAction } from "./actions";

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

            <section className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Crear usuario</h2>
                <form action={createUserAction} className="flex flex-wrap gap-4 items-end border border-[var(--gray-200)] rounded-lg p-4 bg-[var(--background-50)]">
                    <div className="flex flex-col min-w-[200px]">
                        <label className="text-sm font-medium mb-1" htmlFor="new-email">Correo electrónico</label>
                        <input
                            id="new-email"
                            name="email"
                            type="email"
                            required
                            className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background)]"
                        />
                    </div>
                    <div className="flex flex-col min-w-[160px]">
                        <label className="text-sm font-medium mb-1" htmlFor="new-password">Contraseña</label>
                        <input
                            id="new-password"
                            name="password"
                            type="password"
                            minLength={6}
                            required
                            className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background)]"
                        />
                    </div>
                    <div className="flex flex-col min-w-[160px]">
                        <label className="text-sm font-medium mb-1" htmlFor="new-role">Rol</label>
                        <select
                            id="new-role"
                            name="roleId"
                            className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background)]"
                            defaultValue={roles[0]?.id?.toString() ?? ""}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--background)] font-medium hover:bg-[var(--primary-600)] transition-colors"
                    >
                        Crear usuario
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
                {users.length === 0 ? (
                    <p className="text-sm text-[var(--text-color)]/80">No hay usuarios registrados.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border border-[var(--gray-200)] rounded-lg overflow-hidden">
                            <thead className="bg-[var(--background-50)]">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b border-[var(--gray-200)]">Correo electrónico</th>
                                    <th className="px-4 py-2 text-left border-b border-[var(--gray-200)]">Rol actual</th>
                                    <th className="px-4 py-2 text-left border-b border-[var(--gray-200)]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-[var(--primary-50)] transition-colors">
                                        <td className="px-4 py-2 border-b border-[var(--gray-100)]">
                                            <span className="font-medium" title={u.id}>
                                                {u.email ?? "(sin email)"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-b border-[var(--gray-100)]">
                                            {u.roles.length === 0
                                                ? "Sin rol"
                                                : u.roles.map((r) => r.name ?? "(sin nombre)").join(", ")}
                                        </td>
                                        <td className="px-4 py-2 border-b border-[var(--gray-100)] space-y-2">
                                            <form action={changeUserRoleAction} className="flex flex-wrap gap-2 items-center">
                                                <input type="hidden" name="userId" value={u.id} />
                                                <select
                                                    name="roleId"
                                                    defaultValue={u.roleId.toString()}
                                                    className="px-2 py-1 border border-[var(--gray-300)] rounded-md bg-[var(--background)] text-xs"
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>{role.name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="submit"
                                                    className="px-2 py-1 rounded-md bg-[var(--primary)] text-[var(--background)] text-xs font-medium hover:bg-[var(--primary-600)] transition-colors"
                                                >
                                                    Cambiar rol
                                                </button>
                                            </form>

                                            <form action={deleteUserAction} className="inline-block">
                                                <input type="hidden" name="userId" value={u.id} />
                                                <button
                                                    type="submit"
                                                    className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
