import { useDispatch, useSelector } from 'react-redux';
import { fetchThresholds } from '../../store/thunks/aiThunks';
import { validateRequired } from '../../utils/validators';
import { useState } from 'react';

export default function ThresholdForm({ machine, onClose }) {
  const dispatch = useDispatch();
  const { thresholds, loadingThresh } = useSelector(s => s.ai);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Inizializza direttamente con i valori AI se disponibili
  // altrimenti usa i default realistici
  const [form, setForm] = useState({
    tempWarn:  thresholds ? String(thresholds.temperature?.warning || 85) : '85',
    tempAlarm: thresholds ? String(thresholds.temperature?.alarm   || 95) : '95',
    vibWarn:   thresholds ? String(thresholds.vibration?.warning   || 5)  : '5',
    vibAlarm:  thresholds ? String(thresholds.vibration?.alarm     || 8)  : '8',
    effWarn:   thresholds ? String(thresholds.efficiency?.warning  || 70) : '70',
    effAlarm:  thresholds ? String(thresholds.efficiency?.alarm    || 50) : '50',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = e =>
    setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const validate = () =>
    Object.fromEntries(
      Object.keys(form).map(k => [k, validateRequired(form[k], 'Soglia')])
    );

  // Quando l'utente clicca "Suggerisci con AI", chiama il thunk
  // e poi aggiorna manualmente il form con i valori ricevuti
  const handleAiSuggest = async () => {
    const result = await dispatch(fetchThresholds(machine));
    if (fetchThresholds.fulfilled.match(result)) {
      const t = result.payload;
      setForm({
        tempWarn:  String(t.temperature?.warning || 85),
        tempAlarm: String(t.temperature?.alarm   || 95),
        vibWarn:   String(t.vibration?.warning   || 5),
        vibAlarm:  String(t.vibration?.alarm     || 8),
        effWarn:   String(t.efficiency?.warning  || 70),
        effAlarm:  String(t.efficiency?.alarm    || 50),
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])));
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  const fields = [
    { name: 'tempWarn',  label: 'Temperatura Attenzione (°C)' },
    { name: 'tempAlarm', label: 'Temperatura Allarme (°C)' },
    { name: 'vibWarn',   label: 'Vibrazione Attenzione (mm/s)' },
    { name: 'vibAlarm',  label: 'Vibrazione Allarme (mm/s)' },
    { name: 'effWarn',   label: 'Efficienza Attenzione (%)' },
    { name: 'effAlarm',  label: 'Efficienza Allarme (%)' },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-scada-textDim">{machine.name}</p>
        <button
          type="button"
          onClick={handleAiSuggest}
          disabled={loadingThresh}
          className="btn-ghost text-xs border border-scada-border px-3 py-1.5">
          {loadingThresh ? 'Generando...' : '🤖 Suggerisci con AI'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="label-field">{f.label}</label>
            <input
              name={f.name}
              type="number"
              value={form[f.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-scada ${
                touched[f.name] && errors[f.name] ? 'input-error' : ''
              }`}
            />
            {touched[f.name] && errors[f.name] && (
              <p className="text-scada-red text-xs mt-0.5">{errors[f.name]}</p>
            )}
          </div>
        ))}
      </div>

      {saved && (
        <p className="text-scada-green text-xs mb-3">✓ Soglie salvate con successo</p>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn-cyan flex-1">SALVA SOGLIE</button>
        <button type="button" onClick={onClose} className="btn-ghost px-4">Annulla</button>
      </div>
    </form>
  );
}