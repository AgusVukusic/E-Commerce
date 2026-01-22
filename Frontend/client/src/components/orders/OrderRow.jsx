import { useState } from "react";

export default function OrderRow({ order }) {
    const [expanded, setExpanded] = useState(false);

    // Elimina la carga de items por API, solo usa order.items
    const formatPrice = (price) => {
        if (typeof price !== 'number') return '0,00';
        return price.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const itemCount = order.items?.length || 0;

    return (
        <div className="order-row">
            <div
                className="order-header"
                onClick={() => setExpanded(!expanded)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }
                }}
            >
                <div className="order-info">
                    <h3 className="order-id">Orden #{order.id}</h3>
                    <div className="order-meta">
                        <span className="order-date">{formatDate(order.fechaCreacion)}</span>
                        <span className={`order-status order-status--${order.estado?.toLowerCase()}`}>{order.estado}</span>
                    </div>
                </div>
                <div className="order-summary">
                    <div className="order-total">ARS ${formatPrice(order.total)}</div>
                    <div className="order-items-count">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </div>
                </div>
                <div className="order-expand-icon">
                    <svg
                        className={`expand-icon ${expanded ? 'expanded' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>

            {expanded && (
                <div className="order-details">
                    <div className="order-details-header">
                        <h4>Items de la orden:</h4>
                    </div>
                    <div className="order-items-list">
                        {(order.items && order.items.length > 0) ? (
                            order.items.map((item, index) => {
                                // Busca el nombre/título del producto en varias propiedades posibles
                                const productName = item.titulo || item.nombre || item.productoTitulo || item.producto?.titulo || item.producto?.nombre || `Item #${item.id || index}`;
                                return (
                                    <div key={item.id || index} className="order-item">
                                        <div className="order-item-info">
                                            <span className="order-item-title">{productName}</span>
                                            <span className="order-item-quantity">Cantidad: {item.cantidad}</span>
                                        </div>
                                        <div className="order-item-price">
                                            {item.precioConDescuento !== undefined && item.precioConDescuento !== item.precio ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#b91c1c', marginRight: 8 }}>
                                                        ARS ${formatPrice(item.precio)}
                                                    </span>
                                                    <span style={{ color: '#166534', fontWeight: 600 }}>
                                                        ARS ${formatPrice(item.precioConDescuento)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>
                                                    ARS ${formatPrice(item.precioConDescuento ?? item.precio)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="order-item-subtotal">
                                            <span style={{ color: '#64748b', fontSize: '0.85em' }}>
                                                Subtotal: ARS ${formatPrice(item.subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="order-items-empty">
                                <span>No se encontraron productos en esta orden</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}