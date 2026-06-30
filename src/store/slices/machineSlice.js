import { createSlice } from '@reduxjs/toolkit';
import { MACHINES } from '../../utils/mockData';

const machinesSlice = createSlice({
  name: 'machines',
  initialState: {
    list:      MACHINES,  // le 10 macchine, sempre disponibili
    current:   null,      // la macchina aperta in /machine/:id
    telemetry: {},        // { M001: {...}, M003: {...} } aggiornato ogni 3s
    filters:   { status: 'all', plant: 'all', search: '' },
  },
  reducers: {
    // Imposta quale macchina è "aperta" cercandola per id
    setCurrent: (state, action) => {
      state.current = state.list.find(m => m.id === action.payload) || null;
    },
    // Pulisce la macchina corrente (quando si lascia la pagina dettaglio)
    clearCurrent: (state) => {
      state.current = null;
      state.telemetry = {};
    },
    // Salva nuovi dati di telemetria per una macchina specifica
    updateTelemetry: (state, action) => {
      // action.payload = { machineId: 'M003', data: {temp:95, ...} }
      state.telemetry[action.payload.machineId] = action.payload.data;
    },
    // Aggiorna i filtri (merge con quelli esistenti)
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setCurrent, clearCurrent, updateTelemetry, setFilter } = machinesSlice.actions;
export default machinesSlice.reducer;