import { Link } from 'react-router-dom';
import StatusDot from '../ui/StatusDot';
import { statusLabel, formatDate } from '../../utils/formatters';

// Bordo colorato diverso in base allo stato
const statusBorder = {
  ok: 'border-scada-green/20', warning: 'border-scada-amber/30',
  alarm: 'border-scada-red/40', offline: 'border-scada-border',
};

export default function MachineCard({ machine }) {
  const sb = statusBorder[machine.status] || 'border-scada-border';

  return (
    // Tutta la card è un Link cliccabile verso /machine/M003 ecc.
    <Link to={`/machine/${machine.id}`}
      className={`scada-card border ${sb} p-5 block hover:border-opacity-60 transition-all group`}>

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-scada-textDim uppercase tracking-widest">{machine.id}</p>
          <h3 className="text-scada-text font-semibold text-sm group-hover:text-scada-cyan transition-colors">
            {machine.name}
          </h3>
          <p className="text-xs text-scada-textDim">{machine.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status={machine.status} size="md" />
          <span className={`text-xs font-mono ${
            {ok:'text-scada-green',warning:'text-scada-amber',alarm:'text-scada-red',offline:'text-scada-muted'}[machine.status]
          }`}>
            {statusLabel(machine.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-scada-textDim border-t border-scada-border pt-3 mt-3">
        <span>PLC: <span className="text-scada-text">{machine.plc}</span></span>
        <span>
          Uptime:{' '}
          {/* Colore dinamico in base al valore di uptime */}
          <span className={machine.uptime > 90 ? 'text-scada-green' : machine.uptime > 70 ? 'text-scada-amber' : 'text-scada-red'}>
            {machine.uptime}%
          </span>
        </span>
        <span>Impianto: <span className="text-scada-text">{machine.plant.split(' ')[0]}</span></span>
        <span>Manut.: <span className="text-scada-text">{formatDate(machine.nextMaintenance)}</span></span>
      </div>

      <div className="flex flex-wrap gap-1 mt-3">
        {machine.tags.map(t => (
          <span key={t} className="text-xs bg-scada-border/50 text-scada-textDim px-2 py-0.5 rounded">{t}</span>
        ))}
      </div>
    </Link>
  );
}