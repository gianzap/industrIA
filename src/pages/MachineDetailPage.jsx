import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrent, clearCurrent, updateTelemetry } from '../store/slices/machinesSlice';
import { clearDiagnosis } from '../store/slices/aiSlice';
import { generateTelemetry } from '../utils/mockData';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import TelemetryCard from '../components/ui/TelemetryCard';
import StatusDot from '../components/ui/StatusDot';
import DiagnosisPanel from '../components/ai/DiagnosisPanel';
import AiChat from '../components/ai/AiChat';
import Modal from '../components/ui/Modal';
import { statusLabel, formatDate, formatDateTime } from '../utils/formatters';

export default function MachineDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const machine   = useSelector(s => s.machines.current);
  const telemetry = useSelector(s => s.machines.telemetry[id]);
  const alarms    = useSelector(s => s.alarms.list.filter(a => a.machineId === id));
  const [tab, setTab] = useState('diagnosis');
  const [showThresh, setShowThresh] = useState(false);

  useEffect(() => {
    dispatch(setCurrent(id));
    dispatch(clearDiagnosis());

    // Telemetria live: aggiorna ogni 3 secondi
    const tick = () => dispatch(updateTelemetry({
      machineId: id,
      data: generateTelemetry(id),
    }));
    tick();
    const interval = setInterval(tick, 3000);

    // Cleanup: ferma il timer quando si lascia la pagina
    return () => {
      clearInterval(interval);
      dispatch(clearCurrent());
      dispatch(clearDiagnosis());
    };
  }, [id]);

  if (!machine) return (
    <AppLayout>
      <div className="text-scada-textDim text-sm text-center py-20">
        Macchina non trovata
      </div>
    </AppLayout>
  );

  // Funzioni che determinano lo stato del sensore dal valore
  const getTempStatus  = t => !t ? 'offline' : t > 90 ? 'alarm' : t > 80 ? 'warning' : 'ok';
  const getVibrStatus  = v => !v ? 'offline' : v > 8  ? 'alarm' : v > 5  ? 'warning' : 'ok';
  const getEffStatus   = e => (e === undefined || e === null) ? 'offline' : e < 50 ? 'alarm' : e < 70 ? 'warning' : 'ok';

  const statusColors = {
    ok: 'text-scada-green', warning: 'text-scada-amber',
    alarm: 'text-scada-red', offline: 'text-scada-muted',
  };

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="mb-2 text-xs text-scada-textDim">
        <Link to="/machines" className="hover:text-scada-cyan">Macchine</Link>
        {' / '}{machine.name}
      </div>

      <PageHeader
        title={machine.name}
        subtitle={`${machine.id} · ${machine.type} · ${machine.plc}`}
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusDot status={machine.status} size="lg" />
              <span className={`text-sm font-mono font-semibold ${statusColors[machine.status]}`}>
                {statusLabel(machine.status)}
              </span>
            </div>
            {isAdmin && (
              <button onClick={() => setShowThresh(true)} className="btn-cyan text-xs px-3 py-1.5">
                ⚙ Soglie
              </button>
            )}
          </div>
        }
      />

      {/* Info bar */}
      <div className="scada-card p-4 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        {[
          { l: 'Impianto',       v: machine.plant },
          { l: 'Uptime',         v: `${machine.uptime}%`, cl: machine.uptime > 90 ? 'text-scada-green' : machine.uptime > 70 ? 'text-scada-amber' : 'text-scada-red' },
          { l: 'Ultima manut.',  v: formatDate(machine.lastMaintenance) },
          { l: 'Prossima manut.',v: formatDate(machine.nextMaintenance) },
        ].map(i => (
          <div key={i.l}>
            <p className="text-scada-textDim uppercase tracking-widest mb-0.5">{i.l}</p>
            <p className={`text-scada-text font-semibold ${i.cl || ''}`}>{i.v}</p>
          </div>
        ))}
      </div>

      {/* Striscia allarmi attivi per questa macchina */}
      {alarms.filter(a => !a.acknowledged).length > 0 && (
        <div className="border border-scada-red/30 bg-scada-red/5 rounded p-3 mb-5 space-y-1">
          {alarms.filter(a => !a.acknowledged).map(a => (
            <div key={a.id} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-scada-red animate-pulse flex-shrink-0" />
              <span className="text-scada-red font-mono">[{a.code}]</span>
              <span className="text-scada-text">{a.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cards telemetria live */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-2">
        <TelemetryCard label="Temperatura" value={telemetry?.temperature} unit="°C"   icon="🌡" status={getTempStatus(telemetry?.temperature)} />
        <TelemetryCard label="Vibrazione"  value={telemetry?.vibration}   unit="mm/s" icon="📳" status={getVibrStatus(telemetry?.vibration)} />
        <TelemetryCard label="Efficienza"  value={telemetry?.efficiency}  unit="%"    icon="⚡" status={getEffStatus(telemetry?.efficiency)} />
        <TelemetryCard label="Corrente"    value={telemetry?.current}     unit="A"    icon="🔌" status="ok" />
        {telemetry?.pressure > 0 && (
          <TelemetryCard label="Pressione" value={telemetry?.pressure}    unit="bar"  icon="🔵" status="ok" />
        )}
      </div>

      {/* Timestamp ultimo aggiornamento */}
      {telemetry && (
        <p className="text-xs text-scada-textDim mb-5">
          ↺ Live · {formatDateTime(telemetry.timestamp)}
        </p>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-scada-card border border-scada-border p-1 rounded mb-4 w-fit">
        {[
          { id: 'diagnosis', l: '🧠 Diagnosi AI' },
          { id: 'chat',      l: '💬 Assistente' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
              tab === t.id
                ? 'bg-scada-cyan/10 text-scada-cyan border border-scada-cyan/30'
                : 'text-scada-textDim hover:text-scada-text'
            }`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Contenuto tab */}
      <div className="scada-card p-5">
        {tab === 'diagnosis' && <DiagnosisPanel machine={machine} />}
        {tab === 'chat'      && <AiChat machineContext={machine} />}
      </div>

      {/* Modal soglie — solo admin */}
      {isAdmin && (
        <Modal isOpen={showThresh} onClose={() => setShowThresh(false)} title="CONFIGURA SOGLIE ALLARME">
          <p className="text-scada-textDim text-sm">
            Form soglie — da implementare nel prossimo step
          </p>
        </Modal>
      )}
    </AppLayout>
  );
}