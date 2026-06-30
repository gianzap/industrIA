import { FAKE_USERS } from '../utils/mockData';

const STORAGE_KEY = 'industria_user'; // chiave per localStorage

const authService = {

  // Simula una chiamata API di login con una Promise
  login: (email, password) => new Promise((resolve, reject) => {
    // setTimeout simula la latenza di rete (mezzo secondo)
    setTimeout(() => {
      // Cerca un utente che abbia EMAIL e PASSWORD corrispondenti
      const user = FAKE_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        reject(new Error('Credenziali non valide'));
        return;
      }

      // Rimuove la password prima di salvare/restituire l'utente
      // (destructuring: prendo "password" da scartare, il resto va in "safeUser")
      const { password: _, ...safeUser } = user;

      // Salva l'utente "sicuro" (senza password) in localStorage
      // localStorage accetta solo stringhe, quindi serve JSON.stringify
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

      resolve(safeUser); // questo valore arriva al thunk come risultato
    }, 500);
  }),

  // Rimuove l'utente da localStorage (logout)
  logout: () => localStorage.removeItem(STORAGE_KEY),

  // Legge l'utente salvato — usato all'avvio dell'app per
  // ripristinare la sessione anche dopo un refresh della pagina
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null; // se localStorage è corrotto, non bloccare l'app
    }
  },

  // Restituisce tutti gli utenti senza password (per il pannello Admin)
  getAllUsers: () => FAKE_USERS.map(({ password: _, ...u }) => u),
};

export default authService;