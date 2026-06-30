import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeTicket } from '../store/slices/ticketsSlice';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Modal from '../components/ui/Modal';
import TicketForm from '../components/tickets/TicketForm';
import { formatDate, priorityLabel, ticketStatusLabel } from '../utils/formatters';

const priBorder = { high: 'border-scada-red', medium: 'border-scada-amber', low: 'border-scada-green' };
const priTag    = { high: 'tag-alarm', medium: 'tag-warning', low: 'tag-ok' };
const stTag     = { open: 'tag-open', in_progress: 'tag-warning', closed: 'tag-offline' };

export default function TicketsPage() {
  const dispatch = useDispatch();
  const { isTechnician } = useAuth();
  const tickets = useSelector(s => s.tickets.list);
  const [filter, setFilter]     = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = tickets.filter(t => {
    if (filter === 'active') return t.status !== 'closed';
    if (filter === 'open')   return t.status === 'open';
    if (filter === 'closed') return t.status === 'closed';
    return true;
  });

  const openCount = tickets.filter(t => t.status !== 'closed').length;

  return (
    <AppLayout>
      <PageHeader
        title="TICKET MANUTENZIONE"
        subtitle={`${openCount} ticket aperti`}
        action={
          isTechnician && (
            <button onClick={() => setShowModal(true)} className="btn-cyan text-xs">
              + NUOVO TICKET
            </button>
          )
        }
      />

      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { v: 'all',    l: 'Tutti' },
          { v: 'active', l: `Attivi (${openCount})` },
          { v: 'open',   l: 'Aperti' },
          { v: 'closed', l: 'Chiusi' },
        ].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === f.v
                ? 'bg-scada-cyan/10 text-scada-cyan border border-scada-cyan/30'
                : 'text-scada-textDim border border-scada-border hover:text-scada-text'
            }`}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="scada-card p-12 text-center text-scada-textDim text-xs">
            Nessun ticket trovato
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id}
              className={`scada-card border-l-4 ${priBorder[t.priority] || 'border-scada-border'} p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <code className="text-xs text-scada-textDim font-mono">{t.id}</code>
                    <span className={priTag[t.priority] || 'tag-offline'}>{priorityLabel(t.priority)}</span>
                    <span className={stTag[t.status]   || 'tag-offline'}>{ticketStatusLabel(t.status)}</span>
                  </div>
                  <h3 className="text-scada-text text-sm font-semibold mb-1">{t.title}</h3>
                  <p className="text-xs text-scada-textDim mb-2">
                    {t.machineName} · {t.assignedTo} · {formatDate(t.createdAt)}
                  </p>
                  <p className="text-xs text-scada-text/70">{t.description}</p>
                  {t.notes && (
                    <p className="text-xs text-scada-cyan mt-2 border-l border-scada-cyan/30 pl-2">
                      {t.notes}
                    </p>
                  )}
                </div>
                {isTechnician && t.status !== 'closed' && (
                  <button onClick={() => dispatch(closeTicket(t.id))}
                    className="btn-ghost text-xs border border-scada-border px-3 py-1.5 hover:border-scada-green hover:text-scada-green flex-shrink-0">
                    ✓ Chiudi
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="NUOVO TICKET MANUTENZIONE">
        <TicketForm onClose={() => setShowModal(false)} />
      </Modal>
    </AppLayout>
  );
}