import { useEffect, useState } from "react";
// Redux imports
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/authSlice";
import {
    fetchUsuarios,
    promoteUser,
    demoteUser,
    selectUsuarios,
    selectUsuariosLoading,
    selectUsuariosError,
    selectUsuariosPagination,
} from "../../redux/slices/usuariosSlice";
import Toast from "../common/Toast";

export default function UsersList() {
    const dispatch = useAppDispatch();

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const usuarios = useAppSelector(selectUsuarios);
    const loading = useAppSelector(selectUsuariosLoading);
    const error = useAppSelector(selectUsuariosError);
    const pagination = useAppSelector(selectUsuariosPagination);

    // Estado local para toast
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        message: "",
        type: "success"
    });

    useEffect(() => {
        if (user?.token) {
            dispatch(fetchUsuarios({ page: 0, size: 20 }));
        }
    }, [user, dispatch]);

    // Mostrar errores con toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    const handlePromover = async (usuario) => {
        if (!window.confirm(`¿Promover a ${usuario.username} a ADMIN?`)) return;

        const result = await dispatch(promoteUser(usuario.id));

        if (result.type === 'usuarios/promoteUser/fulfilled') {
            setToastConfig({ message: `✓ ${usuario.username} promovido a ADMIN`, type: "success" });
            setShowToast(true);
            setTimeout(() => {
                dispatch(fetchUsuarios({ page: pagination.page, size: 20 }));
            }, 500);
        } else if (result.type === 'usuarios/promoteUser/rejected') {
            setToastConfig({ message: result.payload || "Error al promover usuario", type: "error" });
            setShowToast(true);
        }
    };

    const handleDegradar = async (usuario) => {
        if (!window.confirm(`¿Degradar a ${usuario.username} a VENDEDOR?`)) return;

        const result = await dispatch(demoteUser(usuario.id));

        if (result.type === 'usuarios/demoteUser/fulfilled') {
            setToastConfig({ message: `✓ ${usuario.username} degradado a VENDEDOR`, type: "success" });
            setShowToast(true);
            setTimeout(() => {
                dispatch(fetchUsuarios({ page: pagination.page, size: 20 }));
            }, 500);
        } else if (result.type === 'usuarios/demoteUser/rejected') {
            setToastConfig({ message: result.payload || "Error al degradar usuario", type: "error" });
            setShowToast(true);
        }
    };

    const getRolBadgeClass = (rol) => {
        switch (rol) {
            case "ADMIN": return "rol-badge rol-admin";
            case "VENDEDOR": return "rol-badge rol-vendedor";
            case "COMPRADOR": return "rol-badge rol-comprador";
            default: return "rol-badge";
        }
    };

    if (loading) {
        return <div className="loading-state">Cargando usuarios...</div>;
    }

    return (
        <div className="users-list-container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="users-stats">
                <p>Total de usuarios: <strong>{pagination.totalElements}</strong></p>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td className="username-cell">{usuario.username}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.telefono}</td>
                                <td className="direccion-cell">{usuario.direccion}</td>
                                <td>
                                    <span className={getRolBadgeClass(usuario.rol)}>
                                        {usuario.rol}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    {usuario.rol === "VENDEDOR" && (
                                        <button
                                            onClick={() => handlePromover(usuario)}
                                            className="btn-action btn-promote"
                                            title="Promover a ADMIN"
                                        >
                                            Promover
                                        </button>
                                    )}
                                    {usuario.rol === "ADMIN" && (
                                        <button
                                            onClick={() => handleDegradar(usuario)}
                                            className="btn-action btn-demote"
                                            title={usuario.id === 1 ? "No se puede degradar al administrador principal" : "Degradar a VENDEDOR"}
                                            disabled={usuario.id === 1}
                                        >
                                            Degradar
                                        </button>
                                    )}
                                    {usuario.rol === "COMPRADOR" && (
                                        <span className="no-action">Sin acciones</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => dispatch(fetchUsuarios({ page: pagination.page - 1, size: 20 }))}
                        disabled={pagination.page === 0}
                        className="pagination-btn"
                    >
                        ← Anterior
                    </button>
                    <span className="pagination-info">
                        Página {pagination.page + 1} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => dispatch(fetchUsuarios({ page: pagination.page + 1, size: 20 }))}
                        disabled={pagination.page >= pagination.totalPages - 1}
                        className="pagination-btn"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
}
