import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getVendedorProductos, 
    createProducto, 
    updateProducto, 
    getProducto as getProductoVendedor,
    deleteProducto,
    addImagenToProducto,
    deleteImagenFromProducto 
} from '../../api/vendedor';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todos los productos del vendedor
 * @param {Object} params - { page, size }
 */
export const fetchVendedorProductos = createAsyncThunk(
  'vendedor/fetchVendedorProductos',
  async ({ page = 0, size = 50 } = {}, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await getVendedorProductos(token, { page, size });
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando productos');
    }
  }
);

/**
 * Thunk para obtener un producto específico del vendedor
 * @param {number} id - ID del producto
 */
export const fetchVendedorProducto = createAsyncThunk(
  'vendedor/fetchVendedorProducto',
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await getProductoVendedor(token, id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando producto');
    }
  }
);

/**
 * Thunk para crear un nuevo producto
 * @param {Object} producto - Datos del producto
 */
export const createVendedorProducto = createAsyncThunk(
  'vendedor/createVendedorProducto',
  async (producto, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await createProducto(token, producto);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error creando producto');
    }
  }
);

/**
 * Thunk para actualizar un producto
 * @param {Object} params - { id, producto }
 */
export const updateVendedorProducto = createAsyncThunk(
  'vendedor/updateVendedorProducto',
  async ({ id, producto }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await updateProducto(token, id, producto);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error actualizando producto');
    }
  }
);

/**
 * Thunk para eliminar un producto
 * @param {number} id - ID del producto
 */
export const deleteVendedorProducto = createAsyncThunk(
  'vendedor/deleteVendedorProducto',
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await deleteProducto(token, id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando producto');
    }
  }
);

/**
 * Thunk para agregar una imagen a un producto
 * @param {Object} params - { productoId, url }
 */
export const addImagenProducto = createAsyncThunk(
  'vendedor/addImagenProducto',
  async ({ productoId, url }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await addImagenToProducto(token, productoId, url);
      return { productoId, imagen: data };
    } catch (error) {
      return rejectWithValue(error.message || 'Error agregando imagen');
    }
  }
);

/**
 * Thunk para eliminar una imagen de un producto
 * @param {Object} params - { productoId, imagenId }
 */
export const deleteImagenProducto = createAsyncThunk(
  'vendedor/deleteImagenProducto',
  async ({ productoId, imagenId }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await deleteImagenFromProducto(token, productoId, imagenId);
      return { productoId, imagenId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando imagen');
    }
  }
);

// ============== SLICE ==============

const vendedorSlice = createSlice({
  name: 'vendedor',
  initialState: {
    productos: [],
    currentProducto: null,
    loading: false,
    productLoading: false,
    error: null,
    actionSuccess: null,
  },
  reducers: {
    clearVendedorError: (state) => {
      state.error = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = null;
    },
    clearCurrentProducto: (state) => {
      state.currentProducto = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH PRODUCTOS ==========
      .addCase(fetchVendedorProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendedorProductos.fulfilled, (state, action) => {
        state.productos = action.payload;
        state.loading = false;
      })
      .addCase(fetchVendedorProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== FETCH PRODUCTO ==========
      .addCase(fetchVendedorProducto.pending, (state) => {
        state.productLoading = true;
        state.error = null;
      })
      .addCase(fetchVendedorProducto.fulfilled, (state, action) => {
        state.currentProducto = action.payload;
        state.productLoading = false;
      })
      .addCase(fetchVendedorProducto.rejected, (state, action) => {
        state.productLoading = false;
        state.error = action.payload;
      })
      
      // ========== CREATE PRODUCTO ==========
      .addCase(createVendedorProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendedorProducto.fulfilled, (state, action) => {
        state.productos.push(action.payload);
        state.loading = false;
        state.actionSuccess = 'Producto creado exitosamente';
      })
      .addCase(createVendedorProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== UPDATE PRODUCTO ==========
      .addCase(updateVendedorProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendedorProducto.fulfilled, (state, action) => {
        const index = state.productos.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.productos[index] = action.payload;
        }
        state.currentProducto = action.payload;
        state.loading = false;
        state.actionSuccess = 'Producto actualizado exitosamente';
      })
      .addCase(updateVendedorProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== DELETE PRODUCTO ==========
      .addCase(deleteVendedorProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendedorProducto.fulfilled, (state, action) => {
        state.productos = state.productos.filter(p => p.id !== action.payload.id);
        state.loading = false;
        state.actionSuccess = 'Producto eliminado exitosamente';
      })
      .addCase(deleteVendedorProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== ADD IMAGEN ==========
      .addCase(addImagenProducto.fulfilled, (state, action) => {
        state.actionSuccess = 'Imagen agregada exitosamente';
      })
      .addCase(addImagenProducto.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== DELETE IMAGEN ==========
      .addCase(deleteImagenProducto.fulfilled, (state) => {
        state.actionSuccess = 'Imagen eliminada exitosamente';
      })
      .addCase(deleteImagenProducto.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { clearVendedorError, clearActionSuccess, clearCurrentProducto } = vendedorSlice.actions;

// ============== REDUCER ==============

export default vendedorSlice.reducer;

// ============== SELECTORS ==============

export const selectVendedorProductos = (state) => state.vendedor.productos;
export const selectCurrentVendedorProducto = (state) => state.vendedor.currentProducto;
export const selectVendedorLoading = (state) => state.vendedor.loading;
export const selectVendedorProductLoading = (state) => state.vendedor.productLoading;
export const selectVendedorError = (state) => state.vendedor.error;
export const selectVendedorActionSuccess = (state) => state.vendedor.actionSuccess;

