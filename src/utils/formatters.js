// Formatta una data in italiano — es. "12 apr 2025"
export const formatDate = (d) => {
  if (!d) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(d));
};

// Formatta data e ora — es. "12 apr 2025 14:32"
export const formatDateTime = (d) => {
  if (!d) return '—';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(d));
};

// Converte lo status tecnico in etichetta leggibile
export const statusLabel = (s) => ({
  ok:      'OPERATIVO',
  warning: 'ATTENZIONE',
  alarm:   'ALLARME',
  offline: 'OFFLINE',
}[s] || s.toUpperCase());

// Converte la severità in etichetta
export const severityLabel = (s) => ({
  alarm:   'CRITICO',
  warning: 'ATTENZIONE',
  info:    'INFO',
}[s] || s);

// Converte il ruolo in etichetta italiana
export const roleLabel = (r) => ({
  admin:      'Amministratore',
  technician: 'Tecnico',
  operator:   'Operatore',
}[r] || r);

// Converte la priorità ticket in etichetta
export const priorityLabel = (p) => ({
  high:   'URGENTE',
  medium: 'MEDIO',
  low:    'BASSO',
}[p] || p);

// Converte lo stato ticket in etichetta
export const ticketStatusLabel = (s) => ({
  open:        'APERTO',
  in_progress: 'IN CORSO',
  closed:      'CHIUSO',
}[s] || s);