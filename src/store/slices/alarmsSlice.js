import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_ALARMS } from '../../utils/mockData';

const alarmsSlice = createSlice({
  name: 'alarms',
  initialState: {
    list: INITIAL_ALARMS, // i 5 allarmi precaricati
  },
  reducers: {
    // Conferma UN allarme specifico (lo trova per id e lo modifica)
    acknowledge: (state, action) => {
      const alarm = state.list.find(a => a.id === action.payload);
      if (alarm) alarm.acknowledged = true;
      // Nota: Redux Toolkit usa Immer sotto il cofano,
      // quindi puoi "mutare" lo stato direttamente così
      // anche se Redux richiede immutabilità — Immer la gestisce per te
    },
    // Conferma TUTTI gli allarmi attivi in un colpo solo
    acknowledgeAll: (state) => {
      state.list.forEach(a => { a.acknowledged = true; });
    },
    // Aggiunge un nuovo allarme in cima alla lista
    addAlarm: (state, action) => {
      state.list.unshift(action.payload); // unshift = aggiunge all'inizio
    },
  },
});

export const { acknowledge, acknowledgeAll, addAlarm } = alarmsSlice.actions;
export default alarmsSlice.reducer;