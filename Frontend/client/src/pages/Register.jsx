import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    register,
    selectAuthLoading,
    selectAuthError,
    selectRegisterSuccess,
    selectUserRole
} from "../redux/slices/authSlice";
import "../styles/auth.css";

const initial = {
    username: "", email: "", password: "",
    nombre: "", apellido: "", telefono: "", direccion: "",
    rol: "COMPRADOR",
};

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [form, setForm] = useState(initial);

    // Estado de Redux
    const loading = useAppSelector(selectAuthLoading);
    const error = useAppSelector(selectAuthError);
    const registerSuccess = useAppSelector(selectRegisterSuccess);
    const userRole = useAppSelector(selectUserRole);

    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    // Redirigir cuando el registro sea exitoso
    useEffect(() => {
        if (registerSuccess) {
            // Redirigir según el rol
            setTimeout(() => {
                let redirectTo = "/";
                if (userRole === "ADMIN") {
                    redirectTo = "/admin";
                } else if (userRole === "VENDEDOR") {
                    redirectTo = "/dashboard";
                }
                navigate(redirectTo);
            }, 900);
        }
    }, [registerSuccess, userRole, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(register(form));
    };

    return (
        <section className="auth-wrap">
            <div className="auth-left" style={{ backgroundImage: "url(/auth/register.jpg)" }}>
                <div className="auth-left-content">
                    <h1>Getting Started</h1>
                    <p>Sumate a la tienda líder en venta de videojuegos. ¡Tu próxima aventura te espera!</p>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <h2>Crear cuenta</h2>
                    <p className="auth-muted">Completá tus datos para registrarte.</p>

                    {error && <div className="alert error">{error}</div>}
                    {registerSuccess && <div className="alert success">Cuenta creada. Redirigiendo...</div>}

                    <form onSubmit={onSubmit}>
                        <div className="field"><label>Username</label>
                            <input value={form.username} onChange={(e) => set("username", e.target.value)} required minLength={3} maxLength={50} /></div>
                        <div className="field"><label>Email</label>
                            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required maxLength={100} /></div>
                        <div className="field"><label>Contraseña</label>
                            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={6} maxLength={100} /></div>
                        <div className="field"><label>Nombre</label>
                            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required minLength={2} maxLength={50} /></div>
                        <div className="field"><label>Apellido</label>
                            <input value={form.apellido} onChange={(e) => set("apellido", e.target.value)} required minLength={2} maxLength={50} /></div>
                        <div className="field"><label>Teléfono</label>
                            <input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} required minLength={8} maxLength={20} /></div>
                        <div className="field"><label>Dirección</label>
                            <input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} required minLength={5} maxLength={200} /></div>
                        <div className="field"><label>Rol</label>
                            <select value={form.rol} onChange={(e) => set("rol", e.target.value)}>
                                <option value="COMPRADOR">Comprador</option>
                                <option value="VENDEDOR">Vendedor</option>
                            </select>
                        </div>

                        <button className="btn-primary" type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Registrarme"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
