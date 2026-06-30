import { useSelector, useDispatch } from 'react-redux';
import { runDiagnosis } from '../../store/thunks/aiThunks';
import Spinner from '../ui/Spinner';

// Colori in base allo stato generale della diagnosi
const riskStyle = {
  ok:       'text-scada-green border-scada-green/30 bg-scada-green/5',
  warning:  'text-scada-amber border-scada-amber/30 bg-scada-amber/5',
  critical: 'text-scada-red   border-scada-red/30   bg-scada-red/5',
};

export default function DiagnosisPanel({ machine }) {
  const dispatch = useDispatch();
  const { diagnosis, loadingDiag, error } = useSelector(s => s.ai);
  const alarms    = useSelector(s => s.alarms.list.filter(a => a.machineId === machine.id));
  const telemetry = useSelector(s => s.machines.telemetry[machine.id]);

  const handleRun = () => {
    if (telemetry) dispatch(runDiagnosis({ machine, alarms, telemetry }));
  };

  if (loadingDiag) return <Spinner text="AI analisi diagnostica in corso..." />;

  if (!diagnosis) return (
    <div className="text-center py-10">
      <p className="text-4xl mb-3">🧠</p>
      <p className="text-scada-text text-sm mb-1">Diagnosi AI non disponibile</p>
      <p className="text-scada-textDim text-xs mb-5">
        Attendi il caricamento della telemetria, poi avvia l'analisi
      </p>
      <button onClick={handleRun} disabled={!telemetry} className="btn-cyan">
        ▶ AVVIA DIAGNOSI AI
      </button>
      {error && <p className="text-scada-red text-xs mt-3">⚠ {error}</p>}
    </div>
  );

  const rc = riskStyle[diagnosis.overallStatus] || riskStyle.warning;

  return (
    <div className="space-y-4">
      {/* Riepilogo generale */}
      <div className={`border rounded p-4 ${rc}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-widest">Stato complessivo</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold">
              {diagnosis.riskScore}<span className="text-sm opacity-60">/100</span>
            </span>
            <button onClick={handleRun} className="text-xs opacity-60 hover:opacity-100">↺</button>
          </div>
        </div>
        <p className="text-sm">{diagnosis.summary}</p>
      </div>

      {/* Causa probabile */}
      <div className="scada-panel p-4 rounded">
        <p className="text-xs text-scada-textDim uppercase tracking-widest mb-2">Causa Probabile</p>
        <p className="text-scada-text text-sm">{diagnosis.rootCause}</p>
      </div>

      {/* Azioni immediate */}
      <div className="scada-panel p-4 rounded">
        <p className="text-xs text-scada-textDim uppercase tracking-widest mb-3">Azioni Immediate</p>
        <ul className="space-y-2">
          {diagnosis.immediateActions?.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm text-scada-text">
              <span className="text-scada-cyan font-mono text-xs mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Fermo stimato */}
      <div className="scada-panel p-4 rounded">
        <p className="text-xs text-scada-textDim uppercase tracking-widest mb-2">Fermo Stimato</p>
        <p className="text-scada-amber font-mono text-sm">{diagnosis.estimatedDowntime}</p>
      </div>
    </div>
  );
}