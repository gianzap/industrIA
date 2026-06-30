import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import MachineCard from '../components/machines/MachineCard';
import MachineFilters from '../components/machines/MachineFilters';
import { useMachines } from '../hooks/useMachines';

export default function MachinesPage() {
  // Il custom hook fa già tutto il lavoro di filtraggio
  const { machines, total } = useMachines();

  return (
    <AppLayout>
      <PageHeader title="MACCHINE & IMPIANTI" subtitle={`${total} sistemi monitorati`} />

      <MachineFilters />

      {machines.length === 0 ? (
        <div className="scada-card p-12 text-center text-scada-textDim text-xs">
          Nessuna macchina corrisponde ai filtri
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map(m => <MachineCard key={m.id} machine={m} />)}
        </div>
      )}
    </AppLayout>
  );
}