import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-scada-bg flex flex-col items-center justify-center text-center px-4">
      <p className="text-scada-textDim font-mono text-xs mb-2 uppercase tracking-widest">
        ERROR_404
      </p>
      <h1 className="text-6xl font-bold text-scada-muted font-mono mb-4">404</h1>
      <p className="text-scada-textDim text-sm mb-6">Risorsa non trovata nel sistema</p>
      <Link to="/dashboard" className="btn-cyan">← Torna alla Dashboard</Link>
    </div>
  );
}