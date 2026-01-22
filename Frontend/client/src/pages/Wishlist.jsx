import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchWishlist,
    removeFromWishlist,
    clearAllWishlist,
    moveAllToCart,
    selectWishlistItems,
    selectWishlistLoading,
    selectMovingToCart,
    selectWishlistError,
    selectMoveResult,
    clearMoveResult,
} from "../redux/slices/wishlistSlice";
import { fetchCart } from "../redux/slices/cartSlice";
import WishlistItemRow from "../components/wishlist/wishlistItemRow";
import Toast from "../components/common/Toast";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/wishlist.css";

export default function Wishlist() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: "", type: "success" });

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const enrichedItems = useAppSelector(selectWishlistItems);
    const loading = useAppSelector(selectWishlistLoading);
    const movingToCart = useAppSelector(selectMovingToCart);
    const error = useAppSelector(selectWishlistError);
    const moveResult = useAppSelector(selectMoveResult);

    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    // Cargar wishlist al montar el componente
    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchWishlist());
        }
    }, [token, usuarioId, dispatch]);

    // Mostrar errores con Toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    // Mostrar mensaje cuando se complete mover al carrito
    useEffect(() => {
        if (moveResult) {
            const { successCount, failCount } = moveResult;
            if (successCount > 0) {
                const message = `${successCount} producto(s) agregado(s) al carrito${failCount > 0 ? ` (${failCount} fallaron)` : ''}`;
                setToastConfig({ message, type: failCount > 0 ? "warning" : "success" });
                setShowToast(true);
                // También refrescar el carrito para actualizar el count
                dispatch(fetchCart());
            }
            // Limpiar el resultado después de mostrarlo
            setTimeout(() => {
                dispatch(clearMoveResult());
            }, 3000);
        }
    }, [moveResult, dispatch]);

    const onRemove = (productoId) => {
        dispatch(removeFromWishlist(productoId));
    };

    const onClear = () => {
        dispatch(clearAllWishlist());
    };

    const onAddAllToCart = async () => {
        if (!enrichedItems.length) {
            return;
        }

        const result = await dispatch(moveAllToCart());

        if (result.type === 'wishlist/moveAllToCart/fulfilled') {
            // Redirigir al carrito después de mover exitosamente
            navigate('/cart');
        }
    };

    if (!token) {
        return (
            <div className="wishlist-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💝</div>
                    <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.8rem' }}>Acceso Denegado</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.1rem' }}>Debes iniciar sesión para ver tu lista de deseos</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.8rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: 'white',
                            color: '#f5576c',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (!usuarioId) {
        return (
            <div className="wishlist-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.8rem' }}>Error de Sesión</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.1rem' }}>No se detectó tu usuarioId en la sesión</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.8rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (!buyer) {
        return (
            <div className="wishlist-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                    <h2 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.8rem' }}>Permisos Insuficientes</h2>
                    <p style={{ color: '#555', marginBottom: '2rem', fontSize: '1.1rem' }}>Tu cuenta no tiene permisos de comprador</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.8rem 2rem',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            background: '#333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <h2>Tu Wishlist</h2>

            <div className="wishlist-container">
                {loading ? (
                    <div className="skeleton">Cargando wishlist…</div>
                ) : !enrichedItems.length ? (
                    <div className="empty">Tu wishlist está vacía</div>
                ) : (
                    <>
                        <div className="wishlist-items">
                            {enrichedItems.map((item) => (
                                <WishlistItemRow
                                    key={`${item.productoId}`}
                                    item={item}
                                    onRemove={onRemove}
                                />
                            ))}
                        </div>

                        <div className="wishlist-actions">
                            <button
                                className="btn btn--primary btn--block"
                                onClick={onAddAllToCart}
                                disabled={movingToCart}
                            >
                                {movingToCart ? "Agregando..." : "Agregar todos al carrito"}
                            </button>
                            <button
                                className="btn btn--ghost btn--block"
                                onClick={onClear}
                            >
                                Vaciar wishlist
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
