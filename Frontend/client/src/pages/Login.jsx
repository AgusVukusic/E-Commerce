import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    login,
    selectAuthLoading,
    selectAuthError,
    selectLoginSuccess,
    selectUserRole
} from "../redux/slices/authSlice";
import "../styles/auth.css";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Estado local del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estado de Redux
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const loginSuccess = useAppSelector(selectLoginSuccess);
    const userRole = useAppSelector(selectUserRole);

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    const intent = params.get("intent") || ""; // "cart" | "wishlist"

    // Redirigir cuando el login sea exitoso
    useEffect(() => {
        if (loginSuccess) {
            // Redirigir según el rol
            let redirectTo = redirect;
            if (userRole === "ADMIN") {
                redirectTo = "/admin";
            } else if (userRole === "VENDEDOR") {
                redirectTo = "/dashboard";
            }
            navigate(redirectTo, { replace: true });
        }
    }, [loginSuccess, userRole, navigate, redirect]);

    const onSubmit = async (e) => {
        e.preventDefault();
        // Dispatch del thunk de Redux
        dispatch(login({ email, password }));
    };

    return (
        <section className="auth-wrap">
            <div className="auth-left" style={{ backgroundImage: "url(/auth/login.jpg)" }}>
                <div className="auth-left-content">
                    <h1>Welcome back!</h1>
                    <p>Iniciá sesión y seguí jugando donde lo dejaste.</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2>Iniciá Sesión</h2>
                    <p className="auth-muted">Accedé con tu cuenta de PressPlay.</p>

                    {error && <div className="alert error">{error}</div>}
                    {loginSuccess && <div className="alert success">Inicio de sesión exitoso. Redirigiendo...</div>}

                    <form onSubmit={onSubmit}>
                        <div className="field">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="tuemail@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Ingresando..." : "Sign In"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        ¿Nuevo por acá?{" "}
                        <Link
                            to={`/register?redirect=${encodeURIComponent(redirect)}${intent ? `&intent=${intent}` : ""}`}
                        >
                            Crear una cuenta
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
