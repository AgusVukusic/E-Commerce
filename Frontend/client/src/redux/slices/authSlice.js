import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi } from '../../api/auth';

// ============== ASYNC THUNKS ==============

/**
 * Thunk para login de usuario
 * @param {Object} credentials - { email, password }
 * @returns {Object} User data con token
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password });

      // Transformar respuesta del backend al formato del store
      return {
        token: data.access_token,
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        rol: data.user.rol,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Credenciales inválidas');
    }
  }
);

/**
 * Thunk para registro de usuario
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Object} User data con token
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerApi(userData);

      // Transformar respuesta del backend al formato del store
      return {
        token: data.access_token,
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        rol: data.user.rol,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error en el registro');
    }
  }
);

/**
 * Thunk para logout de usuario
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.user?.token;
      if (token) {
        await logoutApi(token);
      }
    } catch (error) {
      // No importa si falla el logout en el backend
      // El usuario debe poder cerrar sesión localmente siempre
      console.log('Logout API falló, pero continuamos con logout local');
    }
  }
);

// ============== SLICE ==============

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // { token, id, username, email, rol, nombre, apellido }
    loading: false,
    error: null,
    loginSuccess: false,
    registerSuccess: false,
  },
  reducers: {
    /**
     * Acción para establecer usuario manualmente (útil para persistencia)
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    /**
     * Acción para limpiar usuario (logout manual)
     */
    clearUser: (state) => {
      state.user = null;
      state.loginSuccess = false;
      state.registerSuccess = false;
      state.error = null;
    },
    /**
     * Limpiar mensajes de error
     */
    clearAuthError: (state) => {
      state.error = null;
    },
    /**
     * Limpiar flags de éxito
     */
    clearAuthSuccess: (state) => {
      state.loginSuccess = false;
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.loginSuccess = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loginSuccess = false;
      })

      // ========== REGISTER ==========
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.registerSuccess = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      })

      // ========== LOGOUT ==========
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.loginSuccess = false;
        state.registerSuccess = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Limpiar usuario aunque falle el logout en backend
        state.user = null;
        state.loading = false;
        state.loginSuccess = false;
        state.registerSuccess = false;
      });
  },
});

// ============== ACTIONS ==============

export const { setUser, clearUser, clearAuthError, clearAuthSuccess } = authSlice.actions;

// ============== REDUCER ==============

export default authSlice.reducer;

// ============== SELECTORS ==============

/**
 * Selector para obtener el usuario actual
 */
export const selectUser = (state) => state.auth.user;

/**
 * Selector para obtener el estado de carga
 */
export const selectAuthLoading = (state) => state.auth.loading;

/**
 * Selector para obtener errores de autenticación
 */
export const selectAuthError = (state) => state.auth.error;

/**
 * Selector para saber si el login fue exitoso
 */
export const selectLoginSuccess = (state) => state.auth.loginSuccess;

/**
 * Selector para saber si el registro fue exitoso
 */
export const selectRegisterSuccess = (state) => state.auth.registerSuccess;

/**
 * Selector para saber si el usuario está autenticado
 */
export const selectIsAuthenticated = (state) => !!state.auth.user;

/**
 * Selector para obtener el rol del usuario
 */
export const selectUserRole = (state) => state.auth.user?.rol;

/**
 * Selector para obtener el ID del usuario
 */
export const selectUserId = (state) => state.auth.user?.id;

/**
 * Selector para obtener el token del usuario
 */
export const selectUserToken = (state) => state.auth.user?.token;

/**
 * Selector para obtener el email del usuario
 */
export const selectUserEmail = (state) => state.auth.user?.email;

/**
 * Selector para obtener el username del usuario
 */
export const selectUserUsername = (state) => state.auth.user?.username;

