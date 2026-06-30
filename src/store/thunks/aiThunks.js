import { createAsyncThunk } from '@reduxjs/toolkit';
import groqService from '../../services/aiService';
import { addUserMessage } from '../slices/aiSlice';

// Thunk 1: chiede all'AI una diagnosi completa della macchina
export const runDiagnosis = createAsyncThunk(
  'ai/diagnose',
  // Riceve un oggetto con macchina, allarmi e telemetria attuali
  async ({ machine, alarms, telemetry }, { rejectWithValue }) => {
    try {
      return await groqService.diagnose(machine, alarms, telemetry);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk 2: invia un messaggio in chat e riceve la risposta AI
export const sendChatMessage = createAsyncThunk(
  'ai/chat',
  // dispatch è disponibile nel secondo parametro: ci serve per
  // aggiungere subito il messaggio dell'utente alla chat
  // (PRIMA di aspettare la risposta dell'AI, così appare subito)
  async ({ message, history, machineContext }, { dispatch, rejectWithValue }) => {
    dispatch(addUserMessage(message)); // azione sincrona immediata
    try {
      return await groqService.chat(message, history, machineContext);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk 3: chiede all'AI di suggerire soglie di allarme per una macchina
export const fetchThresholds = createAsyncThunk(
  'ai/thresholds',
  async (machine, { rejectWithValue }) => {
    try {
      return await groqService.generateThresholds(machine);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);