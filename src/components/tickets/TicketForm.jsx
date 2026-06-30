import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTicket } from '../../store/slices/ticketsSlice';
import { validateRequired, validateMinLength } from '../../utils/validators';
import { MACHINES } from '../../utils/mockData';

export default function TicketForm({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: '', machineId: '', priority: 'medium', description: '', assignedTo: '',
  });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleBlur = e => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const validate = () => ({
    title:       validateRequired(form.title, 'Titolo'),
    machineId:   validateRequired(form.machineId, 'Macchina'),
    description: validateMinLength(form.description, 10, 'Descrizione'),
    assignedTo:  validateRequired(form.assignedTo, 'Assegnato a'),
  });

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])));
    if (Object.values(errs).some(Boolean)) { setErrors(errs); return; }
    const machine = MACHINES.find(m => m.id === form.machineId);
    dispatch(addTicket({ ...form, machineName: machine?.name || form.machineId }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Titolo */}
      <div>
        <label className="label-field">Titolo intervento *</label>
        <input name="title" value={form.title} onChange={handleChange} onBlur={handleBlur}
          placeholder="es. Sostituzione filtro aria"
          className={`input-scada ${touched.title && errors.title ? 'input-error' : ''}`} />
        {touched.title && errors.title && <p className="text-scada-red text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Assegnato a */}
      <div>
        <label className="label-field">Assegnato a *</label>
        <input name="assignedTo" value={form.assignedTo} onChange={handleChange} onBlur={handleBlur}
          placeholder="es. Marco Ferrara"
          className={`input-scada ${touched.assignedTo && errors.assignedTo ? 'input-error' : ''}`} />
        {touched.assignedTo && errors.assignedTo && <p className="text-scada-red text-xs mt-1">{errors.assignedTo}</p>}
      </div>

      {/* Macchina + Priorità */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label-field">Macchina *</label>
          <select name="machineId" value={form.machineId} onChange={handleChange} onBlur={handleBlur}
            className={`input-scada ${touched.machineId && errors.machineId ? 'input-error' : ''}`}>
            <option value="">Seleziona...</option>
            {MACHINES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          {touched.machineId && errors.machineId && <p className="text-scada-red text-xs mt-1">{errors.machineId}</p>}
        </div>
        <div>
          <label className="label-field">Priorità</label>
          <select name="priority" value={form.priority} onChange={handleChange} className="input-scada">
            <option value="high">🔴 Urgente</option>
            <option value="medium">🟡 Medio</option>
            <option value="low">🟢 Basso</option>
          </select>
        </div>
      </div>

      {/* Descrizione */}
      <div>
        <label className="label-field">Descrizione *</label>
        <textarea name="description" value={form.description} onChange={handleChange} onBlur={handleBlur}
          rows={3} placeholder="Descrivi il problema e l'intervento necessario (min. 10 caratteri)..."
          className={`input-scada resize-none ${touched.description && errors.description ? 'input-error' : ''}`} />
        {touched.description && errors.description && <p className="text-scada-red text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-cyan flex-1">+ CREA TICKET</button>
        <button type="button" onClick={onClose} className="btn-ghost px-4">Annulla</button>
      </div>
    </form>
  );
}