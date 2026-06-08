import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clientes } from './components/Clientes';
import { Tecnicos } from './components/Tecnicos';
import { Chamados } from './components/Chamados';
import { Backup } from './components/Backup';
import { Configuracoes } from './components/Configuracoes';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Client, Technician, Ticket, BackupHistory, BackupConfig, UserProfile } from './types';
import { INITIAL_BACKUPS, INITIAL_BACKUP_CONFIG } from './data';
import { Menu, Bell, Moon, Sun, Contrast, Loader2 } from 'lucide-react';
import { api, getUserRole } from './services/api';

export default function App() {

  // -- Authentication Routing state --
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
  return localStorage.getItem('tm_logged_user_email') || localStorage.getItem('userName') || null;
});
  const [userRole, setUserRole] = useState<'ADMIN' | 'CUSTOMER' | 'TECHNICAL' | null>(() => getUserRole());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // -- Master Database States --
  const [clients, setClients] = useState<Client[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>(() => {
    const saved = localStorage.getItem('tm_db_backups');
    return saved ? JSON.parse(saved) : INITIAL_BACKUPS;
  });

  const [backupConfig, setBackupConfig] = useState<BackupConfig>(() => {
    const saved = localStorage.getItem('tm_db_backup_config');
    return saved ? JSON.parse(saved) : INITIAL_BACKUP_CONFIG;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tm_db_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Usuário',
      email: '',
      phone: '',
      avatar: 'U',
      theme: 'light',
      notifications: { emailCalls: true, smsAlerts: true, criticalOnly: false },
    };
  });

  // -- Navigation and UI Layout States --
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  // -- Fetch Initial Data --
  useEffect(() => {
    if (currentUser) {
      loadInitialData();
    }
  }, [currentUser]);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [currentAuditPage, setCurrentAuditPage] = useState<number>(0);
  const [totalAuditPages, setTotalAuditPages] = useState<number>(0);

  

  const loadInitialData = async () => {
    setIsLoadingData(true);
    const role = getUserRole();
    console.log('Role detectado:', role);

    try {
      // 1. ROTAS EXCLUSIVAS DE ADMIN
      if (role === 'ADMIN') {
        const response = await api.admin.getAuditLogs(0, 10).catch(() => null);
        if (response && response.content) {
          setAuditLogs(response.content);
        } else if (Array.isArray(response)) {
          setAuditLogs(response);
        }

        const clientsData = await api.admin.getCustomers().catch(() => []);
        setClients(clientsData.map((c: any, index: number) => ({
          id: c.id || `CLI-${index}`,
          name: c.name,
          company: 'N/A',
          email: c.email,
          phone: c.phone,
          active: true,
        })));
        
        const techsDataGlobal = await api.admin.getTechnicians().catch(() => []);
        setTechnicians(techsDataGlobal.map((t: any) => ({
          id: t.id,
          name: t.name,
          email: t.email,
          phone: t.phone,
          specialty: t.specialty || 'Software',
          status: 'Ativo',
          ticketsCount: 0,
        })));
      }

      // 2. CORREÇÃO PARA ROTAS DE TÉCNICO
      if (role === 'TECHNICAL') {
        setClients([]);
        
        // Em vez de deixar vazio, injetamos o técnico logado na lista de técnicos.
        // Assim, o frontend consegue bater o ID/Email dele com o técnico do chamado!
        if (currentUser) {
          setTechnicians([
            {
              id: currentUser, // Usado como fallback temporário ou ID real se puder extrair
              name: profile.name || 'Meu Perfil Técnico',
              email: currentUser,
              phone: profile.phone || '',
              specialty: 'HARDWARE',
              status: 'Ativo',
              ticketsCount: 0,
            },
          ]);
        } else {
          setTechnicians([]);
        }
      }

      // 3. ROTAS DE CHAMADOS (Liberado para todos, mas cada um com seu escopo)
      const ticketsData = role === 'CUSTOMER'
        ? await api.tickets.getMy().catch(() => [])
        : await api.tickets.getAll().catch(() => []);


      // Mapeamento dos chamados
      if (Array.isArray(ticketsData)) {
  setTickets(ticketsData.map((t: any) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    category: t.category,
    location: t.location || 'N/A',
    equipment: t.equipment || 'N/A',
    description: t.lastComment || t.description || 'Sem comentários',
    clientId: t.customerId || '',
    clientName: t.customerName || 'Cliente',
    technicianId: t.technicalId || '',   // ← campo do types.ts (linha 59)
    technicalId: t.technicalId || '',    // ← campo do types.ts usado no DetalheChamado
    technicalName: t.technicalName || 'Nenhum técnico designado',
    baseValue: t.baseHourlyRate || 100,
    finalValue: t.value || 100,
    status: t.status,
    creationDate: t.createdAt
      ? new Date(t.createdAt).toLocaleString('pt-BR')
      : new Date().toLocaleString('pt-BR'),
    slaEstimate: 'N/A',
    files: t.files || [],
    updates: Array.from(t.updates || []),

    paymentConfirmed: t.paymentConfirmed || false,
  })));
}

    } catch (err) {
      console.error('Erro geral ao carregar dados:', err);
    } finally {
      setIsLoadingData(false);
    }
  };
  

  const loadAuditLogs = async (page: number) => {
    if (userRole !== 'ADMIN') {
      setAuditLogs([]);
      return;
    }
    try {
      const response = await api.admin.getAuditLogs(page, 6);
      if (response && response.content) {
        setAuditLogs(response.content);
        setTotalAuditPages(response.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar logs de auditoria:", error);
    }
  };

  useEffect(() => {
    loadAuditLogs(currentAuditPage);
  }, [currentAuditPage]);

  useEffect(() => {
    localStorage.setItem('tm_db_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('tm_db_backup_config', JSON.stringify(backupConfig));
  }, [backupConfig]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'contrast-mode');
    if (profile.theme === 'dark') root.classList.add('dark');
    else if (profile.theme === 'high_contrast') root.classList.add('dark', 'contrast-mode');
  }, [profile.theme]);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('tm_logged_user_email', email);
    setCurrentUser(email);
    const role = getUserRole();
    setUserRole(role);
    setProfile(p => ({ ...p, email }));
    
    if (role === 'CUSTOMER') {
      setActiveTab('chamados');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleAssignTicket = async (ticketId: string) => {
    try {
      setIsLoadingData(true);
      await api.tickets.assign(ticketId);
      alert('Você assumiu este chamado com sucesso!');
      await loadInitialData(); 
    } catch (err: any) {
      console.error("Erro ao assumir chamado:", err);
      alert(`Erro ao assumir chamado: ${err.message || 'Verifique sua permissão.'}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleRegisterSuccess = (name: string, email: string) => {
    localStorage.setItem('tm_logged_user_email', email);
    setCurrentUser(email);
    setProfile(p => ({
      ...p,
      name,
      email,
      avatar: name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2),
    }));
    setAuthView('login');
    setActiveTab('chamados');
    alert(`Conta criada com sucesso! Bem-vindo, ${name}.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_logged_user_email');
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setUserRole(null);
    setAuthView('login');
    setActiveTicketId(null);
  };

  const handleAddClient = async (newClientData: Omit<Client, 'id'>) => {
    try {
      await api.auth.register({
        name: newClientData.name,
        email: newClientData.email,
        phone: newClientData.phone,
        password: 'Password123!',
        passwordConfirmed: 'Password123!',
      });
      alert(`Cliente ${newClientData.name} cadastrado com sucesso!`);
      loadInitialData();
    } catch (err: any) {
      alert(`Erro ao cadastrar cliente: ${err.message}`);
    }
  };

  const handleRemoveClient = async (id: string) => {
    try {
      await api.admin.deleteCustomer(id);
      alert('Cliente removido do sistema.');
      loadInitialData();
    } catch (err: any) {
      alert(`Erro ao remover cliente: ${err.message}`);
    }
  };

  const handleAddTechnician = async (newTechData: any) => {
    try {
      await api.admin.createTechnical({
        name: newTechData.name,
        email: newTechData.email,
        phone: newTechData.phone,
        password: newTechData.password || 'TechPassword123!',
        passwordConfirmed: newTechData.password || 'TechPassword123!',
      });
      alert(`Técnico ${newTechData.name} cadastrado com sucesso!`);
      loadInitialData();
    } catch (err: any) {
      alert(`Erro ao cadastrar técnico: ${err.message}`);
    }
  };

  const handleRemoveTechnician = async (id: string) => {
    try {
      await api.admin.deleteTechnician(id);
      alert('Técnico removido da equipe.');
      loadInitialData();
    } catch (err: any) {
      alert(`Erro ao remover técnico: ${err.message}`);
    }
  };

  const handleViewDetailedTicket = (ticketId: string) => {
    setActiveTicketId(ticketId);
    setActiveTab('chamados');
  };

  const handleAddTicket = async (newTicketData: any) => {
    try {
      await api.tickets.create({
        title: newTicketData.title,
        description: newTicketData.description,
        category: newTicketData.category,      
        priority: newTicketData.priority,      
        status: newTicketData.status,
        location: newTicketData.location,
        equipment: newTicketData.equipment,
        baseValue: newTicketData.baseValue,
        finalValue: newTicketData.finalValue,   
        files: newTicketData.files,
        clientId: newTicketData.clientId,
      });
      alert('Chamado registrado com êxito!');
      loadInitialData();
    } catch (err: any) {
      alert(`Erro ao abrir chamado: ${err.message}`);
    }
  };

  const handleUpdateTicket = async (updatedTicket: Ticket) => {
  setTickets(prevTickets => 
    prevTickets.map(t => t.id === updatedTicket.id ? {
      ...updatedTicket,
      updates: Array.from(updatedTicket.updates || []), // ← força array real
    } : t)
  );
};

  const getLoggedTechIdAndName = (): { id: string; name: string } => {
  // Se for admin, não precisa de techId (admin não edita chamados como técnico)
  if (userRole !== 'TECHNICAL') return { id: '', name: '' };

  // Procura nos tickets carregados algum onde o técnico já está vinculado
  // e o e-mail do JWT bate com o currentUser (email de sessão)
  // Nesse caso, o technicalId desse ticket É o UUID do usuário logado.
  const emailLogado = (currentUser || '').toLowerCase();
  const meuTicket   = tickets.find(t =>
    t.technicalId && t.technicalId !== '' &&
    // o technicalName sozinho não é seguro, mas aqui usamos só para
    // encontrar o ticket — a validação real é feita por UUID no DetalheChamado
    t.technicalName && t.technicalName !== 'Nenhum técnico designado'
  );

  if (meuTicket?.technicalId) {
    return {
      id:   meuTicket.technicalId,
      name: meuTicket.technicalName || emailLogado,
    };
  }

  return { id: '', name: profile.name || emailLogado };
};

// Busca os dados ricos do ticket via /ticket/ticketDetails/{id}
// Retorna o Ticket completo com technicalId (UUID real do banco)
const fetchTicketDetails = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const data = await api.tickets.getDetails(ticketId);
    if (!data) return null;
    return {
      // Preserva campos do summary que o getDetails pode não ter
      ...tickets.find(t => t.id === ticketId),
      id:                   ticketId,
      title:                data.title                || '',
      description:          data.description          || '',
      priority:             data.priority,
      category:             data.category,
      status:               data.status,
      baseValue:  data.baseValue ?? 100,
      finalValue: data.finalValue ?? 100,
      technicalId:          data.technicalId           || '',
      assignedTechnicianId: data.technicalId           || '',
      technicalName:        data.technicalName         || '',
      clientName:           data.customerName          || 'Cliente',
      clientId:             data.customerId || '',
      location:             tickets.find(t => t.id === ticketId)?.location || 'N/A',
      equipment:            tickets.find(t => t.id === ticketId)?.equipment || 'N/A',
      creationDate:         data.createdAt
                              ? new Date(data.createdAt).toLocaleString('pt-BR')
                              : tickets.find(t => t.id === ticketId)?.creationDate || '',
      slaEstimate:          'N/A',
      files:                [],
      updates:              tickets.find(t => t.id === ticketId)?.updates || [],
    } as Ticket;
  } catch (err) {
    console.error('Erro ao buscar detalhes do ticket:', err);
    return null;
  }
};

// Resolução do tech logado (calculada uma vez por render)
const loggedTech = getLoggedTechIdAndName();

const loggedClientId = userRole === 'CUSTOMER'
  ? (tickets.find(t => t.clientId)?.clientId || '')
  : '';

  const handleTriggerBackup = async (type: 'Incremental' | 'Geral') => {
    try {
      const response = await api.backups.trigger();
      alert(response.message || 'Backup iniciado com sucesso!');
      const newBackup: BackupHistory = {
        id: 'BCK-' + Math.floor(Math.random() * 1000),
        type,
        size: 'Processando...',
        status: 'Sucesso',
        date: new Date().toLocaleString('pt-BR', { hour12: false }),
      };
      setBackupHistory(prev => [newBackup, ...prev]);
    } catch (err: any) {
      alert(`Erro ao iniciar backup: ${err.message}`);
    }
  };

  const handleToggleThemeFromToolbar = () => {
    setProfile(p => ({ ...p, theme: p.theme === 'light' ? 'dark' : 'light' }));
  };

  if (!currentUser) {
    if (authView === 'register') {
      return (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setAuthView('register')}
      />
    );
  }

  const getBreadcrumbLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Visão Geral';
      case 'clientes': return 'Gerenciamento de Clientes';
      case 'tecnicos': return 'Gerenciamento de Técnicos';
      case 'chamados': return 'Fila de Chamados Ativos';
      case 'backups': return 'Gestão de Redundância e Backups';
      case 'configuracoes': return 'Configurações de Acesso';
      default: return 'Painel Técnico';
    }
  };

  return (
    <div
      id="app-container"
      className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-gray-100 flex font-sans transition-colors duration-200"
    >
      {isLoadingData && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-300">Sincronizando dados...</p>
          </div>
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setActiveTicketId(null); }}
        onLogout={handleLogout}
        userName={profile.name}
        userEmail={profile.email}
        userRole={userRole}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0" id="main-content-layout">
        <header
          id="top-toolbar"
          className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-850 px-6 py-4 flex items-center justify-between sticky top-0 z-30"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-450 dark:hover:text-white rounded-xl bg-slate-50 dark:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xs uppercase tracking-wider font-mono font-bold text-indigo-650 dark:text-indigo-400">
              TechManager / <span className="text-slate-550 dark:text-zinc-400 font-sans font-medium">{getBreadcrumbLabel()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3" id="toolbar-actions">
            <button
              onClick={handleToggleThemeFromToolbar}
              className="p-2 border border-slate-100 dark:border-zinc-800 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
            >
              {profile.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificationAlert(!showNotificationAlert)}
                className="p-2 border border-slate-100 dark:border-zinc-800 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white rounded-xl transition-all hover:bg-slate-50 cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotificationAlert && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-xl rounded-2xl p-4 space-y-3 z-50 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
                    <strong className="text-slate-800 dark:text-white text-sm">Alertas do Sistema</strong>
                    <button onClick={() => setShowNotificationAlert(false)} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                      Limpar
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <span className="block font-bold text-rose-600 dark:text-rose-400 uppercase text-[9px] tracking-widest">CRÍTICO SLA</span>
                      <p className="font-semibold text-slate-700 dark:text-zinc-300">Chamado CHA-1001: Sem conexão de rede no 3º andar.</p>
                      <span className="block text-[10px] text-slate-400">Há 5 minutos • Suporte Técnico</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => setActiveTab('configuracoes')}
              className="flex items-center gap-2 pl-3 border-l border-slate-100 dark:border-zinc-800 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm group-hover:scale-105 transition-transform">
                {profile.avatar || profile.name.charAt(0)}
              </div>
              <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-zinc-300 group-hover:underline">
                {profile.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto" id="viewport-main">
          {profile.theme === 'high_contrast' && (
            <div className="mb-4 p-3 bg-yellow-400 text-black border-2 border-black font-extrabold text-xs rounded-xl flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              SISTEMA EM MODO DE ALTO CONTRASTE (ACESSIBILIDADE ATIVA)
            </div>
          )}

          {(() => {
            switch (activeTab) {
              case 'dashboard':
                if (userRole === 'CUSTOMER') {
                  return <div className="p-8 text-center text-slate-550">Acesso negado.</div>;
                }
                return (
                  <Dashboard
                    clients={clients}
                    technicians={technicians}
                    tickets={tickets}
                    auditLogs={auditLogs}
                    auditPage={currentAuditPage}
                    totalAuditPages={totalAuditPages}
                    isAdmin={userRole === 'ADMIN'}
                    isTechnical={userRole === 'TECHNICAL'}
                    currentUserId={loggedTech.id}  
                    currentUserName={profile.name} 
                    onAuditPageChange={setCurrentAuditPage}
                    onViewTicket={handleViewDetailedTicket}
                    onNavigateToTab={setActiveTab}
                  />
                );

              case 'clientes':
                if (userRole !== 'ADMIN') return <div className="p-8 text-center text-slate-550">Acesso negado.</div>;
                return (
                  <Clientes
                    clients={clients}
                    onAddClient={handleAddClient}
                    onRemoveClient={handleRemoveClient}
                  />
                );

              case 'tecnicos':
                if (userRole !== 'ADMIN') return <div className="p-8 text-center text-slate-550">Acesso negado.</div>;
                return (
                  <Tecnicos
                    technicians={technicians}
                    onAddTechnician={handleAddTechnician}
                    onRemoveTechnician={handleRemoveTechnician}
                  />
                );
                
                
              case 'chamados':
                return (
                  <Chamados
                    tickets={tickets}
                    technicians={technicians}
                    clients={clients}
                    onAddTicket={handleAddTicket}
                    onUpdateTicket={handleUpdateTicket}
                    onAssignTicket={handleAssignTicket}
                    activeTicketId={activeTicketId}
                    setActiveTicketId={setActiveTicketId}
                    userRole={userRole || 'CUSTOMER'}
                    currentUserEmail={currentUser || undefined}
                    onFetchTicketDetails={fetchTicketDetails}
                    loggedTechId={loggedTech.id}
                    loggedTechName={loggedTech.name}
                
                    loggedClientId={loggedClientId}

                  />
                );

              case 'backups':
                if (userRole !== 'ADMIN') return <div className="p-8 text-center text-slate-550">Acesso negado.</div>;
                return (
                  <Backup
                   
                  />
                );

              case 'configuracoes':
                return (
                  <Configuracoes
                    profile={profile}
                    onUpdateProfile={setProfile}
                  />
                );

              default:
                if (userRole === 'CUSTOMER') {
                  setActiveTab('chamados');
                  return null;
                }
                return (
                  <Dashboard
  clients={clients}
  technicians={technicians}
  tickets={tickets}
  auditLogs={auditLogs}
  auditPage={currentAuditPage}
  totalAuditPages={totalAuditPages}
  isAdmin={userRole === 'ADMIN'}
  isTechnical={userRole === 'TECHNICAL'}
  currentUserId={loggedTech.id}       
  currentUserName={profile.name}      
  onAuditPageChange={setCurrentAuditPage}
  onViewTicket={handleViewDetailedTicket}
  onNavigateToTab={setActiveTab}
/>
                );
            }
          })()}
        </main>
      </div>
    </div>
  );
}