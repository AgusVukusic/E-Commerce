/**
 * Función helper para obtener el token de un usuario
 * @param {Object} user - Usuario de Redux
 * @returns {string|null} Token o null
 */
export function getAuthTokenFromUser(user) {
    return user?.token || null;
}

/**
 * Función helper para verificar si un usuario está autenticado
 * @param {Object} user - Usuario de Redux
 * @returns {boolean} True si está autenticado
 */
export function isUserAuthenticated(user) {
    return !!user?.token;
}
