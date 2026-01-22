import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../components/vendedor/ProductList";
import CategoriasList from "../components/vendedor/CategoriasList";
import DescuentosList from "../components/vendedor/DescuentosList";
import "../styles/dashboard.css";

const TABS = [
    { key: "productos", label: "Productos" },
    { key: "categorias", label: "Categorías" },
    { key: "descuentos", label: "Descuentos" },
];

export default function Dashboard() {
    const [tab, setTab] = useState("productos");
    const navigate = useNavigate();

    const handleCreateProduct = () => {
        navigate('/dashboard/producto/crear');
    };

    return (
        <section className="dash-wrap">
            <nav className="dash-tabs">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={`dash-tab-btn ${tab === t.key ? "is-active" : ""}`}
                        onClick={() => setTab(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </nav>

            <div className="dash-panel">
                {tab === "productos" && (
                    <div className="productos-panel">
                        <div className="productos-header">
                            <div className="productos-title">
                                <h2>Productos</h2>
                                <p>Gestiona tu catálogo de productos</p>
                            </div>
                            <button
                                onClick={handleCreateProduct}
                                className="btn-primary"
                            >
                                Crear producto
                            </button>
                        </div>
                        <ProductList />
                    </div>
                )}

                {tab === "categorias" && (
                    <CategoriasList />
                )}

                {tab === "descuentos" && (
                    <DescuentosList />
                )}
            </div>
        </section>
    );
}
