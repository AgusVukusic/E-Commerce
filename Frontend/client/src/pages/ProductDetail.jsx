import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import {
    fetchProductoById,
    selectCurrentProduct,
    selectProductLoading,
    selectProductError,
    clearCurrentProduct
} from "../redux/slices/productsSlice";
import { addToCart, fetchCart } from "../redux/slices/cartSlice";
import { addToWishlist, fetchWishlist } from "../redux/slices/wishlistSlice";
import { getUserId } from "../utils/userUtils";
import Toast from "../components/common/Toast";
import "../styles/productDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    // Estado de Redux
    const user = useAppSelector(selectUser);
    const data = useAppSelector(selectCurrentProduct);
    const loading = useAppSelector(selectProductLoading);
    const err = useAppSelector(selectProductError);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastConfig, setToastConfig] = useState({
        message: "",
        type: "success"
    });

    useEffect(() => {
        dispatch(fetchProductoById(id));

        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [id, dispatch]);

    // Resetear el índice seleccionado cuando cambie el producto
    useEffect(() => {
        setSelectedImageIndex(0);
    }, [id]);

    // Array combinado de todas las imágenes disponibles
    const todasLasImagenes = useMemo(() => {
        if (!data) return [];

        const imagenes = [];

        // Agregar imagen principal si existe
        if (data.imagenUrl) {
            imagenes.push({ url: data.imagenUrl, esPrincipal: true });
        }

        // Agregar imágenes adicionales (evitar duplicados)
        if (Array.isArray(data.imagenes) && data.imagenes.length > 0) {
            data.imagenes.forEach(img => {
                const url = img.url || img.imagenUrl;
                if (url && url !== data.imagenUrl) {
                    imagenes.push({ url, esPrincipal: false });
                }
            });
        }

        return imagenes;
    }, [data]);

    const imgPrincipal = useMemo(() => {
        if (todasLasImagenes.length === 0) return "/promos/quality.jpg";

        const selectedImg = todasLasImagenes[selectedImageIndex];
        if (selectedImg) {
            return selectedImg.url;
        }

        // Fallback a la primera
        return todasLasImagenes[0].url;
    }, [todasLasImagenes, selectedImageIndex]);

    const formatMoney = (n) => (typeof n === "number" ? `$${n.toFixed(2)}` : "$-");

    if (loading) return <section className="pd-wrap"><p>Cargando producto…</p></section>;
    if (err) return <section className="pd-wrap"><p className="pd-error">{err}</p></section>;
    if (!data) return null;

    const {
        titulo, descripcion, precio, tieneDescuento, precioConDescuento,
        porcentajeDescuento, categoriaNombre, stock, vendedorNombre
    } = data;

    const sinStock = typeof stock === "number" ? stock <= 0 : false;

    const goLogin = (intent /* "cart" | "wishlist" */) => {
        const current = location.pathname + location.search;
        navigate(`/login?redirect=${encodeURIComponent(current)}&intent=${intent}`);
    };

    const handleAddToCart = async () => {
        if (!user) { goLogin("cart"); return; }

        const userId = getUserId(user);
        if (!userId) {
            setToastConfig({ message: "No se pudo identificar tu usuario", type: "error" });
            setShowToast(true);
            return;
        }

        const precioFinal = tieneDescuento ? precioConDescuento : precio;

        const result = await dispatch(addToCart({
            productoId: id,
            cantidad: 1,
            precio: precioFinal
        }));

        if (result.type === 'cart/addToCart/fulfilled') {
            setTimeout(() => {
                dispatch(fetchCart());
            }, 300);
            setToastConfig({ message: "✓ Producto agregado al carrito", type: "success" });
            setShowToast(true);
            setTimeout(() => {
                navigate("/cart");
            }, 1000);
        } else if (result.payload) {
            setToastConfig({ message: "Error: " + result.payload, type: "error" });
            setShowToast(true);
        }
    };

    const handleAddToWishlist = async () => {
        if (!user) { goLogin("wishlist"); return; }

        const userId = getUserId(user);
        if (!userId) {
            setToastConfig({ message: "No se pudo identificar tu usuario", type: "error" });
            setShowToast(true);
            return;
        }

        const result = await dispatch(addToWishlist({
            productoId: id,
            productoTitulo: titulo
        }));

        if (result.type === 'wishlist/addToWishlist/fulfilled') {
            setTimeout(() => {
                dispatch(fetchWishlist());
            }, 300);
            setToastConfig({ message: "✓ Producto agregado a la wishlist", type: "success" });
            setShowToast(true);
        } else if (result.payload) {
            setToastConfig({ message: result.payload, type: "error" });
            setShowToast(true);
        }
    };
    // ----------------------------------------------------

    return (
        <section className="pd-wrap">
            {showToast && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    duration={3000}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="pd-header">
                <button className="pd-back" onClick={() => navigate(-1)}>Volver</button>
            </div>

            <div className="pd-grid">
                {/* Media */}
                <div className="pd-media">
                    <img className="pd-cover" src={imgPrincipal} alt={titulo} />
                    {todasLasImagenes.length > 1 && (
                        <div className="pd-thumbs">
                            {todasLasImagenes.map((img, i) => (
                                <button
                                    key={i}
                                    className={`pd-thumbBtn ${selectedImageIndex === i ? 'is-active' : ''}`}
                                    onClick={() => setSelectedImageIndex(i)}
                                    type="button"
                                >
                                    <img src={img.url} alt={`${titulo} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="pd-info">
                    <h1 className="pd-title">{titulo}</h1>

                    <div className="pd-meta">
                        {categoriaNombre && <span className="pd-chip">Categoría: {categoriaNombre}</span>}

                        {typeof stock === "number" && (
                            <span className={`pd-chip ${sinStock ? "stock-out" : "stock-ok"}`}>
                                {sinStock ? "Sin stock" : `Stock: ${stock}`}
                            </span>
                        )}

                        {vendedorNombre && <span className="pd-chip">Vendedor: {vendedorNombre}</span>}
                    </div>

                    <div className="pd-price">
                        {tieneDescuento && typeof precioConDescuento === "number" ? (
                            <>
                                <span className="pd-old">{formatMoney(precio)}</span>
                                <span className="pd-new">{formatMoney(precioConDescuento)}</span>
                                {porcentajeDescuento ? <span className="pd-off">-{porcentajeDescuento}%</span> : null}
                            </>
                        ) : (
                            <span className="pd-new">{formatMoney(precio)}</span>
                        )}
                    </div>

                    <p className="pd-desc">{descripcion}</p>

                    <div className="pd-actions">
                        <button className="btn-primary" disabled={sinStock} onClick={handleAddToCart}>
                            {sinStock ? "Sin stock" : "Agregar al carrito"}
                        </button>
                        <button className="btn-outline" onClick={handleAddToWishlist}>
                            Agregar a Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
