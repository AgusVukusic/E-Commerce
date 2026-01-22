import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDisponibles, buscarPorTitulo, getProducto } from '../../api/products';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todos los productos disponibles
 * @param {Object} params - { page, size }
 * @returns {Array} Lista de productos
 */
export const fetchProductos = createAsyncThunk(
  'products/fetchProductos',
  async ({ page = 0, size = 200 } = {}, { rejectWithValue }) => {
    try {
      const data = await getDisponibles({ page, size });
      return Array.isArray(data?.content) ? data.content : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando productos');
    }
  }
);

/**
 * Thunk para buscar productos por título
 * @param {Object} params - { titulo, page, size }
 * @returns {Object} Página de resultados de búsqueda
 */
export const searchProductos = createAsyncThunk(
  'products/searchProductos',
  async ({ titulo, page = 0, size = 12 }, { rejectWithValue }) => {
    try {
      const data = await buscarPorTitulo({ titulo, page, size });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error en la búsqueda');
    }
  }
);

/**
 * Thunk para obtener un producto por ID
 * @param {number} id - ID del producto
 * @returns {Object} Datos del producto
 */
export const fetchProductoById = createAsyncThunk(
  'products/fetchProductoById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getProducto(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'No se pudo cargar el producto');
    }
  }
);

// ============== SLICE ==============

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    // Lista principal de productos (para Home)
    items: [],
    loading: false,
    error: null,
    
    // Resultados de búsqueda (para Search)
    searchResults: null,
    searchLoading: false,
    searchError: null,
    
    // Producto actual (para ProductDetail)
    currentProduct: null,
    productLoading: false,
    productError: null,
  },
  reducers: {
    /**
     * Limpiar resultados de búsqueda
     */
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
    },
    /**
     * Limpiar producto actual
     */
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productError = null;
    },
    /**
     * Limpiar todos los errores
     */
    clearProductsError: (state) => {
      state.error = null;
      state.searchError = null;
      state.productError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH PRODUCTOS ==========
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      
      // ========== SEARCH PRODUCTOS ==========
      .addCase(searchProductos.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProductos.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.searchLoading = false;
        state.searchError = null;
      })
      .addCase(searchProductos.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.searchResults = null;
      })
      
      // ========== FETCH PRODUCTO BY ID ==========
      .addCase(fetchProductoById.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductoById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.productLoading = false;
        state.productError = null;
      })
      .addCase(fetchProductoById.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
        state.currentProduct = null;
      });
  },
});

// ============== ACTIONS ==============

export const { clearSearchResults, clearCurrentProduct, clearProductsError } = productsSlice.actions;

// ============== REDUCER ==============

export default productsSlice.reducer;

// ============== SELECTORS ==============

/**
 * Selector para obtener la lista de productos
 */
export const selectProducts = (state) => state.products.items;

/**
 * Selector para obtener el estado de carga de productos
 */
export const selectProductsLoading = (state) => state.products.loading;

/**
 * Selector para obtener errores de productos
 */
export const selectProductsError = (state) => state.products.error;

/**
 * Selector para obtener resultados de búsqueda
 */
export const selectSearchResults = (state) => state.products.searchResults;

/**
 * Selector para obtener el estado de carga de búsqueda
 */
export const selectSearchLoading = (state) => state.products.searchLoading;

/**
 * Selector para obtener errores de búsqueda
 */
export const selectSearchError = (state) => state.products.searchError;

/**
 * Selector para obtener el producto actual
 */
export const selectCurrentProduct = (state) => state.products.currentProduct;

/**
 * Selector para obtener el estado de carga del producto
 */
export const selectProductLoading = (state) => state.products.productLoading;

/**
 * Selector para obtener errores del producto
 */
export const selectProductError = (state) => state.products.productError;

/**
 * Selector para obtener si hay productos
 */
export const selectHasProducts = (state) => state.products.items.length > 0;

/**
 * Selector para obtener el total de productos
 */
export const selectProductsCount = (state) => state.products.items.length;

