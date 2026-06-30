import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../thunks/authThunks';
import authService from '../../services/authService';

const authSlice = createSlice({
  name: 'auth', // prefisso delle action (es. "auth/logout")

  // Stato iniziale: al caricamento controlla se c'è già un utente salvato
  initialState: {
    user:     authService.getCurrentUser(), // null se non loggato
    isLogged: !!authService.getCurrentUser(), // true/false
    loading:  false,
    error:    null,
  },

  // reducers: azioni SINCRONE (non aspettano nessuna API)
  reducers: {
    logout(state) {
      authService.logout(); // rimuove da localStorage
      state.user = null;
      state.isLogged = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },

  // extraReducers: gestisce le azioni generate dai THUNK (asincrone)
  extraReducers: (builder) => {
    builder
      // Mentre la chiamata API è in corso
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Se la chiamata ha successo
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLogged = true;
      })
      // Se la chiamata fallisce
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Esporta le action sincrone per usarle nei componenti
export const { logout, clearError } = authSlice.actions;
// Esporta il reducer per registrarlo nello store
export default authSlice.reducer;