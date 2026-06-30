import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendChatMessage } from '../../store/thunks/aiThunks';
import { validateRequired } from '../../utils/validators';

// Suggerimenti mostrati quando la chat è vuota
const SUGGESTIONS = [
  'Quali sono le cause più comuni di questo allarme?',
  'Quanto tempo richiede la manutenzione?',
  'Come prevenire questo tipo di guasto?',
];

export default function AiChat({ machineContext }) {
  const dispatch = useDispatch();
  const { messages, loadingChat } = useSelector(s => s.ai);
  const [input, setInput] = useState('');
  const [inputErr, setInputErr] = useState('');
  // useRef: riferimento al div in fondo alla chat per lo scroll automatico
  const bottomRef = useRef();

  // Ogni volta che arriva un nuovo messaggio, scrolla in fondo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const err = validateRequired(input, 'Messaggio');
    if (err) { setInputErr(err); return; }

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    dispatch(sendChatMessage({ message: input.trim(), history, machineContext }));
    setInput('');
    setInputErr('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Area messaggi */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-72">
        {messages.length === 0 && (
          <div className="py-6">
            <p className="text-scada-textDim text-xs text-center mb-4">
              Assistente tecnico AI · MSL Automazioni
            </p>
            {/* Suggerimenti cliccabili che popolano l'input */}
            <div className="space-y-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="w-full text-left text-xs text-scada-textDim hover:text-scada-cyan border border-scada-border hover:border-scada-cyan/40 rounded px-3 py-2 transition-colors">
                  → {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded px-3 py-2 text-xs whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-scada-cyan/10 text-scada-cyan border border-scada-cyan/20'
                : 'bg-scada-panel text-scada-text border border-scada-border'
            }`}>
              {m.role === 'assistant' && (
                <span className="text-scada-textDim block mb-1 uppercase tracking-widest text-xs">
                  AI Tecnico
                </span>
              )}
              {m.content}
            </div>
          </div>
        ))}

        {/* Indicatore "sta scrivendo" mentre aspettiamo la risposta */}
        {loadingChat && (
          <div className="flex justify-start">
            <div className="bg-scada-panel border border-scada-border rounded px-3 py-2 text-xs text-scada-textDim animate-pulse">
              Elaborazione...
            </div>
          </div>
        )}

        {/* Div invisibile in fondo: target per lo scroll automatico */}
        <div ref={bottomRef} />
      </div>

      {/* Form invio messaggio — Form 4 obbligatorio */}
      <form onSubmit={handleSend} className="flex gap-2">
        <div className="flex-1">
          <input
            value={input}
            onChange={e => { setInput(e.target.value); if (inputErr) setInputErr(''); }}
            disabled={loadingChat}
            placeholder="Chiedi all'assistente tecnico AI..."
            className={`input-scada text-xs ${inputErr ? 'input-error' : ''}`}
          />
          {inputErr && <p className="text-scada-red text-xs mt-1">{inputErr}</p>}
        </div>
        <button type="submit" disabled={loadingChat || !input.trim()} className="btn-cyan px-3">
          ↑
        </button>
      </form>
    </div>
  );
}