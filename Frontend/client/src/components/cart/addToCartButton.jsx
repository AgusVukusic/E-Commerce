// Redux imports
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectUser } from "../../redux/slices/authSlice";
import { addToCart, fetchCart, selectAddingToCart } from "../../redux/slices/cartSlice";
import { isBuyer, getUserId } from "../../utils/userUtils";

export default function AddToCartButton({ productoId, cantidad = 1, precio, tieneDescuento = false, precioConDescuento, onAdded }) {
    const dispatch = useAppDispatch();
    
    // Estado de Redux
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectAddingToCart);
    
    // Derivar valores del usuario
    const token = user?.token;
    const usuarioId = getUserId(user);
    const buyer = isBuyer(user);

    const handleAdd = async () => {
        if (!token) return alert("Debes iniciar sesión.");
        if (!buyer) return alert("Tu cuenta no tiene permisos de COMPRADOR.");
        if (!usuarioId) return alert("No se detectó tu usuarioId en la sesión.");

        // Dispatch del thunk de Redux
        const result = await dispatch(addToCart({
            productoId,
            cantidad,
            precio
        }));

        if (result.type === 'cart/addToCart/fulfilled') {
            // Refrescar el carrito para obtener el count actualizado
            setTimeout(() => {
                dispatch(fetchCart());
            }, 300);
            onAdded?.();
        } else if (result.payload) {
            alert(result.payload);
        }
    };

    return (
        <button className="btn btn--primary" disabled={loading} onClick={handleAdd}>
            {loading ? "Agregando..." : "Agregar al carrito"}
        </button>
    );
}
