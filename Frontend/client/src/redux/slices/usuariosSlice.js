import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsuarios, promoverUsuario, degradarUsuario, getUsuarioById } from '../../api/usuarios';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para obtener todos los usuarios (solo ADMIN)
 * @param {Object} params - { page, size }
 */
export const fetchUsuarios = createAsyncThunk(
  'usuarios/fetchUsuarios',
  async ({ page = 0, size = 20 } = {}, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const data = await getAllUsuarios(token, page, size);
      return {
        content: data.content || [],
        page: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al cargar usuarios');
    }
  }
);

/**
 * Thunk para promover un usuario a ADMIN
 * @param {number} usuarioId - ID del usuario
 */
export const promoteUser = createAsyncThunk(
  'usuarios/promoteUser',
  async (usuarioId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await promoverUsuario(token, usuarioId);
      return { usuarioId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al promover usuario');
    }
  }
);

/**
 * Thunk para degradar un usuario a VENDEDOR
 * @param {number} usuarioId - ID del usuario
 */
export const demoteUser = createAsyncThunk(
  'usuarios/demoteUser',
  async (usuarioId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      await degradarUsuario(token, usuarioId);
      return { usuarioId };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al degradar usuario');
    }
  }
);

/**
 * Thunk para obtener un usuario por ID
 * @param {number} usuarioId - ID del usuario
 */
export const fetchUsuarioById = createAsyncThunk(
  'usuarios/fetchUsuarioById',
  async (usuarioId, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const token = auth.user?.token;

    if (!token) {
      return rejectWithValue('No autenticado');
    }

    try {
      const usuario = await getUsuarioById(token, usuarioId);
      return usuario;
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener usuario');
    }
  }
);

// ============== SLICE ==============

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: {
    usuarios: [],
    loading: false,
    error: null,
    pagination: {
      page: 0,
      totalPages: 0,
      totalElements: 0,
    },
    actionSuccess: null, // Mensaje de éxito de promover/degradar
  },
  reducers: {
    clearUsuariosError: (state) => {
      state.error = null;
    },
    clearActionSuccess: (state) => {
      state.actionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH USUARIOS ==========
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.usuarios = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
        state.loading = false;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== PROMOTE USER ==========
      .addCase(promoteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(promoteUser.fulfilled, (state, action) => {
        state.actionSuccess = 'Usuario promovido a ADMIN exitosamente';
      })
      .addCase(promoteUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ========== DEMOTE USER ==========
      .addCase(demoteUser.pending, (state) => {
        state.error = null;
      })
      .addCase(demoteUser.fulfilled, (state, action) => {
        state.actionSuccess = 'Usuario degradado a VENDEDOR exitosamente';
      })
      .addCase(demoteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ============== ACTIONS ==============

export const { clearUsuariosError, clearActionSuccess } = usuariosSlice.actions;

// ============== REDUCER ==============

export default usuariosSlice.reducer;

// ============== SELECTORS ==============

export const selectUsuarios = (state) => state.usuarios.usuarios;
export const selectUsuariosLoading = (state) => state.usuarios.loading;
export const selectUsuariosError = (state) => state.usuarios.error;
export const selectUsuariosPagination = (state) => state.usuarios.pagination;
export const selectUsuariosActionSuccess = (state) => state.usuarios.actionSuccess;

