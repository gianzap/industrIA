import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  // Blocca lo scroll della pagina quando il modal è aperto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    // Cleanup: ripristina lo scroll se il componente viene smontato
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Non renderizza nulla se non è aperto
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Sfondo scuro cliccabile per chiudere */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Contenuto del modal (sopra lo sfondo, z-index più alto) */}
      <div className="relative bg-scada-card border border-scada-border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-scada-border">
          <h2 className="text-sm font-semibold text-scada-cyan uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="text-scada-muted hover:text-scada-text text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}