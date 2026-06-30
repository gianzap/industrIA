import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../store/slices/authSlice';
import { roleLabel } from '../../utils/formatters';

const navItems = [
  { to: '/dashboard', icon: '▣', label: 'Overview' },
  { to: '/machines',  icon: '⚙', label: 'Macchine' },
  { to: '/alarms',    icon: '◈', label: 'Allarmi',  badge: 'alarms' },
  { to: '/tickets',   icon: '✎', label: 'Ticket',   badge: 'tickets' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin, userName } = useAuth();

  // Conta gli allarmi NON confermati e di severità "alarm" (i più critici)
  const activeAlarms = useSelector(s =>
    s.alarms.list.filter(a => !a.acknowledged && a.severity === 'alarm').length
  );
  // Conta i ticket non ancora chiusi
  const openTickets = useSelector(s =>
    s.tickets.list.filter(t => t.status !== 'closed').length
  );

  const badges = { alarms: activeAlarms, tickets: openTickets };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // NavLink accetta una funzione come className: riceve { isActive }
  // e ci permette di applicare uno stile diverso al link attivo
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded text-sm transition-all ${
      isActive
        ? 'bg-scada-cyan/10 text-scada-cyan border-l-2 border-scada-cyan'
        : 'text-scada-textDim hover:text-scada-text hover:bg-scada-border/30 border-l-2 border-transparent'
    }`;

  return (
    <aside className="w-56 bg-scada-card border-r border-scada-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-scada-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-scada-cyan/20 border border-scada-cyan/40 rounded flex items-center justify-center">
            <span className="text-scada-cyan text-xs font-bold">IA</span>
          </div>
          <div>
            <p className="text-scada-text font-bold text-sm tracking-wider">
              INDUSTR<span className="text-scada-cyan">IA</span>
            </p>
            <p className="text-scada-textDim text-xs">v1.0 · MSL Automazioni</p>
          </div>
        </div>
      </div>

      {/* Navigazione */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {/* Mostra il badge SOLO se esiste ed è maggiore di 0 */}
            {item.badge && badges[item.badge] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                item.badge === 'alarms' ? 'bg-scada-red/20 text-scada-red' : 'bg-scada-cyan/20 text-scada-cyan'
              }`}>
                {badges[item.badge]}
              </span>
            )}
          </NavLink>
        ))}

        {/* Link Admin visibile SOLO se l'utente è admin */}
        {isAdmin && (
          <NavLink to="/admin" className={linkClass}>
            <span className="text-base w-5 text-center">◎</span>
            <span>Admin</span>
          </NavLink>
        )}
      </nav>

      {/* Info utente in basso */}
      <div className="px-4 py-4 border-t border-scada-border">
        <div className="mb-3">
          <p className="text-scada-text text-xs font-semibold truncate">{userName}</p>
          <p className="text-scada-textDim text-xs">{roleLabel(user?.role)} · {user?.company}</p>
        </div>
        <button onClick={handleLogout} className="w-full btn-ghost text-xs text-left px-0">
          ⏻ Disconnetti
        </button>
      </div>
    </aside>
  );
}