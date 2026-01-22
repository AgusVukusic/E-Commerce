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

// Obtener productos del vendedor autenticado
export async function getVendedorProductos(token, { page = 0, size = 50 } = {}) {
    const url = `${API_URL}/productos?page=${page}&size=${size}`;
    return authenticatedFetch(url, token);
}

// Crear nuevo producto
export async function createProducto(token, producto) {
    const url = `${API_URL}/productos`;
    return authenticatedFetch(url, token, {
        method: 'POST',
        body: JSON.stringify(producto)
    });
}

// Actualizar producto existente
export async function updateProducto(token, id, producto) {
    const url = `${API_URL}/productos/${id}`;
    return authenticatedFetch(url, token, {
        method: 'PATCH',
        body: JSON.stringify(producto)
    });
}

// Obtener producto específico
export async function getProducto(token, id) {
    const url = `${API_URL}/productos/${id}`;
    return authenticatedFetch(url, token);
}

// Eliminar producto
export async function deleteProducto(token, id) {
    const url = `${API_URL}/productos/${id}`;
    return authenticatedFetch(url, token, {
        method: 'DELETE'
    });
}

// Gestión de imágenes de producto
export async function addImagenToProducto(token, productoId, url) {
    const apiUrl = `${API_URL}/productos/${productoId}/imagenes/simple`;
    return authenticatedFetch(apiUrl, token, {
        method: 'POST',
        body: JSON.stringify({ url })
    });
}

export async function deleteImagenFromProducto(token, productoId, imagenId) {
    const url = `${API_URL}/productos/${productoId}/imagenes/${imagenId}`;
    return authenticatedFetch(url, token, {
        method: 'DELETE'
    });
}