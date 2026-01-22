import { configureStore } from '@reduxjs/toolkit';
import errorMiddleware from './middleware/errorMiddleware';

// Importar reducers
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import ordersReducer from './slices/ordersSlice';
import usuariosReducer from './slices/usuariosSlice';
import adminOrdersReducer from './slices/adminOrdersSlice';
import vendedorReducer from './slices/vendedorSlice';
import categoriasReducer from './slices/categoriasSlice';
import descuentosReducer from './slices/descuentosSlice';

/**
 * Store de Redux - Configuración centralizada del estado de la aplicación
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: ordersReducer,
        usuarios: usuariosReducer,
        adminOrders: adminOrdersReducer,
        vendedor: vendedorReducer,
        categorias: categoriasReducer,
        descuentos: descuentosReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorar estas rutas para tokens, fechas y funciones
                // que pueden no ser serializables
                ignoredActions: [
                    'auth/login/fulfilled',
                    'auth/register/fulfilled',
                    'auth/setUser',
                ],
                ignoredPaths: [
                    'auth.user.token',
                    'auth.user',
                ],
            },
        }).concat(errorMiddleware),
    devTools: process.env.NODE_ENV !== 'production', // DevTools solo en desarrollo
});

export default store;

