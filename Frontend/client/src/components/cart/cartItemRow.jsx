// Redux imports
import { useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/authSlice";

export default function CartItemRow({ item, onQtyChange, onRemove }) {
    const user = useAppSelector(selectUser);
    const token = user?.token;
    const titulo = item.productoTitulo;
    const precio = item.precio;
    const precioConDescuento = item.precioConDescuento;
    const tieneDescuento = item.tieneDescuento;
    const displayPrice = tieneDescuento ? precioConDescuento : precio;
    const qty = item.cantidad ?? 1;
    const subtotal = displayPrice * qty;

    const formatPrice = (price) => {
        if (typeof price !== 'number') return '0,00';
        return price.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Función para construir la URL de la imagen con el token
    const getImageUrl = () => {
        // Si el item tiene un array de imágenes, usar la primera
        if (item.imagenes && Array.isArray(item.imagenes) && item.imagenes.length > 0) {
            const primeraImagen = item.imagenes[0];
            const url = primeraImagen.url || primeraImagen.imagenUrl;
            if (url) return url;
        }

        // Si hay una URL directa en el producto
        return item.imagenUrl || item.productoImagenUrl || item.imagen || "/showcase/quality.jpg";
    };

    const imageUrl = getImageUrl(); const renderImage = () => {
        const finalUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/showcase')
            ? imageUrl
            : `http://localhost:8080/productos-publicos/imagen/${item.productoId}`;

        if (finalUrl.includes('localhost') && token) {
            return (
                <img
                    src={finalUrl}
                    alt={titulo}
                    className="cart-row__img"
                    style={{ background: '#f3f4f6' }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/showcase/quality.jpg";
                    }}
                />
            );
        }

        return (
            <img
                src={finalUrl}
                alt={titulo}
                className="cart-row__img"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/showcase/quality.jpg";
                }}
            />
        );
    };

    return (
        <div className="cart-row">
            {renderImage()}            <div className="cart-row__info">
                <h4 className="cart-row__title">{titulo}</h4>
                <div className="cart-row__meta">
                    {tieneDescuento ? (
                        <div className="cart-row__price-group">
                            <span className="cart-row__price-original">ARS ${formatPrice(precio)}</span>
                            <span className="cart-row__price">ARS ${formatPrice(precioConDescuento)}</span>
                            {item.porcentajeDescuento && (
                                <span className="cart-row__discount">-{item.porcentajeDescuento}%</span>
                            )}
                        </div>
                    ) : (
                        <span className="cart-row__price">ARS ${formatPrice(precio)}</span>
                    )}
                </div>

                <div className="cart-row__actions">
                    <div className="qty">
                        <button
                            className="qty__btn"
                            onClick={() => onQtyChange(item.productoId, Math.max(1, qty - 1))}
                        >
                            −
                        </button>
                        <input
                            className="qty__input"
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => {
                                const next = Math.max(1, Number(e.target.value || 1));
                                onQtyChange(item.productoId, next);
                            }}
                        />
                        <button
                            className="qty__btn"
                            onClick={() => onQtyChange(item.productoId, qty + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="btn btn--link btn--danger"
                        onClick={() => onRemove(item.productoId)}
                    >
                        Quitar
                    </button>
                </div>
            </div>

            <div className="cart-row__subtotal">
                Subtotal: ARS ${formatPrice(subtotal)}
            </div>
        </div>
    );
}
