export default function Spinner({ text = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      {/* Cerchio che ruota con animazione CSS di Tailwind */}
      <div className="w-10 h-10 border-2 border-scada-border border-t-scada-cyan rounded-full animate-spin" />
      {text && <p className="text-scada-textDim text-xs uppercase tracking-widest">{text}</p>}
    </div>
  );
}