import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = "http://localhost:8080";

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todas las órdenes (admin)
 * @param {Object} params - { page, size }
 */
export const fetchAllOrders = createAsyncThunk(
  'adminOrders/fetchAllOrders',
  async ({ page = 0, size = 20 } = {}, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const response = await fetch(`${API_URL}/ordenes?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al cargar órdenes");
      }

      const data = await response.json();
      return {
        content: data.content || [],
        page: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar órdenes');
    }
  }
);

// ============== SLICE ==============

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState: {
    ordenes: [],
    loading: false,
    error: null,
    pagination: {
      page: 0,
      totalPages: 0,
      totalElements: 0,
    },
    expandedOrder: null,
  },
  reducers: {
    clearAdminOrdersError: (state) => {
      state.error = null;
    },
    setExpandedOrder: (state, action) => {
      state.expandedOrder = action.payload;
    },
    toggleExpandedOrder: (state, action) => {
      const orderId = action.payload;
      state.expandedOrder = state.expandedOrder === orderId ? null : orderId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.ordenes = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
        state.loading = false;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

// definimos las acciones creadas en el slice para borrar los errores y manejar la orden expandida

export const { clearAdminOrdersError, setExpandedOrder, toggleExpandedOrder } = adminOrdersSlice.actions;

// ============== REDUCER ==============

// funcion reducer completa que maneja el slice de adminOrders

export default adminOrdersSlice.reducer;

// ============== SELECTORS ==============

// puentes entre los estados de redux y los componentes de React

export const selectAdminOrders = (state) => state.adminOrders.ordenes;
export const selectAdminOrdersLoading = (state) => state.adminOrders.loading;
export const selectAdminOrdersError = (state) => state.adminOrders.error;
export const selectAdminOrdersPagination = (state) => state.adminOrders.pagination;
export const selectExpandedOrder = (state) => state.adminOrders.expandedOrder;

