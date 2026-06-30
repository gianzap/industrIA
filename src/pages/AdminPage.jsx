import { useSelector } from 'react-redux';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Badge from '../components/ui/Badge';
import StatusDot from '../components/ui/StatusDot';
import { MACHINES } from '../utils/mockData';
import authService from '../services/authService';
import { roleLabel} from '../utils/formatters';

export default function AdminPage() {
  const alarms  = useSelector(s => s.alarms.list);
  const tickets = useSelector(s => s.tickets.list);
  const users   = authService.getAllUsers();

  const stats = [
    { l: 'Macchine totali',    v: MACHINES.length,                                    c: 'text-scada-text' },
    { l: 'Allarmi attivi',     v: alarms.filter(a => !a.acknowledged).length,         c: 'text-scada-red' },
    { l: 'Ticket aperti',      v: tickets.filter(t => t.status !== 'closed').length,  c: 'text-scada-cyan' },
    { l: 'Utenti registrati',  v: users.length,                                       c: 'text-scada-text' },
    { l: 'In allarme',         v: MACHINES.filter(m => m.status === 'alarm').length,  c: 'text-scada-red' },
    { l: 'Offline',            v: MACHINES.filter(m => m.status === 'offline').length,c: 'text-scada-muted' },
  ];

  return (
    <AppLayout>
      <PageHeader title="ADMIN PANEL" subtitle="Gestione sistema IndustrIA" />

      {/* Statistiche */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
          <div key={s.l} className="scada-card p-4 text-center">
            <div className={`text-2xl font-mono font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-scada-textDim uppercase tracking-widest mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tabella utenti */}
        <div className="scada-card">
          <div className="px-5 py-3 border-b border-scada-border">
            <p className="text-xs text-scada-textDim uppercase tracking-widest">Utenti Sistema</p>
          </div>
          <div className="divide-y divide-scada-border">
            {users.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-scada-text text-sm">{u.name} {u.surname}</p>
                  <p className="text-scada-textDim text-xs">{u.email} · {u.company}</p>
                </div>
                <Badge
                  label={roleLabel(u.role)}
                  variant={u.role === 'admin' ? 'alarm' : u.role === 'technician' ? 'open' : 'offline'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stato macchine */}
        <div className="scada-card">
          <div className="px-5 py-3 border-b border-scada-border">
            <p className="text-xs text-scada-textDim uppercase tracking-widest">Stato Macchine</p>
          </div>
          <div className="divide-y divide-scada-border max-h-80 overflow-y-auto">
            {MACHINES.map(m => (
              <div key={m.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot status={m.status} size="sm" />
                  <div className="min-w-0">
                    <p className="text-scada-text text-xs truncate">{m.name}</p>
                    <p className="text-scada-textDim text-xs">{m.plant}</p>
                  </div>
                </div>
                <span className="text-xs text-scada-textDim font-mono flex-shrink-0">
                  {m.uptime}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}