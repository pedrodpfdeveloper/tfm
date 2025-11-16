"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserWithRole, Role } from "@/lib/data";
import { changeUserRoleAction, createUserAction, deleteUserAction } from "./actions";

interface AdminDashboardClientProps {
  initialUsers: UserWithRole[];
  roles: Role[];
}

export default function AdminDashboardClient({ initialUsers, roles }: AdminDashboardClientProps) {
  const router = useRouter();

  const [users, setUsers] = useState<UserWithRole[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | number>("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRoleId, setCreateRoleId] = useState<number | null>(roles[0]?.id ?? null);
  const [isCreating, setIsCreating] = useState(false);

  const [changeUser, setChangeUser] = useState<UserWithRole | null>(null);
  const [changeRoleId, setChangeRoleId] = useState<number | null>(null);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const [deleteUser, setDeleteUser] = useState<UserWithRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search.trim() === "" || (u.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.roleId === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleOpenCreate = () => {
    setCreateEmail("");
    setCreatePassword("");
    setCreateRoleId(roles[0]?.id ?? null);
    setIsCreateOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (!createEmail || !createPassword || createRoleId == null) return;

    try {
      setIsCreating(true);
      const formData = new FormData();
      formData.append("email", createEmail);
      formData.append("password", createPassword);
      formData.append("roleId", String(createRoleId));

      await createUserAction(formData);

      setIsCreateOpen(false);
      setCreateEmail("");
      setCreatePassword("");

      router.refresh();
    } catch (error) {
      console.error("Error creating user", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChangeRole = (user: UserWithRole) => {
    setChangeUser(user);
    setChangeRoleId(user.roleId);
  };

  const handleConfirmChangeRole = async () => {
    if (!changeUser || changeRoleId == null) return;

    try {
      setIsChangingRole(true);
      const formData = new FormData();
      formData.append("userId", changeUser.id);
      formData.append("roleId", String(changeRoleId));

      await changeUserRoleAction(formData);

      const roleName = roles.find((r) => r.id === changeRoleId)?.name ?? null;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === changeUser.id
            ? {
                ...u,
                roleId: changeRoleId,
                roles: roleName ? [{ name: roleName }] : [],
              }
            : u,
        ),
      );

      setChangeUser(null);
    } catch (error) {
      console.error("Error changing user role", error);
    } finally {
      setIsChangingRole(false);
    }
  };

  const handleOpenDeleteUser = (user: UserWithRole) => {
    setDeleteUser(user);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("userId", deleteUser.id);

      await deleteUserAction(formData);

      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch (error) {
      console.error("Error deleting user", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <section className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col min-w-[220px]">
          <label className="text-sm font-medium mb-1" htmlFor="search-email">
            Buscar por correo
          </label>
          <input
            id="search-email"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ej. usuario@correo.com"
            className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background)]"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-sm font-medium mb-1" htmlFor="filter-role">
            Filtrar por rol
          </label>
          <select
            id="filter-role"
            value={roleFilter === "all" ? "all" : String(roleFilter)}
            onChange={(e) => {
              const value = e.target.value;
              setRoleFilter(value === "all" ? "all" : Number(value));
            }}
            className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background)]"
          >
            <option value="all">Todos</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--background)] font-medium hover:bg-[var(--primary-600)] transition-colors"
        >
          Nuevo usuario
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
        {filteredUsers.length === 0 ? (
          <p className="text-sm text-[var(--text-color)]/80">No hay usuarios que coincidan con la búsqueda.</p>
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
                {filteredUsers.map((u) => (
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
                    <td className="px-4 py-2 border-b border-[var(--gray-100)] space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenChangeRole(u)}
                        className="px-2 py-1 rounded-md bg-[var(--primary)] text-[var(--background)] text-xs font-medium hover:bg-[var(--primary-600)] transition-colors"
                      >
                        Cambiar rol
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteUser(u)}
                        className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal crear usuario */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--background)] rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Crear nuevo usuario</h3>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1" htmlFor="modal-email">
                  Correo electrónico
                </label>
                <input
                  id="modal-email"
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background-50)]"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1" htmlFor="modal-password">
                  Contraseña
                </label>
                <input
                  id="modal-password"
                  type="password"
                  minLength={6}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background-50)]"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1" htmlFor="modal-role">
                  Rol
                </label>
                <select
                  id="modal-role"
                  value={createRoleId == null ? "" : String(createRoleId)}
                  onChange={(e) =>
                    setCreateRoleId(e.target.value === "" ? null : Number(e.target.value))
                  }
                  className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background-50)]"
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-md border border-[var(--gray-300)] text-sm"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCreate}
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--background)] text-sm font-medium hover:bg-[var(--primary-600)] transition-colors disabled:opacity-60"
                disabled={isCreating}
              >
                {isCreating ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {changeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--background)] rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Cambiar rol</h3>
            <p className="text-sm mb-4">
              Usuario: <span className="font-medium">{changeUser.email ?? "(sin email)"}</span>
            </p>
            <div className="flex flex-col mb-6">
              <label className="text-sm font-medium mb-1" htmlFor="change-role-select">
                Nuevo rol
              </label>
              <select
                id="change-role-select"
                value={changeRoleId == null ? "" : String(changeRoleId)}
                onChange={(e) =>
                  setChangeRoleId(e.target.value === "" ? null : Number(e.target.value))
                }
                className="px-3 py-2 border border-[var(--gray-300)] rounded-md bg-[var(--background-50)]"
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setChangeUser(null)}
                className="px-4 py-2 rounded-md border border-[var(--gray-300)] text-sm"
                disabled={isChangingRole}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmChangeRole}
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--background)] text-sm font-medium hover:bg-[var(--primary-600)] transition-colors disabled:opacity-60"
                disabled={isChangingRole || changeRoleId == null}
              >
                {isChangingRole ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--background)] rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Eliminar usuario</h3>
            <p className="text-sm mb-6">
              ¿Seguro que quieres eliminar al usuario
              {" "}
              <span className="font-medium">{deleteUser.email ?? "(sin email)"}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="px-4 py-2 rounded-md border border-[var(--gray-300)] text-sm"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
