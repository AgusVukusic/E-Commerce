// Muestra título, precio, descuento (si aplica) e imagen del producto
export default function GameCard({ producto, onClick }) {
    if (!producto) return null;

    const {
        titulo,
        precio,
        tieneDescuento,
        precioConDescuento,
        imagenUrl,
        imagenes,
    } = producto;

    // Imagen: prioriza imagenUrl del DTO, si no, primera imagen de la lista
    const imgFromList =
        (Array.isArray(imagenes) && imagenes.length > 0 && (imagenes[0].url || imagenes[0].imagenUrl)) || null;

    const img = imagenUrl || imgFromList || "/promos/quality.jpg";

    const formatMoney = (n) =>
        typeof n === "number" ? `$${n.toFixed(2)}` : "$-";

    return (
        <article className="game-card" onClick={onClick} style={{ cursor: "pointer" }}>
            <img src={img} alt={titulo} />
            <h3 title={titulo}>{titulo}</h3>

            {tieneDescuento && typeof precioConDescuento === "number" ? (
                <p>
                    <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>
                        {formatMoney(precio)}
                    </span>
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>
                        {formatMoney(precioConDescuento)}
                    </span>
                </p>
            ) : (
                <p style={{ color: "#2563eb", fontWeight: 700 }}>{formatMoney(precio)}</p>
            )}
        </article>
    );
}
