import { Link, useNavigate } from "react-router-dom";
// Redux imports
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import "../styles/profile.css";

export default function Profile() {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="profile-page">
                <div className="container">
                    <div className="alert error">
                        <strong>Acceso Denegado</strong>
                        <p>Debes iniciar sesión para ver tu perfil</p>
                        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        );
    }

    const getRoleDisplayName = (rol) => {
        switch (rol) {
            case "COMPRADOR":
                return "Comprador";
            case "VENDEDOR":
                return "Vendedor";
            case "ADMIN":
                return "Administrador";
            default:
                return rol;
        }
    };

    const getInitials = (nombre, apellido, username) => {
        if (nombre && apellido) {
            return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
        }
        return username ? username.substring(0, 2).toUpperCase() : "US";
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-container">
                    {/* Lado Izquierdo - Info Principal */}
                    <div className="profile-left">
                        <div className="profile-avatar">
                            <div className="avatar-circle">
                                {getInitials(user.nombre, user.apellido, user.username)}
                            </div>
                        </div>

                        <div className="profile-main-info">
                            <h1 className="profile-name">
                                {user.nombre && user.apellido
                                    ? `${user.nombre} ${user.apellido}`
                                    : user.username
                                }
                            </h1>
                            <p className="profile-email">{user.email}</p>
                            <span className={`profile-role profile-role--${user.rol?.toLowerCase()}`}>
                                {getRoleDisplayName(user.rol)}
                            </span>
                        </div>


                    </div>

                    {/* Lado Derecho - Detalles y Acciones */}
                    <div className="profile-right">
                        <div className="profile-section">
                            <h3 className="profile-section-title">Información Personal</h3>
                            <div className="profile-details">
                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Nombre de usuario:</span>
                                    <span className="profile-detail-value">{user.username}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Email:</span>
                                    <span className="profile-detail-value">{user.email}</span>
                                </div>
                                {user.nombre && (
                                    <div className="profile-detail-item">
                                        <span className="profile-detail-label">Nombre:</span>
                                        <span className="profile-detail-value">{user.nombre}</span>
                                    </div>
                                )}
                                {user.apellido && (
                                    <div className="profile-detail-item">
                                        <span className="profile-detail-label">Apellido:</span>
                                        <span className="profile-detail-value">{user.apellido}</span>
                                    </div>
                                )}
                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">Rol:</span>
                                    <span className="profile-detail-value">{getRoleDisplayName(user.rol)}</span>
                                </div>
                                <div className="profile-detail-item">
                                    <span className="profile-detail-label">ID de usuario:</span>
                                    <span className="profile-detail-value">{user.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sección de Órdenes */}
                        {user.rol === "COMPRADOR" && (
                            <div className="profile-section">
                                <h3 className="profile-section-title">Mis Compras</h3>
                                <div className="profile-actions">
                                    <Link to="/orders" className="profile-action-btn profile-action-btn--primary">
                                        Ver Órdenes
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Sección de Ventas (para vendedores) */}
                        {user.rol === "VENDEDOR" && (
                            <div className="profile-section">
                                <h3 className="profile-section-title">Mi Negocio</h3>
                                <div className="profile-actions">
                                    <Link to="/dashboard" className="profile-action-btn profile-action-btn--secondary">
                                        Dashboard Vendedor
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}