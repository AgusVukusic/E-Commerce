import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    searchProductos,
    selectSearchResults,
    selectSearchLoading,
    selectSearchError,
    clearSearchResults
} from "../redux/slices/productsSlice";
import GameCard from "../components/games/gameCard";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Search() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const q = useQuery().get("q") || "";
    const [page, setPage] = useState(0);
    
    // Estado de Redux
    const pageData = useAppSelector(selectSearchResults);
    const loading = useAppSelector(selectSearchLoading);
    const err = useAppSelector(selectSearchError);

    const size = 12;

    useEffect(() => setPage(0), [q]);

    useEffect(() => {
        if (!q) {
            dispatch(clearSearchResults());
            return;
        }
        dispatch(searchProductos({ titulo: q, page, size }));
    }, [q, page, dispatch]);

    return (
        <section className="games-section">
            <div className="games-header">
                <h2>🔎 Resultados para “{q}”</h2>
            </div>

            {!q ? (
                <p>Ingresá un término en la búsqueda.</p>
            ) : loading ? (
                <p>Buscando…</p>
            ) : err ? (
                <p style={{ color: "#b91c1c" }}>{err}</p>
            ) : !pageData || pageData.content?.length === 0 ? (
                <p>No se encontraron resultados.</p>
            ) : (
                <>
                    <div className="games-grid">
                        {pageData.content.map((p) => (
                            <GameCard key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                        ))}
                    </div>

                    <div className="pager">
                        <button disabled={page === 0} onClick={() => setPage((n) => Math.max(0, n - 1))}>
                            ◀ Anterior
                        </button>
                        <span>
                            Página {pageData.number + 1} de {pageData.totalPages || 1}
                        </span>
                        <button disabled={pageData.last} onClick={() => setPage((n) => n + 1)}>
                            Siguiente ▶
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
