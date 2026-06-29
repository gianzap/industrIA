// Controlla che un campo non sia vuoto
// value: il valore del campo
// label: il nome del campo da mostrare nell'errore
export const validateRequired = (value, label = 'Campo') => {
  // toString() per gestire anche numeri, trim() rimuove spazi
  if (!value?.toString().trim()) return `${label} obbligatorio`;
  return ''; // stringa vuota = nessun errore
};

// Controlla che il testo abbia almeno n caratteri
export const validateMinLength = (value, min, label = 'Campo') => {
  if (!value) return `${label} obbligatorio`;
  if (value.trim().length < min) return `${label}: minimo ${min} caratteri`;
  return '';
};

// Controlla che l'email abbia un formato valido
export const validateEmail = (value) => {
  // Regex: almeno un carattere @ almeno un carattere . almeno un carattere
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) return 'Email obbligatoria';
  if (!re.test(value)) return 'Email non valida';
  return '';
};

// Controlla che la password abbia almeno 4 caratteri
export const validatePassword = (value) => {
  if (!value) return 'Password obbligatoria';
  if (value.length < 4) return 'Minimo 4 caratteri';
  return '';
};