const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
});

// -------- Carrito --------
export async function createCartIfMissing(token, usuarioId) {
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo crear/obtener el carrito");
    return res.json();
}

export async function getCart(token, usuarioId) {
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}`, {
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo obtener el carrito");
    const data = await res.json();
    return data;
}

export async function clearCart(token, usuarioId) {
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}/vaciar`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error("No se pudo vaciar el carrito");
    return res.json(); // CarritoDTO
}

// -------- Ítems --------
export async function addItemToCart(token, usuarioId, { productoId, cantidad, precio }) {
    const res = await fetch(`${API}/carritos/usuario/${usuarioId}/items`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include",
        body: JSON.stringify({ productoId, cantidad, precio }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo agregar el producto al carrito");
    }
    return res.json(); // CarritoDTO
}

export async function updateCartItemQty(token, usuarioId, productoId, cantidad) {
    const res = await fetch(
        `${API}/carritos/usuario/${usuarioId}/items/${productoId}`,
        {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
            body: JSON.stringify({ cantidad }),
        }
    );
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo actualizar la cantidad");
    }
    return res.json(); // CarritoDTO
}

export async function removeCartItem(token, usuarioId, productoId) {
    const res = await fetch(
        `${API}/carritos/usuario/${usuarioId}/items/${productoId}`,
        {
            method: "DELETE",
            headers: authHeaders(token),
            credentials: "include"
        }
    );
    if (!res.ok) throw new Error("No se pudo eliminar el ítem");
    return res.json(); // CarritoDTO
}

// -------- Checkout --------
export async function validateCheckout(token, usuarioId) {
    const res = await fetch(`${API}/checkout/usuario/${usuarioId}/validar`, {
        headers: authHeaders(token),
        credentials: "include"
    });
    if (!res.ok) throw new Error("No se pudo validar el checkout");
    return res.json(); // { valido, mensaje }
}

export async function doCheckout(token, usuarioId) {
    const res = await fetch(`${API}/checkout/usuario/${usuarioId}`, {
        method: "POST",
        headers: authHeaders(token),
        credentials: "include",
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "No se pudo realizar el checkout");
    }
    return res.json(); // OrdenDTO
}
