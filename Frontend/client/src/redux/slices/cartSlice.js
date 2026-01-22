import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  createCartIfMissing,
  addItemToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
  validateCheckout,
  doCheckout,
} from '../../api/cart';
import { getProducto } from '../../api/products';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener el carrito del usuario
 * Enriquece los items con información de productos (imágenes, descuentos, etc.)
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      // Asegurar que el carrito existe
      await createCartIfMissing(token, usuarioId);
      const data = await getCart(token, usuarioId);

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

              // Calcular precios y subtotal
              const precioBase = producto.precio || 0;
              const tieneDescuento = producto.tieneDescuento;
              const precioConDescuento = producto.precioConDescuento || 0;
              const precioFinal = tieneDescuento ? precioConDescuento : precioBase;
              const cantidad = item.cantidad || 0;
              const subtotal = precioFinal * cantidad;

              return {
                ...item,
                imagenUrl,
                imagenes: producto.imagenes,
                precio: precioBase,
                precioConDescuento,
                tieneDescuento,
                subtotal,
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
      return rejectWithValue(error.message || 'Error cargando carrito');
    }
  }
);

/**
 * Thunk para agregar un producto al carrito
 * @param {Object} params - { productoId, cantidad, precio }
 */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productoId, cantidad, precio }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('Debes iniciar sesión');
    }

    try {
      await createCartIfMissing(token, usuarioId);
      await addItemToCart(token, usuarioId, { productoId, cantidad, precio });
      return { productoId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error agregando al carrito');
    }
  }
);

/**
 * Thunk para actualizar la cantidad de un producto en el carrito
 * @param {Object} params - { productoId, cantidad }
 */
export const updateCartQty = createAsyncThunk(
  'cart/updateCartQty',
  async ({ productoId, cantidad }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const updated = await updateCartItemQty(token, usuarioId, productoId, cantidad);
      return { productoId, cantidad, cartData: updated };
    } catch (error) {
      return rejectWithValue(error.message || 'Error actualizando cantidad');
    }
  }
);

/**
 * Thunk para eliminar un producto del carrito
 * @param {number} productoId - ID del producto a eliminar
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productoId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const updated = await removeCartItem(token, usuarioId, productoId);
      return { productoId, cartData: updated };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando del carrito');
    }
  }
);

/**
 * Thunk para vaciar el carrito completamente
 */
export const clearAllCart = createAsyncThunk(
  'cart/clearAllCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const updated = await clearCart(token, usuarioId);
      return updated;
    } catch (error) {
      return rejectWithValue(error.message || 'Error vaciando carrito');
    }
  }
);

/**
 * Thunk para validar el carrito antes del checkout
 */
export const validateCart = createAsyncThunk(
  'cart/validateCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const { valido, mensaje } = await validateCheckout(token, usuarioId);
      return { valido, mensaje };
    } catch (error) {
      return rejectWithValue(error.message || 'Error validando checkout');
    }
  }
);

/**
 * Thunk para realizar el checkout (crear orden)
 */
export const performCheckout = createAsyncThunk(
  'cart/performCheckout',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;
    const usuarioId = auth.user?.id;

    if (!token || !usuarioId) {
      return rejectWithValue('No autenticado');
    }

    try {
      const orden = await doCheckout(token, usuarioId);
      return orden;
    } catch (error) {
      return rejectWithValue(error.message || 'Error realizando checkout');
    }
  }
);

// ============== SLICE ==============

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    enrichedItems: [],
    count: 0,
    loading: false,
    addingToCart: false,
    validating: false,
    checkingOut: false,
    checkoutValidation: null,
    lastOrder: null,
    error: null,
  },
  reducers: {
    /**
     * Limpiar errores del carrito
     */
    clearCartError: (state) => {
      state.error = null;
    },
    /**
     * Resetear el carrito (útil después de logout)
     */
    resetCart: (state) => {
      state.cart = null;
      state.enrichedItems = [];
      state.count = 0;
      state.checkoutValidation = null;
      state.lastOrder = null;
      state.error = null;
    },
    /**
     * Limpiar validación de checkout
     */
    clearCheckoutValidation: (state) => {
      state.checkoutValidation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH CART ==========
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.enrichedItems = action.payload.enrichedItems || [];
        state.count = action.payload.items?.length || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.count = 0;
      })
      
      // ========== ADD TO CART ==========
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.addingToCart = false;
        // El count se actualizará cuando se haga fetchCart
        state.count += 1;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false;
        state.error = action.payload;
      })
      
      // ========== UPDATE QUANTITY ==========
      .addCase(updateCartQty.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartQty.fulfilled, (state, action) => {
        const { productoId, cantidad } = action.payload;
        state.cart = action.payload.cartData;
        
        // Actualizar enrichedItems localmente
        state.enrichedItems = state.enrichedItems.map((item) =>
          item.productoId === productoId
            ? {
                ...item,
                cantidad,
                subtotal: (item.tieneDescuento ? item.precioConDescuento : item.precio) * cantidad,
              }
            : item
        );
      })
      .addCase(updateCartQty.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== REMOVE FROM CART ==========
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { productoId } = action.payload;
        state.cart = action.payload.cartData;
        state.enrichedItems = state.enrichedItems.filter((item) => item.productoId !== productoId);
        state.count = state.enrichedItems.length;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== CLEAR CART ==========
      .addCase(clearAllCart.pending, (state) => {
        state.error = null;
      })
      .addCase(clearAllCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.enrichedItems = [];
        state.count = 0;
      })
      .addCase(clearAllCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // ========== VALIDATE CART ==========
      .addCase(validateCart.pending, (state) => {
        state.validating = true;
        state.checkoutValidation = null;
        state.error = null;
      })
      .addCase(validateCart.fulfilled, (state, action) => {
        state.validating = false;
        state.checkoutValidation = action.payload;
      })
      .addCase(validateCart.rejected, (state, action) => {
        state.validating = false;
        state.error = action.payload;
      })
      
      // ========== PERFORM CHECKOUT ==========
      .addCase(performCheckout.pending, (state) => {
        state.checkingOut = true;
        state.error = null;
      })
      .addCase(performCheckout.fulfilled, (state, action) => {
        state.checkingOut = false;
        state.lastOrder = action.payload;
        // Limpiar el carrito después del checkout exitoso
        state.cart = null;
        state.enrichedItems = [];
        state.count = 0;
        state.checkoutValidation = null;
      })
      .addCase(performCheckout.rejected, (state, action) => {
        state.checkingOut = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { clearCartError, resetCart, clearCheckoutValidation } = cartSlice.actions;

// ============== REDUCER ==============

export default cartSlice.reducer;

// ============== SELECTORS ==============

/**
 * Selector para obtener el carrito completo
 */
export const selectCart = (state) => state.cart.cart;

/**
 * Selector para obtener los items enriquecidos del carrito
 */
export const selectCartItems = (state) => state.cart.enrichedItems;

/**
 * Selector para obtener el contador de items
 */
export const selectCartCount = (state) => state.cart.count;

/**
 * Selector para obtener el estado de carga
 */
export const selectCartLoading = (state) => state.cart.loading;

/**
 * Selector para saber si se está agregando al carrito
 */
export const selectAddingToCart = (state) => state.cart.addingToCart;

/**
 * Selector para saber si se está validando
 */
export const selectCartValidating = (state) => state.cart.validating;

/**
 * Selector para saber si se está haciendo checkout
 */
export const selectCheckingOut = (state) => state.cart.checkingOut;

/**
 * Selector para obtener la validación del checkout
 */
export const selectCheckoutValidation = (state) => state.cart.checkoutValidation;

/**
 * Selector para obtener la última orden creada
 */
export const selectLastOrder = (state) => state.cart.lastOrder;

/**
 * Selector para obtener errores del carrito
 */
export const selectCartError = (state) => state.cart.error;

/**
 * Selector para saber si el carrito está vacío
 */
export const selectIsCartEmpty = (state) => state.cart.enrichedItems.length === 0;

/**
 * Selector para obtener el total del carrito
 */
export const selectCartTotal = (state) => {
  return state.cart.enrichedItems.reduce((total, item) => {
    return total + (item.subtotal || 0);
  }, 0);
};

/**
 * Selector para obtener el total de items (suma de cantidades)
 */
export const selectCartTotalItems = (state) => {
  return state.cart.enrichedItems.reduce((total, item) => {
    return total + (item.cantidad || 0);
  }, 0);
};

