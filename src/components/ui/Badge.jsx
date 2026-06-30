const classes = {
  ok: 'tag-ok', warning: 'tag-warning', alarm: 'tag-alarm', offline: 'tag-offline',
  open: 'tag-open', high: 'tag-alarm', medium: 'tag-warning', low: 'tag-ok',
  in_progress: 'tag-open', closed: 'tag-offline',
};

export default function Badge({ label, variant = 'ok' }) {
  return <span className={classes[variant] || 'tag-offline'}>{label}</span>;
}