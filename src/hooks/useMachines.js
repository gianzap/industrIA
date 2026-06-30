import { useSelector } from 'react-redux';

// Custom hook: applica i filtri alla lista macchine
export function useMachines() {
  const { list, filters } = useSelector(s => s.machines);

  // Array.filter scorre tutta la lista e tiene solo gli elementi
  // che soddisfano TUTTE e tre le condizioni
  const filtered = list.filter(m => {
    // Se il filtro è 'all' la condizione è sempre vera (ignora il filtro)
    const matchStatus = filters.status === 'all' || m.status === filters.status;
    const matchPlant  = filters.plant  === 'all' || m.plant  === filters.plant;
    // toLowerCase() rende la ricerca case-insensitive
    const matchSearch = !filters.search ||
      m.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      m.type.toLowerCase().includes(filters.search.toLowerCase());

    return matchStatus && matchPlant && matchSearch;
  });

  // Estrae la lista unica di impianti (per popolare la select dei filtri)
  // Set rimuove i duplicati automaticamente
  const plants = [...new Set(list.map(m => m.plant))];

  return { machines: filtered, total: filtered.length, plants };
}