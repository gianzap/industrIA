import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_TICKETS } from '../../utils/mockData';

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    list: INITIAL_TICKETS,
  },
  reducers: {
    // Crea un nuovo ticket con id generato automaticamente
    addTicket: (state, action) => {
      state.list.unshift({
        ...action.payload, // tutti i dati passati dal form
        // Genera un id tipo "TK004" basandosi sulla lunghezza attuale
        id: `TK${String(state.list.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'open', // ogni nuovo ticket parte come "aperto"
      });
    },
    // Modifica un ticket esistente (trovato per id)
    updateTicket: (state, action) => {
      const i = state.list.findIndex(t => t.id === action.payload.id);
      if (i !== -1) {
        // Merge tra il ticket esistente e i nuovi dati
        state.list[i] = { ...state.list[i], ...action.payload };
      }
    },
    // Chiude un ticket cambiando solo lo status
    closeTicket: (state, action) => {
      const ticket = state.list.find(t => t.id === action.payload);
      if (ticket) ticket.status = 'closed';
    },
  },
});

export const { addTicket, updateTicket, closeTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;