export default function TelemetryCard({ label, value, unit, icon, status = 'ok' }) {
  const colors = {
    ok:      'text-scada-green',
    warning: 'text-scada-amber',
    alarm:   'text-scada-red animate-pulse',
    offline: 'text-scada-muted',
  };

  return (
    <div className="scada-panel p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-scada-textDim uppercase tracking-widest">{label}</span>
        <span className="text-base">{icon}</span>
      </div>
      <div className={`text-2xl font-mono font-bold ${colors[status]}`}>
        {value ?? '—'}
        <span className="text-sm text-scada-textDim ml-1">{unit}</span>
      </div>
    </div>
  );
}