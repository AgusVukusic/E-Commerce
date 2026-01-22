import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDescuentoByProducto, createDescuento, deleteDescuento } from '../../api/descuentos';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener el descuento de un producto específico
 * @param {number} productoId - ID del producto
 */
export const fetchDescuentoByProducto = createAsyncThunk(
  'descuentos/fetchDescuentoByProducto',
  async (productoId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await getDescuentoByProducto(token, productoId);
      return { productoId, descuento: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando descuento');
    }
  }
);

/**
 * Thunk para crear un descuento para un producto
 * @param {Object} params - { productoId, descuentoData }
 */
export const createNewDescuento = createAsyncThunk(
  'descuentos/createNewDescuento',
  async ({ productoId, descuentoData }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await createDescuento(token, productoId, descuentoData);
      return { productoId, descuento: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Error creando descuento');
    }
  }
);

/**
 * Thunk para eliminar un descuento
 * @param {Object} params - { productoId, descuentoId }
 */
export const deleteExistingDescuento = createAsyncThunk(
  'descuentos/deleteExistingDescuento',
  async ({ productoId, descuentoId }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await deleteDescuento(token, productoId, descuentoId);
      return { productoId, descuentoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando descuento');
    }
  }
);

// ============== SLICE ==============

const descuentosSlice = createSlice({
  name: 'descuentos',
  initialState: {
    // Mapa de descuentos por productoId: { productoId: descuentoData }
    descuentosByProducto: {},
    loading: false,
    creating: false,
    deleting: false,
    error: null,
    actionSuccess: null,
  },
  reducers: {
    clearDescuentosError: (state) => {
      state.error = null;
    },
    clearDescuentosActionSuccess: (state) => {
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH DESCUENTO ==========
      .addCase(fetchDescuentoByProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDescuentoByProducto.fulfilled, (state, action) => {
        const { productoId, descuento } = action.payload;
        if (descuento) {
          state.descuentosByProducto[productoId] = descuento;
        }
        state.loading = false;
      })
      .addCase(fetchDescuentoByProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== CREATE DESCUENTO ==========
      .addCase(createNewDescuento.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createNewDescuento.fulfilled, (state, action) => {
        const { productoId, descuento } = action.payload;
        state.descuentosByProducto[productoId] = descuento;
        state.creating = false;
        state.actionSuccess = 'Descuento creado exitosamente';
      })
      .addCase(createNewDescuento.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // ========== DELETE DESCUENTO ==========
      .addCase(deleteExistingDescuento.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteExistingDescuento.fulfilled, (state, action) => {
        const { productoId } = action.payload;
        delete state.descuentosByProducto[productoId];
        state.deleting = false;
        state.actionSuccess = 'Descuento eliminado exitosamente';
      })
      .addCase(deleteExistingDescuento.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { clearDescuentosError, clearDescuentosActionSuccess } = descuentosSlice.actions;

// ============== REDUCER ==============

export default descuentosSlice.reducer;

// ============== SELECTORS ==============

export const selectDescuentosByProducto = (state) => state.descuentos.descuentosByProducto;
export const selectDescuentoByProductoId = (productoId) => (state) => {
  return state.descuentos.descuentosByProducto[productoId] || null;
};
export const selectDescuentosLoading = (state) => state.descuentos.loading;
export const selectDescuentosCreating = (state) => state.descuentos.creating;
export const selectDescuentosDeleting = (state) => state.descuentos.deleting;
export const selectDescuentosError = (state) => state.descuentos.error;
export const selectDescuentosActionSuccess = (state) => state.descuentos.actionSuccess;

