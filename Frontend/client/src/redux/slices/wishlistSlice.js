import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWishlist,
  addItemToWishlist,
  removeWishlistItem,
  clearWishlist,
  createWishlistIfMissing,
} from '../../api/wishlist';
import { createCartIfMissing, addItemToCart } from '../../api/cart';
import { getProducto } from '../../api/products';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener la wishlist del usuario
 * Enriquece los items con información de productos (imágenes, precios, etc.)
 */
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      // Asegurar que la wishlist existe
      await createWishlistIfMissing(token, usuarioId);
      const data = await getWishlist(token, usuarioId);

      // Enriquecer items con información de productos
      if (data?.items?.length > 0) {
        const enriched = await Promise.all(
          data.items.map(async (item) => {
            try {
              const producto = await getProducto(item.productoId);
              
              // Obtener URL de imagen
              let imagenUrl = producto.imagenUrl;
              if (!imagenUrl && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
                imagenUrl = producto.imagenes[0].url || producto.imagenes[0].imagenUrl;
              }

              return { 
                ...item, 
                imagenUrl, 
                imagenes: producto.imagenes,
                precio: producto.precio,
                tieneDescuento: producto.tieneDescuento,
                precioConDescuento: producto.precioConDescuento,
                porcentajeDescuento: producto.porcentajeDescuento,
              };
            } catch (error) {
              console.error(`Error al cargar producto ${item.productoId}:`, error);
              return item; // Devolver item sin enriquecer si falla
            }
          })
        );
        return { ...data, enrichedItems: enriched };
      }

      return { ...data, enrichedItems: [] };
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando wishlist');
    }
  }
);

/**
 * Thunk para agregar un producto a la wishlist
 * @param {Object} params - { productoId, productoTitulo }
 */
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ productoId, productoTitulo }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('Debes iniciar sesión');
    }

    try {
      await addItemToWishlist(token, usuarioId, productoId, productoTitulo);
      return { productoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error agregando a wishlist');
    }
  }
);

/**
 * Thunk para eliminar un producto de la wishlist
 * @param {number} productoId - ID del producto a eliminar
 */
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productoId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const updated = await removeWishlistItem(token, usuarioId, productoId);
      return { productoId, wishlistData: updated };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando de wishlist');
    }
  }
);

/**
 * Thunk para vaciar la wishlist completamente
 */
export const clearAllWishlist = createAsyncThunk(
  'wishlist/clearAllWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const updated = await clearWishlist(token, usuarioId);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message || 'Error vaciando wishlist');
    }
  }
);

/**
 * Thunk para mover todos los items de la wishlist al carrito
 * Agrega items uno por uno al carrito y luego vacía la wishlist
 */
export const moveAllToCart = createAsyncThunk(
  'wishlist/moveAllToCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth, wishlist } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;
    const items = wishlist.enrichedItems;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    if (!items.length) {
      return rejectWithValue('No hay productos en la wishlist');
    }

    try {
      // Asegurar que el carrito existe
      await createCartIfMissing(token, usuarioId);

      let successCount = 0;
      let failCount = 0;

      // Agregar items al carrito uno por uno
      for (const item of items) {
        try {
          await addItemToCart(token, usuarioId, {
            productoId: item.productoId,
            cantidad: 1,
            precio: item.precio,
          });
          successCount++;
        } catch (error) {
          console.error(`Error al agregar ${item.productoTitulo}:`, error);
          failCount++;
        }
      }

      // Si se agregaron algunos productos con éxito, vaciar la wishlist
      if (successCount > 0) {
        await clearWishlist(token, usuarioId);
      }

      return { successCount, failCount };
    } catch (error) {
      return rejectWithValue(error.message || 'Error moviendo a carrito');
    }
  }
);

// ============== SLICE ==============

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: null,
    enrichedItems: [],
    count: 0,
    loading: false,
    addingToWishlist: false,
    movingToCart: false,
    error: null,
    moveResult: null,
  },
  reducers: {
    /**
     * Limpiar errores de la wishlist
     */
    clearWishlistError: (state) => {
      state.error = null;
    },
    /**
     * Resetear la wishlist (útil después de logout)
     */
    resetWishlist: (state) => {
      state.wishlist = null;
      state.enrichedItems = [];
      state.count = 0;
      state.moveResult = null;
      state.error = null;
    },
    /**
     * Limpiar resultado de mover al carrito
     */
    clearMoveResult: (state) => {
      state.moveResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH WISHLIST ==========
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.enrichedItems = action.payload.enrichedItems || [];
        state.count = action.payload.items?.length || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.count = 0;
      })
      
      // ========== ADD TO WISHLIST ==========
      .addCase(addToWishlist.pending, (state) => {
        state.addingToWishlist = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.addingToWishlist = false;
        // El count se actualizará cuando se haga fetchWishlist
        state.count += 1;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.addingToWishlist = false;
        state.error = action.payload;
      })
      
      // ========== REMOVE FROM WISHLIST ==========
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const { productoId } = action.payload;
        state.wishlist = action.payload.wishlistData;
        state.enrichedItems = state.enrichedItems.filter((item) => item.productoId !== productoId);
        state.count = state.enrichedItems.length;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== CLEAR WISHLIST ==========
      .addCase(clearAllWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(clearAllWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.enrichedItems = [];
        state.count = 0;
      })
      .addCase(clearAllWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== MOVE ALL TO CART ==========
      .addCase(moveAllToCart.pending, (state) => {
        state.movingToCart = true;
        state.error = null;
      })
      .addCase(moveAllToCart.fulfilled, (state, action) => {
        state.movingToCart = false;
        state.enrichedItems = [];
        state.count = 0;
        state.moveResult = action.payload;
      })
      .addCase(moveAllToCart.rejected, (state, action) => {
        state.movingToCart = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { clearWishlistError, resetWishlist, clearMoveResult } = wishlistSlice.actions;

// ============== REDUCER ==============

export default wishlistSlice.reducer;

// ============== SELECTORS ==============

/**
 * Selector para obtener la wishlist completa
 */
export const selectWishlist = (state) => state.wishlist.wishlist;

/**
 * Selector para obtener los items enriquecidos de la wishlist
 */
export const selectWishlistItems = (state) => state.wishlist.enrichedItems;

/**
 * Selector para obtener el contador de items
 */
export const selectWishlistCount = (state) => state.wishlist.count;

/**
 * Selector para obtener el estado de carga
 */
export const selectWishlistLoading = (state) => state.wishlist.loading;

/**
 * Selector para saber si se está agregando a la wishlist
 */
export const selectAddingToWishlist = (state) => state.wishlist.addingToWishlist;

/**
 * Selector para saber si se está moviendo al carrito
 */
export const selectMovingToCart = (state) => state.wishlist.movingToCart;

/**
 * Selector para obtener errores de la wishlist
 */
export const selectWishlistError = (state) => state.wishlist.error;

/**
 * Selector para obtener el resultado de mover al carrito
 */
export const selectMoveResult = (state) => state.wishlist.moveResult;

/**
 * Selector para saber si la wishlist está vacía
 */
export const selectIsWishlistEmpty = (state) => state.wishlist.enrichedItems.length === 0;

