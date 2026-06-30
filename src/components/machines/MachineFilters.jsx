import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/slices/machinesSlice';
import { MACHINES } from '../../utils/mockData';

const STATUSES = [
  { v: 'all', l: 'Tutti' }, { v: 'ok', l: 'OK' },
  { v: 'warning', l: 'Attenzione' }, { v: 'alarm', l: 'Allarme' }, { v: 'offline', l: 'Offline' },
];

// Estrae dinamicamente la lista impianti unici da MACHINES
const PLANTS = ['all', ...new Set(MACHINES.map(m => m.plant))];

export default function MachineFilters() {
  const dispatch = useDispatch();
  const { filters } = useSelector(s => s.machines);

  // Funzione helper per fare dispatch di setFilter con meno codice ripetuto
  const upd = (key, value) => dispatch(setFilter({ [key]: value }));

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <input
        type="text"
        placeholder="🔍 Cerca macchina..."
        value={filters.search}
        onChange={e => upd('search', e.target.value)}
        className="input-scada w-48"
      />
      <select value={filters.status} onChange={e => upd('status', e.target.value)} className="input-scada w-40">
        {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
      </select>
      <select value={filters.plant} onChange={e => upd('plant', e.target.value)} className="input-scada w-52">
        {PLANTS.map(p => <option key={p} value={p}>{p === 'all' ? 'Tutti gli impianti' : p}</option>)}
      </select>
    </div>
  );
}