import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCategorias, createCategoria, deleteCategoria } from '../../api/categorias';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todas las categorías
 * Puede ser llamado con o sin token (público o autenticado)
 */
export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    try {
      const data = await getAllCategorias(token);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || 'Error cargando categorías');
    }
  }
);

/**
 * Thunk para crear una nueva categoría (requiere autenticación)
 * @param {Object} categoria - { nombre }
 */
export const createNewCategoria = createAsyncThunk(
  'categorias/createNewCategoria',
  async (categoria, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await createCategoria(token, categoria);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Error creando categoría');
    }
  }
);

/**
 * Thunk para eliminar una categoría
 * @param {number} id - ID de la categoría
 */
export const deleteExistingCategoria = createAsyncThunk(
  'categorias/deleteExistingCategoria',
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await deleteCategoria(token, id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message || 'Error eliminando categoría');
    }
  }
);

// ============== SLICE ==============

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: {
    categorias: [],
    loading: false,
    creating: false,
    deleting: false,
    error: null,
    actionSuccess: null,
  },
  reducers: {
    clearCategoriasError: (state) => {
      state.error = null;
    },
    clearCategoriasActionSuccess: (state) => {
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH CATEGORIAS ==========
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.categorias = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ========== CREATE CATEGORIA ==========
      .addCase(createNewCategoria.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createNewCategoria.fulfilled, (state, action) => {
        state.categorias.push(action.payload);
        state.creating = false;
        state.actionSuccess = 'Categoría creada exitosamente';
      })
      .addCase(createNewCategoria.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      
      // ========== DELETE CATEGORIA ==========
      .addCase(deleteExistingCategoria.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteExistingCategoria.fulfilled, (state, action) => {
        state.categorias = state.categorias.filter(c => c.id !== action.payload.id);
        state.deleting = false;
        state.actionSuccess = 'Categoría eliminada exitosamente';
      })
      .addCase(deleteExistingCategoria.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

// definimos las acciones creadas en el slice para borrar los errores y mensajes de éxito

export const { clearCategoriasError, clearCategoriasActionSuccess } = categoriasSlice.actions;

// ============== REDUCER ==============

//funcion reducer completa que maneja el slice de categorias

export default categoriasSlice.reducer;

// ============== SELECTORS ==============

// puentes entre los estados de redux y los componentes de React

export const selectCategorias = (state) => state.categorias.categorias;
export const selectCategoriasLoading = (state) => state.categorias.loading;
export const selectCategoriasCreating = (state) => state.categorias.creating;
export const selectCategoriasDeleting = (state) => state.categorias.deleting;
export const selectCategoriasError = (state) => state.categorias.error;
export const selectCategoriasActionSuccess = (state) => state.categorias.actionSuccess;

