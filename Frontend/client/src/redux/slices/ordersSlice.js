import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserOrders, getOrderItems } from '../../api/orders';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todas las órdenes del usuario
 * @returns {Array} Lista de órdenes
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const orders = await getUserOrders(token, usuarioId);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando órdenes');
    }
  }
);

/**
 * Thunk para obtener los detalles de los items de una orden específica
 * @param {Object} params - { orderId, itemIds }
 * @returns {Object} { orderId, items }
 */
export const fetchOrderItemsDetails = createAsyncThunk(
  'orders/fetchOrderItemsDetails',
  async ({ orderId, itemIds }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const items = await getOrderItems(token, itemIds);
      return { orderId, items };
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando detalles de la orden');
    }
  }
);

/**
 * Thunk para refrescar una orden específica
 * Útil después de hacer checkout para obtener la orden recién creada
 * @param {number} orderId - ID de la orden a refrescar
 */
export const refreshOrder = createAsyncThunk(
  'orders/refreshOrder',
  async (orderId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      // Obtener todas las órdenes y encontrar la específica
      const orders = await getUserOrders(token, usuarioId);
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        return rejectWithValue('Orden no encontrada');
      }

      return order;
    } catch (error) {
      return rejectWithValue(error.message || 'Error refrescando orden');
    }
  }
);

// ============== SLICE ==============

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderDetails: {}, // { orderId: { items: [...] } }
    loading: false,
    detailsLoading: {},
    error: null,
    lastCreatedOrder: null, // Útil para mostrar después del checkout
  },
  reducers: {
    /**
     * Limpiar errores de órdenes
     */
    clearOrdersError: (state) => {
      state.error = null;
    },
    /**
     * Resetear órdenes (útil después de logout)
     */
    resetOrders: (state) => {
      state.orders = [];
      state.orderDetails = {};
      state.error = null;
      state.lastCreatedOrder = null;
    },
    /**
     * Establecer la última orden creada (después de checkout)
     */
    setLastCreatedOrder: (state, action) => {
      state.lastCreatedOrder = action.payload;
    },
    /**
     * Limpiar la última orden creada
     */
    clearLastCreatedOrder: (state) => {
      state.lastCreatedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH ORDERS ==========
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      
      // ========== FETCH ORDER ITEMS DETAILS ==========
      .addCase(fetchOrderItemsDetails.pending, (state, action) => {
        // Marcar esta orden como cargando detalles
        const orderId = action.meta.arg.orderId;
        state.detailsLoading[orderId] = true;
      })
      .addCase(fetchOrderItemsDetails.fulfilled, (state, action) => {
        const { orderId, items } = action.payload;
        state.orderDetails[orderId] = { items };
        state.detailsLoading[orderId] = false;
      })
      .addCase(fetchOrderItemsDetails.rejected, (state, action) => {
        const orderId = action.meta.arg.orderId;
        state.detailsLoading[orderId] = false;
        state.error = action.payload;
      })
      
      // ========== REFRESH ORDER ==========
      .addCase(refreshOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshOrder.fulfilled, (state, action) => {
        // Actualizar la orden en la lista si existe, o agregarla
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        
        if (index >= 0) {
          state.orders[index] = updatedOrder;
        } else {
          state.orders.unshift(updatedOrder);
        }
        
        state.loading = false;
      })
      .addCase(refreshOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { 
  clearOrdersError, 
  resetOrders, 
  setLastCreatedOrder, 
  clearLastCreatedOrder 
} = ordersSlice.actions;

// ============== REDUCER ==============

export default ordersSlice.reducer;

// ============== SELECTORS ==============

/**
 * Selector para obtener todas las órdenes
 */
export const selectOrders = (state) => state.orders.orders;

/**
 * Selector para obtener el estado de carga
 */
export const selectOrdersLoading = (state) => state.orders.loading;

/**
 * Selector para obtener errores
 */
export const selectOrdersError = (state) => state.orders.error;

/**
 * Selector para obtener los detalles de una orden específica
 * @param {number} orderId - ID de la orden
 */
export const selectOrderDetails = (orderId) => (state) => {
  return state.orders.orderDetails[orderId] || null;
};

/**
 * Selector para saber si se están cargando detalles de una orden
 * @param {number} orderId - ID de la orden
 */
export const selectOrderDetailsLoading = (orderId) => (state) => {
  return state.orders.detailsLoading[orderId] || false;
};

/**
 * Selector para obtener la última orden creada
 */
export const selectLastCreatedOrder = (state) => state.orders.lastCreatedOrder;

/**
 * Selector para saber si hay órdenes
 */
export const selectHasOrders = (state) => state.orders.orders.length > 0;

/**
 * Selector para obtener el total de órdenes
 */
export const selectOrdersCount = (state) => state.orders.orders.length;

/**
 * Selector para obtener una orden por ID
 * @param {number} orderId - ID de la orden
 */
export const selectOrderById = (orderId) => (state) => {
  return state.orders.orders.find(order => order.id === orderId) || null;
};

/**
 * Selector para obtener las órdenes ordenadas por fecha (más recientes primero)
 */
export const selectOrdersSortedByDate = (state) => {
  return [...state.orders.orders].sort((a, b) => {
    const dateA = new Date(a.fecha || a.createdAt || 0);
    const dateB = new Date(b.fecha || b.createdAt || 0);
    return dateB - dateA;
  });
};

