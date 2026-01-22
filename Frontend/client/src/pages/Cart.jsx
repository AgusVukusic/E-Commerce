import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchCart,
    updateCartQty,
    removeFromCart,
    clearAllCart,
    validateCart,
    selectCartItems,
    selectCartLoading,
    selectCartValidating,
    selectCheckoutValidation,
    selectCartError,
} from "../redux/slices/cartSlice";
import CartItemRow from "../components/cart/cartItemRow";
import CartSummary from "../components/cart/cartSummary";
import Toast from "../components/common/Toast";
import { isBuyer, getUserId } from "../utils/userUtils";
import "../styles/cart.css";

export default function Cart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: "", type: "success" });

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const enrichedItems = useAppSelector(selectCartItems);
    const loading = useAppSelector(selectCartLoading);
    const validating = useAppSelector(selectCartValidating);
    const checkoutValidation = useAppSelector(selectCheckoutValidation);
    const error = useAppSelector(selectCartError);

    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    // Cargar carrito al montar el componente
    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchCart());
        }
    }, [token, usuarioId, dispatch]);

    // Mostrar errores con Toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);

    // Mostrar errores de validación de checkout con Toast
    useEffect(() => {
        if (checkoutValidation && !checkoutValidation.valido) {
            setToastConfig({ message: checkoutValidation.mensaje, type: "error" });
            setShowToast(true);
        }
    }, [checkoutValidation]);

    const onQtyChange = (productoId, cantidad) => {
        dispatch(updateCartQty({ productoId, cantidad }));
    };

    const onRemove = (productoId) => {
        dispatch(removeFromCart(productoId));
    };

    const onClear = () => {
        dispatch(clearAllCart());
    };

    const onCheckout = async () => {
        const result = await dispatch(validateCart());
        if (result.payload?.valido) {
            navigate('/checkout');
        }
    };

    if (!token) {
        return (
            <div className="cart-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                    <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.8rem' }}>Acceso Denegado</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', fontSize: '1.1rem' }}>Debes iniciar sesión para ver tu carrito</p>
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

    if (!usuarioId) {
        return (
            <div className="cart-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', padding: '3rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
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

    if (!buyer) {
        return (
            <div className="cart-page container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
        <div className="cart-page container">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <h2>Tu carrito</h2>

            <div className="cart-grid">
                <div className="cart-left">
                    {loading ? (
                        <div className="skeleton">Cargando carrito…</div>
                    ) : !enrichedItems.length ? (
                        <div className="empty">Tu carrito está vacío</div>
                    ) : (
                        enrichedItems.map((item) => (
                            <CartItemRow
                                key={`${item.productoId}`}
                                item={item}
                                onQtyChange={onQtyChange}
                                onRemove={onRemove}
                            />
                        ))
                    )}
                </div>

                <div className="cart-right">
                    <CartSummary
                        items={enrichedItems}
                        onClear={onClear}
                        onCheckout={onCheckout}
                        validating={validating}
                    />
                </div>
            </div>
        </div>
    );
}
