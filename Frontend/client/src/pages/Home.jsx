import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProductos, selectProducts, selectProductsLoading, selectProductsError } from "../redux/slices/productsSlice";
import HeroShowcase from "../components/home/HeroShowcase";
import GameCard from "../components/games/gameCard";
import "../styles/home.css";

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Estado de Redux
    const raw = useAppSelector(selectProducts) || [];
    const loading = useAppSelector(selectProductsLoading);
    const err = useAppSelector(selectProductsError);

    const [page, setPage] = useState(0);
    const pageSize = 12;


    const [categoriaId, setCategoriaId] = useState(""); // string para select
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [soloConDescuento, setSoloConDescuento] = useState(false);
    const [sortBy, setSortBy] = useState("relevancia"); // relevancia|precio|titulo|stock
    const [sortDir, setSortDir] = useState("asc");

    // Fetch inicial usando Redux - solo si no hay productos cargados
    useEffect(() => {
        if (raw.length === 0 && !loading) {
            dispatch(fetchProductos({ page: 0, size: 200 }));
        }
    }, []); // Sin dependencias - solo se ejecuta al montar

    // cats
    const categorias = useMemo(() => {
        const set = new Map();
        raw.forEach(p => {
            if (p?.categoriaId != null && p?.categoriaNombre) {
                set.set(p.categoriaId, p.categoriaNombre);
            }
        });
        return Array.from(set.entries())
            .map(([id, nombre]) => ({ id, nombre }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [raw]);

    // Filtros + orden
    const filtrados = useMemo(() => {
        let list = [...raw];

        // categoría
        if (categoriaId !== "") {
            const cat = Number(categoriaId);
            list = list.filter(p => p.categoriaId === cat);
        }

        // precio efectivo
        const precioEfectivo = (p) =>
            p?.tieneDescuento && typeof p?.precioConDescuento === "number"
                ? p.precioConDescuento
                : p.precio;

        const parseNum = (v) => (v === "" || v === null || v === undefined) ? undefined : Number(v);
        const min = parseNum(precioMin);
        const max = parseNum(precioMax);

        if (typeof min === "number" && !Number.isNaN(min)) {
            list = list.filter(p => precioEfectivo(p) >= min);
        }
        if (typeof max === "number" && !Number.isNaN(max)) {
            list = list.filter(p => precioEfectivo(p) <= max);
        }

        // solo con descuento
        if (soloConDescuento) list = list.filter(p => p.tieneDescuento);

        // orden
        if (sortBy !== "relevancia") {
            const dir = sortDir === "desc" ? -1 : 1;
            list.sort((a, b) => {
                let va, vb;
                switch (sortBy) {
                    case "precio":
                        va = precioEfectivo(a); vb = precioEfectivo(b);
                        break;
                    case "titulo":
                        va = (a.titulo || ""); vb = (b.titulo || "");
                        return va.localeCompare(vb) * dir;
                    case "stock":
                        va = a.stock ?? 0; vb = b.stock ?? 0;
                        break;
                    default:
                        va = 0; vb = 0;
                }
                if (va < vb) return -1 * dir;
                if (va > vb) return 1 * dir;
                return 0;
            });
        }

        return list;
    }, [raw, categoriaId, precioMin, precioMax, soloConDescuento, sortBy, sortDir]);

    // reset page al cambiar filtros
    useEffect(() => { setPage(0); },
        [categoriaId, precioMin, precioMax, soloConDescuento, sortBy, sortDir]);

    const total = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = page * pageSize;
    const items = filtrados.slice(start, start + pageSize);

    return (
        <>
            <HeroShowcase />

            <section id="games-section" className="games-section">
                <div className="games-header">
                    <h2>Juegos destacados</h2>
                    <p>Explorá los títulos más populares y los últimos lanzamientos de PressPlay.</p>
                </div>

                <aside className="filters-card filters-sticky">
                    <div className="filters-head">
                        <h3>Filtros</h3>
                        <button
                            className="btn-link"
                            onClick={() => {
                                setCategoriaId("");
                                setPrecioMin("");
                                setPrecioMax("");
                                setSoloConDescuento(false);
                                setSortBy("relevancia");
                                setSortDir("asc");
                                setPage(0);
                            }}
                        >
                            Reiniciar
                        </button>
                    </div>

                    <div className="filters-grid">
                        <div className="ui-field">
                            <label className="ui-label">Categoría</label>
                            <div className="ui-input-wrap">
                                <select
                                    className="ui-input ui-select"
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                <span className="ui-select-caret">▾</span>
                            </div>
                        </div>

                        <div className="ui-field">
                            <label className="ui-label">Precio mín.</label>
                            <div className="ui-input-group">
                                <span className="ui-prefix">$</span>
                                <input
                                    className="ui-input"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Ej: 10000"
                                    value={precioMin}
                                    onChange={(e) => setPrecioMin(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="ui-field">
                            <label className="ui-label">Precio máx.</label>
                            <div className="ui-input-group">
                                <span className="ui-prefix">$</span>
                                <input
                                    className="ui-input"
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="Ej: 80000"
                                    value={precioMax}
                                    onChange={(e) => setPrecioMax(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="ui-field">
                            <label className="ui-label">Ordenar</label>
                            <div className="ui-input-wrap">
                                <select
                                    className="ui-input ui-select"
                                    value={`${sortBy}|${sortDir}`}
                                    onChange={(e) => {
                                        const [sb, sd] = e.target.value.split("|");
                                        setSortBy(sb);
                                        setSortDir(sd);
                                    }}
                                >
                                    <option value="relevancia|asc">Relevancia</option>
                                    <option value="precio|asc">Precio ↑</option>
                                    <option value="precio|desc">Precio ↓</option>
                                    <option value="titulo|asc">Título A–Z</option>
                                    <option value="titulo|desc">Título Z–A</option>
                                </select>
                                <span className="ui-select-caret">▾</span>
                            </div>
                        </div>

                        <div className="ui-field ui-field--switch">
                            <label className="ui-label">Promociones</label>
                            <label className="ui-switch">
                                <input
                                    type="checkbox"
                                    checked={soloConDescuento}
                                    onChange={(e) => setSoloConDescuento(e.target.checked)}
                                />
                                <span className="track"><span className="thumb" /></span>
                                <span className="switch-text">Solo con descuento</span>
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Contenido */}
                {loading ? (
                    <p>Cargando juegos disponibles…</p>
                ) : err ? (
                    <p style={{ color: "#b91c1c" }}>{err}</p>
                ) : items.length === 0 ? (
                    <p>No hay productos disponibles.</p>
                ) : (
                    <>
                        <div className="games-grid">
                            {items.map((p) => (
                                <GameCard key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                            ))}
                        </div>

                        <div className="pager">
                            <button disabled={page === 0} onClick={() => setPage((n) => Math.max(0, n - 1))}>
                                ◀ Anterior
                            </button>
                            <span> Página {page + 1} de {totalPages} </span>
                            <button disabled={page + 1 >= totalPages} onClick={() => setPage((n) => n + 1)}>
                                Siguiente ▶
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}
