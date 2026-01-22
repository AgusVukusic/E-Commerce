import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchOrders,
    selectOrders,
    selectOrdersLoading,
    selectOrdersError
} from "../redux/slices/ordersSlice";
import { getUserId } from "../utils/userUtils";
import Toast from "../components/common/Toast";
import OrderRow from "../components/orders/OrderRow";
import "../styles/orders.css";

export default function Orders() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Toast state
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({ message: "", type: "success" });

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const orders = useAppSelector(selectOrders);
    const loading = useAppSelector(selectOrdersLoading);
    const error = useAppSelector(selectOrdersError);

    const token = user?.token;
    const usuarioId = getUserId(user);

    useEffect(() => {
        if (token && usuarioId) {
            dispatch(fetchOrders());
        }
    }, [token, usuarioId, dispatch]);

    // Mostrar errores con Toast
    useEffect(() => {
        if (error) {
            setToastConfig({ message: error, type: "error" });
            setShowToast(true);
        }
    }, [error]);



    if (!user) {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="alert error">
                        <strong>Acceso Denegado</strong>
                        <p>Debes iniciar sesión para ver tus órdenes</p>
                        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        );
    }

    if (user.rol !== "COMPRADOR" && user.rol !== "ADMIN") {
        return (
            <div className="orders-page">
                <div className="container">
                    <div className="alert error">
                        <strong>Acceso Denegado</strong>
                        <p>Solo los compradores pueden ver sus órdenes</p>
                        <button onClick={() => navigate('/')}>Volver al Inicio</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="container">
                <div className="orders-header">
                    <h2>Mis Órdenes</h2>
                    <p className="orders-subtitle">Historial de todas tus compras</p>
                </div>

                <div className="orders-content">
                    {loading ? (
                        <div className="orders-loading">
                            <div className="loading-spinner"></div>
                            <p>Cargando órdenes...</p>
                        </div>
                    ) : !Array.isArray(orders) || orders.length === 0 ? (
                        <div className="orders-empty">
                            <div className="empty-icon">📦</div>
                            <h3>No tienes órdenes aún</h3>
                            <p>Cuando realices tu primera compra, aparecerá aquí.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <OrderRow
                                    key={order.id}
                                    order={order}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}