export default function WishlistItemRow({ item, onRemove }) {
    const titulo = item.productoTitulo;

    // obtener la imagen
    const getImageUrl = () => {
        // Primero intentar con imagenUrl directo
        if (item.imagenUrl) return item.imagenUrl;

        // Si hay un array de imágenes, usar la primera
        if (Array.isArray(item.imagenes) && item.imagenes.length > 0) {
            const firstImage = item.imagenes[0];
            return firstImage.url || firstImage.imagenUrl;
        }

        // Fallback a imagen por defecto
        return null;
    };

    const imageUrl = getImageUrl();

    return (
        <div className="wishlist-row">
            {imageUrl ? (
                <img src={imageUrl} alt={titulo} className="wishlist-row__img" />
            ) : (
                <div className="wishlist-row__img--placeholder">{titulo?.[0] ?? "J"}</div>
            )}

            <div className="wishlist-row__info">
                <h4 className="wishlist-row__title">{titulo}</h4>
            </div>

            <button
                className="btn btn--link btn--danger"
                onClick={() => onRemove(item.productoId)}
            >
                Quitar
            </button>
        </div>
    );
}
