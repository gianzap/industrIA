const cfg = {
  ok:      ['bg-scada-green',           'shadow-scada-green/50'],
  warning: ['bg-scada-amber',           'shadow-scada-amber/50'],
  alarm:   ['bg-scada-red animate-pulse','shadow-scada-red/50'],
  offline: ['bg-scada-muted',           ''],
};

export default function StatusDot({ status, size = 'md' }) {
  const [bg, shadow] = cfg[status] || cfg.offline;
  const sz = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';

  return <span className={`inline-block rounded-full shadow-lg ${sz} ${bg} ${shadow}`} />;
}