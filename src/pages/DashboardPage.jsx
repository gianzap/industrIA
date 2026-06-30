import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import MachineCard from '../components/machines/MachineCard';
import StatusDot from '../components/ui/StatusDot';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/formatters';
import { MACHINES } from '../utils/mockData';

export default function DashboardPage() {
  const { userName } = useAuth();
  const alarms  = useSelector(s => s.alarms.list);
  const tickets = useSelector(s => s.tickets.list);

  // Calcoliamo le statistiche filtrando l'array MACHINES per stato
  const stats = {
    total:   MACHINES.length,
    ok:      MACHINES.filter(m => m.status === 'ok').length,
    warning: MACHINES.filter(m => m.status === 'warning').length,
    alarm:   MACHINES.filter(m => m.status === 'alarm').length,
    offline: MACHINES.filter(m => m.status === 'offline').length,
  };

  const activeAlarms = alarms.filter(a => !a.acknowledged);
  const openTickets  = tickets.filter(t => t.status !== 'closed');
  // Le macchine "critiche" sono quelle in warning O alarm
  const criticalMachines = MACHINES.filter(m => m.status === 'alarm' || m.status === 'warning');

  return (
    <AppLayout>
      <PageHeader
        title="SYSTEM OVERVIEW"
        subtitle={`Ultimo aggiornamento: ${formatDateTime(new Date().toISOString())} · ${userName}`}
      />

      {/* Barra statistiche: 5 box con i contatori */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Macchine',  value: stats.total,   color: 'text-scada-text' },
          { label: 'Operative', value: stats.ok,      color: 'text-scada-green' },
          { label: 'Attenzione',value: stats.warning, color: 'text-scada-amber' },
          { label: 'Allarme',   value: stats.alarm,   color: 'text-scada-red' },
          { label: 'Offline',   value: stats.offline, color: 'text-scada-muted' },
        ].map(s => (
          <div key={s.label} className="scada-card p-4 text-center">
            <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-scada-textDim uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Colonna sinistra (2/3): macchine critiche */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-scada-textDim uppercase tracking-widest">
              Macchine in stato critico
            </p>
            <Link to="/machines" className="text-xs text-scada-cyan hover:underline">
              Vedi tutte →
            </Link>
          </div>

          {/* Rendering condizionale: se non ci sono macchine critiche, messaggio positivo */}
          {criticalMachines.length === 0 ? (
            <div className="scada-card p-8 text-center text-scada-textDim text-xs">
              ✓ Tutti i sistemi operativi
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criticalMachines.map(m => <MachineCard key={m.id} machine={m} />)}
            </div>
          )}
        </div>

        {/* Colonna destra (1/3): allarmi e ticket recenti */}
        <div className="space-y-4">
          {/* Box allarmi attivi */}
          <div className="scada-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-scada-textDim uppercase tracking-widest">Allarmi Attivi</p>
              <Link to="/alarms" className="text-xs text-scada-cyan hover:underline">
                {activeAlarms.length} →
              </Link>
            </div>
            {activeAlarms.length === 0 ? (
              <p className="text-scada-textDim text-xs">Nessun allarme attivo</p>
            ) : (
              // slice(0,4): mostriamo solo i primi 4, il resto va in /alarms
              activeAlarms.slice(0, 4).map(a => (
                <div key={a.id} className="flex items-start gap-2 py-2 border-b border-scada-border last:border-0">
                  <StatusDot status={a.severity === 'alarm' ? 'alarm' : 'warning'} size="sm" />
                  <div>
                    <p className="text-xs text-scada-text">{a.machineName}</p>
                    <p className="text-xs text-scada-textDim truncate max-w-[160px]">{a.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Box ticket aperti */}
          <div className="scada-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-scada-textDim uppercase tracking-widest">Ticket Aperti</p>
              <Link to="/tickets" className="text-xs text-scada-cyan hover:underline">
                {openTickets.length} →
              </Link>
            </div>
            {openTickets.slice(0, 3).map(t => (
              <div key={t.id} className="py-2 border-b border-scada-border last:border-0">
                <p className="text-xs text-scada-text truncate">{t.title}</p>
                <p className="text-xs text-scada-textDim">{t.machineName} · {t.assignedTo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}