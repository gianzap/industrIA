import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { acknowledge, acknowledgeAll } from '../store/slices/alarmsSlice';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import { formatDateTime, severityLabel } from '../utils/formatters';

const sevBorder = {
  alarm:   'border-l-4 border-scada-red',
  warning: 'border-l-4 border-scada-amber',
};

export default function AlarmsPage() {
  const dispatch = useDispatch();
  const { isTechnician } = useAuth();
  const alarms = useSelector(s => s.alarms.list);
  const [filter, setFilter] = useState('all');

  const filtered = alarms.filter(a => {
    if (filter === 'active') return !a.acknowledged;
    if (filter === 'ack')    return a.acknowledged;
    return true;
  });

  const activeCount = alarms.filter(a => !a.acknowledged).length;

  return (
    <AppLayout>
      <PageHeader
        title="GESTIONE ALLARMI"
        subtitle={`${activeCount} allarmi attivi`}
        action={
          isTechnician && activeCount > 0 && (
            <button onClick={() => dispatch(acknowledgeAll())} className="btn-cyan text-xs">
              ✓ Conferma tutti
            </button>
          )
        }
      />

      <div className="flex gap-2 mb-5">
        {[
          { v: 'all',    l: 'Tutti' },
          { v: 'active', l: `Attivi (${activeCount})` },
          { v: 'ack',    l: 'Confermati' },
        ].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === f.v
                ? 'bg-scada-cyan/10 text-scada-cyan border border-scada-cyan/30'
                : 'text-scada-textDim border border-scada-border hover:text-scada-text'
            }`}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="scada-card p-12 text-center text-scada-textDim text-xs">
            Nessun allarme in questa categoria
          </div>
        ) : (
          filtered.map(alarm => (
            <div key={alarm.id}
              className={`scada-card ${sevBorder[alarm.severity] || 'border-l-4 border-scada-border'} p-4 flex items-start justify-between gap-4 ${alarm.acknowledged ? 'opacity-50' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={alarm.severity === 'alarm' ? 'tag-alarm' : 'tag-warning'}>
                    {severityLabel(alarm.severity)}
                  </span>
                  <code className="text-xs text-scada-textDim font-mono">{alarm.code}</code>
                  <span className="text-xs text-scada-textDim">{alarm.machineName}</span>
                </div>
                <p className="text-sm text-scada-text">{alarm.description}</p>
                <p className="text-xs text-scada-textDim mt-1">{formatDateTime(alarm.timestamp)}</p>
              </div>

              <div className="flex-shrink-0">
                {!alarm.acknowledged && isTechnician ? (
                  <button onClick={() => dispatch(acknowledge(alarm.id))}
                    className="btn-ghost text-xs border border-scada-border px-3 py-1.5 hover:border-scada-green hover:text-scada-green">
                    ✓ Conferma
                  </button>
                ) : alarm.acknowledged ? (
                  <span className="text-xs text-scada-textDim">✓ Confermato</span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}