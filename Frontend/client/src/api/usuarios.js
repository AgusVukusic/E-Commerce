const API_URL = "http://localhost:8080";

const authHeaders = (token) => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
});

/**
 * Obtener todos los usuarios (solo ADMIN)
 * GET /usuarios
 */
export async function getAllUsuarios(token, page = 0, size = 20) {
    try {
        const response = await fetch(`${API_URL}/usuarios?page=${page}&size=${size}`, {
            method: "GET",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener usuarios");
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
}

/**
 * Promover un usuario VENDEDOR a ADMIN
 * PATCH /admin/promover/{usuarioId}
 */
export async function promoverUsuario(token, usuarioId) {
    try {
        const response = await fetch(`${API_URL}/admin/promover/${usuarioId}`, {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.message || errorData.error || `Error HTTP ${response.status}`;
            console.error('Error al promover usuario:', response.status, errorData);
            throw new Error(errorMsg);
        }

        // Puede retornar 204 No Content o un JSON
        if (response.status === 204) {
            return { success: true };
        }

        return await response.json();
    } catch (error) {
        console.error('Error al promover usuario:', error);
        throw error;
    }
}

/**
 * Degradar un usuario ADMIN a VENDEDOR
 * PATCH /admin/degradar/{usuarioId}
 */
export async function degradarUsuario(token, usuarioId) {
    try {
        const response = await fetch(`${API_URL}/admin/degradar/${usuarioId}`, {
            method: "PATCH",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.message || errorData.error || `Error HTTP ${response.status}`;
            console.error('Error al degradar usuario:', response.status, errorData);
            throw new Error(errorMsg);
        }

        // Puede retornar 204 No Content o un JSON
        if (response.status === 204) {
            return { success: true };
        }

        return await response.json();
    } catch (error) {
        console.error('Error al degradar usuario:', error);
        throw error;
    }
}

/**
 * Obtener un usuario por ID
 * GET /usuarios/{id}
 */
export async function getUsuarioById(token, usuarioId) {
    try {
        const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
            method: "GET",
            headers: authHeaders(token),
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener usuario");
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        throw error;
    }
}
