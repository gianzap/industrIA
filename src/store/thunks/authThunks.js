import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// createAsyncThunk crea automaticamente 3 action types:
// 'auth/login/pending', 'auth/login/fulfilled', 'auth/login/rejected'
export const loginUser = createAsyncThunk(
  'auth/login', // nome dell'action

  // Funzione asincrona che fa il lavoro vero
  // Primo parametro: i dati passati al dispatch (email, password)
  // Secondo parametro: oggetto con utility di Redux (qui usiamo rejectWithValue)
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Chiama il service che fa la "fake" chiamata API
      return await authService.login(email, password);
      // Se va bene, questo valore diventa action.payload in "fulfilled"
    } catch (error) {
      // Se fallisce, passiamo il messaggio di errore
      return rejectWithValue(error.message);
      // Questo valore diventa action.payload in "rejected"
    }
  }
);