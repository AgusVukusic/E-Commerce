/**
 * Middleware para manejar errores de Redux de forma centralizada
 */
const errorMiddleware = (store) => (next) => (action) => {
  // Detectar acciones rechazadas (errores)
  if (action.type && action.type.endsWith('/rejected')) {
    // Log del error en consola para desarrollo
    console.error('❌ Redux Error:', {
      type: action.type,
      payload: action.payload,
      error: action.error,
    });

  }

  // Continuar con el siguiente middleware
  return next(action);
};

export default errorMiddleware;

