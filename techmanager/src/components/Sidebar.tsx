import { LayoutDashboard, Users, UserCog, Ticket, HardDrive, Settings, LogOut, X, Landmark } from 'lucide-react';

export type SidebarTab = 'dashboard' | 'clientes' | 'tecnicos' | 'chamados' | 'backups' | 'configuracoes';
export type UserRole = 'ADMIN' | 'CUSTOMER' | 'TECHNICAL' | null;

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onLogout: () => void;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const ALL_MENU_ITEMS = [
  { id: 'dashboard' as SidebarTab,     label: 'Visão Geral',        icon: LayoutDashboard, roles: ['ADMIN', 'TECHNICAL'] },
  { id: 'clientes' as SidebarTab,      label: 'Clientes',           icon: Users,            roles: ['ADMIN'] },
  { id: 'tecnicos' as SidebarTab,      label: 'Técnicos',           icon: UserCog,          roles: ['ADMIN'] },
  { id: 'chamados' as SidebarTab,      label: 'Chamados',           icon: Ticket,           roles: ['ADMIN', 'TECHNICAL', 'CUSTOMER'] },
  { id: 'backups' as SidebarTab,       label: 'Gestão de Backups',  icon: HardDrive,        roles: ['ADMIN'] },
  { id: 'configuracoes' as SidebarTab, label: 'Configurações',      icon: Settings,         roles: ['ADMIN', 'TECHNICAL', 'CUSTOMER'] },
];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'ADMIN CONTROL',
  TECHNICAL: 'TÉCNICO',
  CUSTOMER: 'CLIENTE',
};

export function Sidebar({
  activeTab, onTabChange, onLogout,
  userName, userEmail, userRole,
  isMobileOpen, setIsMobileOpen
}: SidebarProps) {

  const menuItems = ALL_MENU_ITEMS.filter(
    item => !userRole || item.roles.includes(userRole)
  );

  const handleTabClick = (tabId: SidebarTab) => {
    onTabChange(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          id="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col justify-between z-50 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 py-6">
          <div className="px-6 pb-6 border-b border-slate-800 flex items-center justify-between" id="sidebar-header">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-sans font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  TechManager
                </span>
                <span className="block text-[9px] font-mono tracking-wider text-indigo-400">
                  {ROLE_LABELS[userRole ?? ''] ?? 'PAINEL'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" id="sidebar-nav">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800" id="sidebar-footer">
          <div className="bg-slate-800/40 p-3.5 rounded-2xl mb-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-sans font-bold shadow-inner">
              {userName ? userName.charAt(0) : '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-slate-100">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            id="sidebar-logout-btn"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair do Painel
          </button>
        </div>
      </aside>
    </>
  );
}