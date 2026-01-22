import { useNavigate } from "react-router-dom";
// Redux imports
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/authSlice";
import { addToWishlist, fetchWishlist, selectAddingToWishlist } from "../../redux/slices/wishlistSlice";
import { isBuyer, getUserId } from "../../utils/userUtils";

export default function AddToWishlistButton({ productoId, producto, onAdded }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAddingToWishlist);
    
    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    const handleAdd = async () => {
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        // Dispatch del thunk de Redux
        const result = await dispatch(addToWishlist({
            productoId,
            productoTitulo: producto?.titulo
        }));

        if (result.type === 'wishlist/addToWishlist/fulfilled') {
            // Refrescar la wishlist para obtener el count actualizado
            setTimeout(() => {
                dispatch(fetchWishlist());
            }, 300);
            onAdded?.();
            // Solo navegar si no hay error y el usuario quiere
            navigate('/wishlist');
        } else if (result.type === 'wishlist/addToWishlist/rejected') {
            const errorMessage = result.payload || 'Error desconocido';
            if (errorMessage.includes("Error interno del servidor")) {
                alert("⚠️ El servidor está experimentando problemas temporales. Por favor, inténtalo en unos minutos.");
            } else if (errorMessage.includes("Error de conexión")) {
                alert("🌐 No se pudo conectar al servidor. Verifica tu conexión a internet.");
            } else {
                alert(errorMessage);
            }
        }
    };

    return (
        <button className="btn btn--ghost" disabled={loading} onClick={handleAdd}>
            {loading ? "Agregando..." : "♥ Wishlist"}
        </button>
    );
}
