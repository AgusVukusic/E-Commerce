import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/vendedor/ProductList";
import CategoriasList from "../components/vendedor/CategoriasList";
import DescuentosList from "../components/vendedor/DescuentosList";
import UsersList from "../components/admin/UsersList";
import AdminOrdersList from "../components/admin/AdminOrdersList";
import "../styles/adminDashboard.css";

const TABS = [
    { key: "usuarios", label: "Usuarios" },
    { key: "productos", label: "Productos" },
    { key: "ordenes", label: "Órdenes" },
    { key: "categorias", label: "Categorías" },
    { key: "descuentos", label: "Descuentos" },
];

export default function AdminDashboard() {
    const [tab, setTab] = useState("usuarios");
    const navigate = useNavigate();

    const handleCreateProduct = () => {
        navigate('/admin/producto/crear');
    };

    return (
        <section className="admin-dash-wrap">
            <nav className="admin-tabs">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={`admin-tab-btn ${tab === t.key ? "is-active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        <span className="tab-label">{t.label}</span>
                    </button>
                ))}
            </nav>

            <div className="admin-panel">
                {tab === "usuarios" && (
                    <div className="panel-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2>Gestión de Usuarios</h2>
                                <p>Administra roles y permisos de usuarios</p>
                            </div>
                        </div>
                        <UsersList />
                    </div>
                )}

                {tab === "productos" && (
                    <div className="panel-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2>Gestión de Productos</h2>
                                <p>Administra el catálogo completo de productos</p>
                            </div>
                            <button
                                onClick={handleCreateProduct}
                                className="btn-primary-admin"
                            >
                                + Crear producto
                            </button>
                        </div>
                        <ProductList />
                    </div>
                )}

                {tab === "ordenes" && (
                    <div className="panel-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2>Todas las Órdenes</h2>
                                <p>Consulta todas las órdenes realizadas en la plataforma</p>
                            </div>
                        </div>
                        <AdminOrdersList />
                    </div>
                )}

                {tab === "categorias" && (
                    <div className="panel-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2>Gestión de Categorías</h2>
                                <p>Organiza y administra las categorías de productos</p>
                            </div>
                        </div>
                        <CategoriasList />
                    </div>
                )}

                {tab === "descuentos" && (
                    <div className="panel-section">
                        <div className="section-header">
                            <div className="section-title">
                                <h2>Gestión de Descuentos</h2>
                                <p>Crea y administra descuentos para productos</p>
                            </div>
                        </div>
                        <DescuentosList />
                    </div>
                )}
            </div>
        </section>
    );
}
