const API = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

// Función helper para retry en caso de errores 500
const fetchWithRetry = async (url, options, maxRetries = 2) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Si no es error 500, retornar la respuesta (exitosa o con error)
            if (response.status !== 500) {
                return response;
            }

            // Si es error 500 y no es el último intento, continuar
            if (attempt < maxRetries) {
                // Esperar un poco antes del siguiente intento
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }

            // Si es el último intento, retornar la respuesta con error
            return response;
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                continue;
            }
        }
    }

    // Si llegamos aquí, todos los intentos fallaron
    throw lastError;
};

// -------- Wishlist --------
export async function createWishlistIfMissing(token, usuarioId) {
    try {
        // Usar el endpoint correcto del backend
        const createRes = await fetch(`${API}/usuarios/${usuarioId}/wishlist/create-if-not-exists`, {
            method: "POST",
            headers: authHeaders(token),
        });

        if (createRes.ok) {
            return await createRes.json();
        }
    } catch (error) {
        // Error silencioso
    }

    // Retornar wishlist vacía si hay error
    return { items: [] };
}

export async function getWishlist(token, usuarioId) {
    try {
        // Usar el endpoint correcto del backend
        const res = await fetchWithRetry(`${API}/usuarios/${usuarioId}/wishlist`, {
            headers: authHeaders(token),
        });

        if (res.ok) {
            return await res.json();
        }

        if (res.status === 404) {
            // Backend existe pero no hay wishlist, retornar vacía
            return { items: [] };
        }

        if (res.status === 500) {
            return { items: [] };
        }

        // Otros errores
        return { items: [] };
    } catch (error) {
        return { items: [] };
    }
}

export async function clearWishlist(token, usuarioId) {
    try {
        const res = await fetch(`${API}/usuarios/${usuarioId}/wishlist/items`, {
            method: "DELETE",
            headers: authHeaders(token),
        });
        if (res.ok) {
            return { items: [] }; // Retorna wishlist vacía tras limpiar
        }
    } catch (error) {
        // Error silencioso
    }

    // Retornar wishlist vacía si hay error
    return { items: [] };
}

// -------- Items --------
export async function addItemToWishlist(token, usuarioId, productoId, productoTitulo) {
    try {
        // Primero intentar crear/obtener la wishlist para asegurar que existe
        await createWishlistIfMissing(token, usuarioId);

        // Usar el endpoint correcto del backend: POST /usuarios/{usuarioId}/wishlist/items/{productoId}
        const res = await fetchWithRetry(`${API}/usuarios/${usuarioId}/wishlist/items/${productoId}`, {
            method: "POST",
            headers: authHeaders(token),
        });

        if (res.ok) {
            return await res.json();
        }

        // Manejo específico de errores según status
        let errorMessage = 'Error al agregar a wishlist';

        if (res.status === 500) {
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        } else if (res.status === 404) {
            errorMessage = 'Servicio no encontrado';
        } else if (res.status === 401) {
            errorMessage = 'No autorizado. Inicia sesión nuevamente.';
        } else if (res.status === 400) {
            const errorData = await res.json().catch(() => ({}));
            errorMessage = errorData.message || 'Datos inválidos';
        }

        throw new Error(errorMessage);
    } catch (error) {
        // Si el error ya es conocido, lo relanzamos
        if (error.message.includes('Error interno del servidor') ||
            error.message.includes('No autorizado') ||
            error.message.includes('Servicio no encontrado')) {
            throw error;
        }

        // Error de conexión
        throw new Error('Error de conexión. Verifica tu internet.');
    }
}

export async function removeWishlistItem(token, usuarioId, productoId) {
    try {
        const res = await fetch(
            `${API}/usuarios/${usuarioId}/wishlist/items/${productoId}`,
            { method: "DELETE", headers: authHeaders(token) }
        );
        if (res.ok) {
            // El backend retorna 204 No Content, así que retornamos una wishlist actualizada
            return await getWishlist(token, usuarioId);
        }

        // Si hay error del servidor, lanzar excepción
        const errorData = await res.json().catch(() => ({ message: 'Error del servidor' }));
        throw new Error(errorData.message || 'Error al eliminar de wishlist');
    } catch (error) {
        throw error;
    }
}

// -------- Agregar todos al carrito --------
// NOTA: Este endpoint no existe en el backend actual
// La funcionalidad debe implementarse agregando items uno por uno
export async function addAllToCart(token, usuarioId) {
    throw new Error("Funcionalidad no disponible: agregar todos al carrito debe hacerse item por item");
}
