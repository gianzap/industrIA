import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/thunks/authThunks';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAuth();

  // STATO 1: i valori dei campi del form
  const [form, setForm] = useState({ email: '', password: '' });

  // STATO 2: i messaggi di errore per ogni campo
  const [errors, setErrors] = useState({});

  // STATO 3: quali campi l'utente ha già "toccato" (cliccato e poi uscito)
  // Serve per non mostrare errori finché l'utente non ha ancora provato a scrivere
  const [touched, setTouched] = useState({});

  // Chiamata ad ogni keystroke nei campi
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Aggiorna SOLO il campo cambiato, mantenendo gli altri (spread ...prev)
    setForm(prev => ({ ...prev, [name]: value }));
    // Se l'utente sta correggendo un campo con errore, rimuovi l'errore
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Chiamata quando l'utente clicca fuori da un campo (blur = perde il focus)
  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // impedisce il refresh della pagina (comportamento default HTML)

    // Esegue tutte le validazioni
    const newErrors = {
      email:    validateEmail(form.email),
      password: validatePassword(form.password),
    };

    // Forza la visualizzazione di TUTTI gli errori al submit
    // (anche se l'utente non ha mai toccato un campo)
    setTouched({ email: true, password: true });

    // Se ALMENO UNO degli errori non è vuoto, blocca il submit
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    // dispatch ritorna una Promise quando è un thunk — possiamo aspettarla
    const result = await dispatch(loginUser(form));

    // loginUser.fulfilled.match() controlla se l'action ricevuta
    // è di tipo "fulfilled" (successo) per QUESTO specifico thunk
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
    // Se fallisce, l'errore è già in "error" tramite useAuth() — non serve fare nulla
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-scada-cyan/10 border border-scada-cyan/30 rounded flex items-center justify-center">
            <span className="text-scada-cyan font-bold">IA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-scada-text">
              INDUSTR<span className="text-scada-cyan">IA</span>
            </h1>
            <p className="text-xs text-scada-textDim">Industrial AI Dashboard</p>
          </div>
        </div>
        <p className="text-scada-textDim text-sm">Autenticazione operatore</p>
      </div>

      {/* Mostra l'errore globale (es. "Credenziali non valide") solo se esiste */}
      {error && (
        <div className="bg-scada-red/10 border border-scada-red/30 rounded px-4 py-3 mb-4 text-scada-red text-sm">
          {error}
        </div>
      )}

      {/* noValidate disabilita la validazione HTML nativa del browser
          (vogliamo gestire noi la validazione, non il browser) */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="label-field">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="operatore@azienda.it"
            // Mostra il bordo rosso SOLO se il campo è stato toccato E ha un errore
            className={`input-scada ${touched.email && errors.email ? 'input-error' : ''}`}
          />
          {touched.email && errors.email && (
            <p className="text-scada-red text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="label-field">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="••••••••"
            className={`input-scada ${touched.password && errors.password ? 'input-error' : ''}`}
          />
          {touched.password && errors.password && (
            <p className="text-scada-red text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* disabled={loading}: il bottone si disabilita mentre aspetta la risposta */}
        <button type="submit" disabled={loading} className="btn-cyan w-full mt-2 py-2.5">
          {loading ? '...' : '→ ACCEDI AL SISTEMA'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-scada-panel border border-scada-border rounded text-xs text-scada-textDim space-y-1">
        <p className="text-scada-muted uppercase tracking-widest text-xs mb-2">Account demo</p>
        <p>Admin: <code className="text-scada-cyan">admin@msl.it</code> / <code className="text-scada-cyan">admin123</code></p>
        <p>Tecnico: <code className="text-scada-cyan">tecnico@msl.it</code> / <code className="text-scada-cyan">tech123</code></p>
        <p>Operatore: <code className="text-scada-cyan">operatore@cliente.it</code> / <code className="text-scada-cyan">op123</code></p>
      </div>
    </div>
  );
}