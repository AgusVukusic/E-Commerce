const API = "http://localhost:8080";

const authHeaders = (token) => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
});

// Obtener todas las órdenes de un usuario
export async function getUserOrders(token, usuarioId) {
    const res = await fetch(`${API}/ordenes/usuario/${usuarioId}`, {
        method: "GET",
        headers: authHeaders(token),
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudieron cargar las órdenes");
    }
    const data = await res.json();
    // El backend devuelve un objeto paginado con las órdenes en 'content'
    return data.content || [];
}

// Obtener detalles de los items de una orden
import { getProducto } from "./products";
export async function getOrderItems(token, itemIds) {
    try {
        const items = await Promise.all(
            itemIds.map(async (itemId) => {
                try {
                    const res = await fetch(`${API}/orden-items/${itemId}`, {
                        method: "GET",
                        headers: authHeaders(token),
                        credentials: "include",
                    });
                    if (res.ok) {
                        return await res.json();
                    }
                } catch (error) {
                    // Si falla, buscar el producto directamente
                    try {
                        const producto = await getProducto(itemId);
                        if (producto) {
                            return {
                                id: itemId,
                                productoTitulo: producto.titulo || `Producto #${itemId}`,
                                cantidad: 1,
                                precio: producto.precio || 0,
                                productoId: producto.id
                            };
                        }
                    } catch (err) {
                        console.error(`Error loading producto ${itemId}:`, err);
                    }
                }
                // Fallback final: objeto placeholder
                return {
                    id: itemId,
                    productoTitulo: `Item #${itemId}`,
                    cantidad: 1,
                    precio: 0,
                    productoId: null
                };
            })
        );
        return items;
    } catch (error) {
        console.error('Error loading order items:', error);
        return [];
    }
}