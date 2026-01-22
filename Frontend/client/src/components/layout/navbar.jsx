import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser, logout as logoutAction } from "../../redux/slices/authSlice";
import { selectCartCount, resetCart } from "../../redux/slices/cartSlice";
import { selectWishlistCount, resetWishlist } from "../../redux/slices/wishlistSlice";
import "../../styles/navbar.css";
import Logo from "../../assets/Logo-big.png";

export default function Navbar() {
    const [q, setQ] = useState("");
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Leer estado de Redux
    const user = useAppSelector(selectUser);
    const cartCount = useAppSelector(selectCartCount);
    const wishlistCount = useAppSelector(selectWishlistCount);

    const onSubmit = (e) => {
        e.preventDefault();
        const term = q.trim();
        if (!term) return;
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    useEffect(() => {
        const onDocClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const handleUserClick = () => {
        if (!user) return navigate("/login");  // sin sesion -> ir a login
        setOpen((s) => !s);                    // con sesion -> abrir/cerrar menu
    };

    const handleLogout = async () => {
        // Limpiar carrito y wishlist antes del logout
        dispatch(resetCart());
        dispatch(resetWishlist());
        // Hacer logout (puede fallar con 500, pero limpiamos localmente)
        await dispatch(logoutAction());
        setOpen(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                {/* Izquierda */}
                <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <img src={Logo} alt="PressPlay logo" />
                    <span className="brand__name">PressPlay™</span>
                </div>

                {/* Centro */}
                {user && user.rol === "ADMIN" ? (
                    <>
                        <div className="navbar-vendedor-title">
                            <h1>Panel de Administración</h1>
                            <p>Gestión completa del sistema.</p>
                        </div>
                        <div></div> {/* Placeholder para mantener el grid */}
                    </>
                ) : user && user.rol === "VENDEDOR" ? (
                    <>
                        <div className="navbar-vendedor-title">
                            <h1>Panel de vendedor</h1>
                            <p>Gestioná tu catálogo desde un solo lugar.</p>
                        </div>
                        <div></div> {/* Placeholder para mantener el grid */}
                    </>
                ) : (
                    <div className="search">
                        <form onSubmit={onSubmit} role="search" aria-label="Buscar juegos">
                            <div className="search-icon-left">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                                </svg>
                            </div>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Buscar juegos, géneros, ofertas..."
                                aria-label="Buscar"
                            />
                            <button type="submit" aria-label="Buscar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}

                {/* Derecha */}
                <div className="actions">
                    {/* Solo mostrar botones de wishlist y carrito si el usuario no es vendedor ni admin */}
                    {(!user || (user.rol !== "VENDEDOR" && user.rol !== "ADMIN")) && (
                        <>
                            <button className="iconBtn" aria-label="Wishlist" onClick={() => navigate("/wishlist")}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>

                            <button className="iconBtn icon-with-badge" aria-label="Carrito" onClick={() => navigate("/cart")}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="9" cy="21" r="1" strokeWidth="2" />
                                    <circle cx="20" cy="21" r="1" strokeWidth="2" />
                                    <path strokeWidth="2" d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h8.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="badge">{cartCount}</span>
                                )}
                            </button>
                        </>
                    )}

                    {/* Usuario */}
                    <div className="user-menu-wrap" ref={menuRef}>
                        <button
                            className="iconBtn"
                            aria-label={user ? "Cuenta" : "Iniciar sesión / Registrarse"}
                            onClick={() => (user ? setOpen((s) => !s) : navigate("/login"))}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" strokeWidth="2" />
                            </svg>
                        </button>

                        {user && open && (
                            <div className="user-menu" role="menu" aria-label="Menú de usuario">
                                <div className="user-menu-header">
                                    <div className="user-menu-name">
                                        {user.nombre && user.apellido
                                            ? `${user.nombre} ${user.apellido}`
                                            : user.username
                                        }
                                    </div>
                                    <div className="user-menu-email">{user.email}</div>
                                </div>

                                <div className="user-menu-divider"></div>

                                {user.rol === "ADMIN" && (
                                    <div
                                        className="user-item"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate("/admin");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7" />
                                            <rect x="14" y="3" width="7" height="7" />
                                            <rect x="14" y="14" width="7" height="7" />
                                            <rect x="3" y="14" width="7" height="7" />
                                        </svg>
                                        Panel de Admin
                                    </div>
                                )}

                                {user.rol === "VENDEDOR" && (
                                    <div
                                        className="user-item"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate("/dashboard");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7" />
                                            <rect x="14" y="3" width="7" height="7" />
                                            <rect x="14" y="14" width="7" height="7" />
                                            <rect x="3" y="14" width="7" height="7" />
                                        </svg>
                                        Dashboard
                                    </div>
                                )}

                                {(user.rol === "COMPRADOR" || !user.rol) && (
                                    <div
                                        className="user-item"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate("/orders");
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2z" />
                                        </svg>
                                        Mis Órdenes
                                    </div>
                                )}

                                <div
                                    className="user-item"
                                    onClick={() => {
                                        setOpen(false);
                                        navigate("/profile");
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Perfil
                                </div>

                                <div
                                    className="user-item danger"
                                    onClick={async () => {
                                        // Limpiar carrito y wishlist antes del logout
                                        dispatch(resetCart());
                                        dispatch(resetWishlist());
                                        // Hacer logout (puede fallar con 500, pero limpiamos localmente)
                                        await dispatch(logoutAction());
                                        setOpen(false);
                                        window.alert("Sesión cerrada exitosamente.");
                                        navigate("/");
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Cerrar sesión
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
