export default function CartSummary({ items = [], onClear, onCheckout, validating, checkingOut }) {
    const formatPrice = (price) => {
        if (typeof price !== 'number') return '0,00';
        return price.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => {
            return acc + (item.subtotal || 0);
        }, 0);
    };

    const total = calculateTotal();

    return (
        <div className="cart-summary">
            <h3>Resumen</h3>
            <div className="cart-summary__row">
                <span>Ítems</span>
                <span>{items.reduce((n, it) => n + (it.cantidad ?? 0), 0)}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>ARS ${formatPrice(total)}</span>
            </div>

            <button className="btn btn--primary btn--block" disabled={validating || checkingOut || items.length === 0} onClick={onCheckout}>
                {checkingOut ? "Procesando…" : "Ir a pagar"}
            </button>
            <button className="btn btn--ghost btn--block" disabled={checkingOut || items.length === 0} onClick={onClear}>
                Vaciar carrito
            </button>
        </div>
    );
}
