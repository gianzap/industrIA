import { createSlice } from '@reduxjs/toolkit';
import { runDiagnosis, sendChatMessage, fetchThresholds } from '../thunks/aiThunks';

const aiSlice = createSlice({
  name: 'ai',
  initialState: {
    diagnosis:     null,  // risultato della diagnosi AI (oggetto JSON)
    messages:      [],    // storia della chat: [{role:'user',content:'...'}, ...]
    thresholds:    null,  // soglie suggerite dall'AI
    loadingDiag:   false, // true mentre la diagnosi è in corso
    loadingChat:   false, // true mentre l'AI sta "scrivendo"
    loadingThresh: false,
    error:         null,
  },
  reducers: {
    // Reset completo quando si cambia macchina
    clearDiagnosis: (state) => {
      state.diagnosis = null;
      state.messages  = [];
      state.error     = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Aggiunge subito il messaggio dell'utente (chiamato dal thunk)
    addUserMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      // --- DIAGNOSI ---
      .addCase(runDiagnosis.pending, (state) => {
        state.loadingDiag = true;
        state.error = null;
        state.diagnosis = null; // pulisce la vecchia diagnosi
      })
      .addCase(runDiagnosis.fulfilled, (state, action) => {
        state.loadingDiag = false;
        state.diagnosis = action.payload; // il JSON ricevuto dall'AI
      })
      .addCase(runDiagnosis.rejected, (state, action) => {
        state.loadingDiag = false;
        state.error = action.payload;
      })

      // --- CHAT ---
      .addCase(sendChatMessage.pending, (state) => {
        state.loadingChat = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loadingChat = false;
        // Aggiunge la risposta dell'AI (il messaggio utente era già stato aggiunto)
        state.messages.push({ role: 'assistant', content: action.payload });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loadingChat = false;
        state.error = action.payload;
      })

      // --- SOGLIE ---
      .addCase(fetchThresholds.pending, (state) => {
        state.loadingThresh = true;
      })
      .addCase(fetchThresholds.fulfilled, (state, action) => {
        state.loadingThresh = false;
        state.thresholds = action.payload;
      })
      .addCase(fetchThresholds.rejected, (state, action) => {
        state.loadingThresh = false;
        state.error = action.payload;
      });
  },
});

export const { clearDiagnosis, clearError, addUserMessage } = aiSlice.actions;
export default aiSlice.reducer;