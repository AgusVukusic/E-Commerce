import { API_URL } from './client';

// Función auxiliar para hacer requests autenticados
async function authenticatedFetch(url, token, options = {}) {
    if (!token) throw new Error('No hay token de autenticación');

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const mergedOptions = {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || errorData.error || `Error HTTP ${response.status}`;
        console.error('Error en request:', url, response.status, errorData);
        throw new Error(errorMsg);
    }

    // Para DELETE puede no tener contenido
    if (response.status === 204) return {};

    return response.json().catch(() => ({}));
}

// Obtener descuento de un producto
export async function getDescuentoByProducto(token, productoId) {
    const url = `${API_URL}/productos/${productoId}/descuento`;
    try {
        return await authenticatedFetch(url, token);
    } catch (error) {
        // Si no tiene descuento, retornar null en lugar de error
        if (error.message.includes('404')) {
            return null;
        }
        throw error;
    }
}

// Crear descuento para un producto
export async function createDescuento(token, productoId, descuentoData) {
    const url = `${API_URL}/productos/${productoId}/descuento`;
    return authenticatedFetch(url, token, {
        method: 'POST',
        body: JSON.stringify(descuentoData)
    });
}

// Eliminar descuento de un producto
export async function deleteDescuento(token, productoId, descuentoId) {
    const url = `${API_URL}/productos/${productoId}/descuento/${descuentoId}`;
    return authenticatedFetch(url, token, {
        method: 'DELETE'
    });
}
