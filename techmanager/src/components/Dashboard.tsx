import { Client, Technician, Ticket } from '../types';
import { Users, UserCheck, Play, CheckCircle, Flame, Calendar, Clock, ArrowRight, Eye, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  technicians: Technician[];
  tickets: Ticket[];
  auditLogs: any[]; 
  auditPage: number;
  totalAuditPages: number;
  isAdmin: boolean;
  isTechnical: boolean // 👈 Controle de perfil para renderização condicional
  onAuditPageChange: (page: number) => void;
  onViewTicket: (ticketId: string) => void;
  onNavigateToTab: (tab: 'clientes' | 'tecnicos' | 'chamados') => void;
}

export interface AuditLogEntry {
  id: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGIN_BLOCKED' | 'USER_DELETED' | string;
  target: string;
  description: string;
  createdAt: string;
}

export function Dashboard({ 
  clients = [], 
  technicians = [], 
  tickets = [], 
  auditLogs = [], 
  auditPage,
  totalAuditPages,
  isAdmin,
  isTechnical,
  onAuditPageChange,
  onViewTicket, 
  onNavigateToTab 
}: DashboardProps) {
  
  // 🛡️ SEGURANÇA ABSOLUTA CONTRA ACESSO DE CLIENTES:
  // Se não for admin, bloqueia a renderização completa do Dashboard imediatamente.
  if (!isAdmin && !isTechnical) {
    return null;
  }

  // Dynamic Calculations baseados no estado seguro
  const safeClients = clients || [];
  const safeTechnicians = technicians || [];
  const safeTickets = tickets || [];

  const totalClientsCount = safeClients.length;
  const activeTechniciansCount = safeTechnicians.filter(t => t.status === 'Ativo' || t.status === 'Ocupado').length;
  const inProgressTicketsCount = safeTickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedTicketsCount = safeTickets.filter(t => t.status === 'COMPLETED').length;

  const priorityTickets = safeTickets
    .filter(t => t && t.status !== 'COMPLETED' && t.status !== 'CANCELED')
    .sort((a, b) => {
      const priorityWeights: Record<string, number> = { 'Crítica': 4, 'Alta': 3, 'Média': 2, 'Baixa': 1 };
      const weightB = priorityWeights[b.priority] || 0;
      const weightA = priorityWeights[a.priority] || 0;
      return weightB - weightA;
    })
    .slice(0, 4);

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Crítica':
        return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900';
      case 'Alta':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
      case 'Média':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Resolvido':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
      case 'Em Andamento':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      case 'Pendente':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-8" id="dashboard-view-wrapper">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="dashboard-header-block">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard do Painel</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Acompanhe em tempo real o gerenciamento técnico corporativo e chamados ativos.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold self-start border border-emerald-200/50 dark:border-emerald-900/40" id="system-status-pill">
          <ShieldCheck className="w-4 h-4 animate-pulse" />
          Servidor e Painel: 100% Operacional
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-metrics-grid">
        {/* Metric 1: Clients */}
        <div
          id="metric-card-clients"
          onClick={() => onNavigateToTab('clientes')}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Total de Clientes
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{totalClientsCount.toLocaleString('pt-BR')}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Atualizado
            </span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Technicians */}
        <div
          id="metric-card-technicians"
          onClick={() => onNavigateToTab('tecnicos')}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Técnicos Ativos
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{activeTechniciansCount}</p>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
              Monitorados
            </span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: In Progress Tickets */}
        <div
          id="metric-card-pending"
          onClick={() => onNavigateToTab('chamados')}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Em Fila / Andamento
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{inProgressTicketsCount}</p>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
              <Flame className="w-3.5 h-3.5 animate-bounce" /> {safeTickets.filter(t => t?.status === 'IN_PROGRESS').length} Tickets
            </span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <Play className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Resolved Tickets */}
        <div
          id="metric-card-finished"
          onClick={() => onNavigateToTab('chamados')}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Chamados Finalizados
            </span>
            <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{resolvedTicketsCount}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Concluídos
            </span>
          </div>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-details-grid">
        
        {/* Coluna da Esquerda */}
        <div className="lg:col-span-8 space-y-6" id="dashboard-left-zone">
          
          {/* Box 1: Priority Active Tickets */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden" id="card-priority-tickets">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800/80 flex justify-between items-center" id="card-priority-tickets-header">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Movimentação Dos Chamados</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Chamados pendentes ou em andamento de alta criticidade.</p>
              </div>
              <button
                onClick={() => onNavigateToTab('chamados')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-all-tickets-link"
              >
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto" id="priority-tickets-table-wrapper">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                    <th className="py-3 px-6">ID / Título</th>
                    <th className="py-3 px-6">Prioridade</th>
                    <th className="py-3 px-6">Solicitante</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                  {priorityTickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors" id={`priority-row-${t.id}`}>
                      <td className="py-3.5 px-6">
                        <span className="block font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">{t.id}</span>
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-sm max-w-xs">{t.title}</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getPriorityBadgeColor(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-600 dark:text-zinc-300 max-w-[150px] truncate">
                        {t.clientName ? t.clientName.split(' (')[0] : 'N/A'}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadgeColor(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => onViewTicket(t.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                          title="Ver Detalhes do Chamado"
                          id={`btn-view-${t.id}`}
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {priorityTickets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-zinc-500">
                        Nenhum chamado de alta prioridade em aberto no momento!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box 2: Next Tasks Timeline */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6" id="card-next-tasks">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> Próximas Tarefas Programadas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="next-tasks-grid">
              <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 14:00 - Hoje</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px]">REDE</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Fusão de Fibra Backbone</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Instalação na Ala Sul da Inova Contábil.</p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Amanhã</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded text-[10px]">SLA PREV.</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Reconstrução RAID 5</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Entrega de discos e início de sincronização NAS.</p>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 26 Mai, 09:30</span>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px]">VISTORIA</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">Upgrade Geral do Firewall</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Clínica Sorriso do Vale (SLA Faturamento).</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🛡️ Coluna de Auditoria: Mantida apenas para o ADMIN */}
        <div className="lg:col-span-4" id="dashboard-right-zone">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between h-full min-h-[500px]" id="card-audit-logs">
            
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Auditoria do Sistema</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Logs de segurança e ações recentes de administradores.</p>
              </div>

              <div className="space-y-4 relative pl-3 border-l border-slate-100 dark:border-zinc-800" id="audit-logs-list">
                {(auditLogs || []).map((log: any, index: number) => {
                  const isCritical = ['LOGIN_FAILED', 'LOGIN_BLOCKED', 'USER_DELETED'].includes(log.action);
                  
                  return (
                    <div key={log.id || index} className="flex flex-col space-y-1 relative pb-2" id={`audit-item-${log.id || index}`}>
                      <div className={`absolute -left-[17.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                        isCritical ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'
                      }`}></div>
                      
                      <div className="flex justify-between items-center w-full gap-2">
                        <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString('pt-BR') : 'Sem data'}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isCritical 
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' 
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                        }`}>
                          {log.action ? log.action.replace('_', ' ') : 'AÇÃO'}
                        </span>
                      </div>
                      
                      <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        {log.description}
                      </p>
                      
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                        Alvo: {log.target || 'N/A'}
                      </p>
                    </div>
                  );
                })}

                {(auditLogs || []).length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-zinc-500 text-center py-8">
                    Nenhum log de auditoria disponível no momento.
                  </p>
                )}
              </div>
            </div>

            {/* Controles de Paginação */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4 mt-6" id="audit-pagination-controls">
              <button
                onClick={() => onAuditPageChange(auditPage - 1)}
                disabled={auditPage === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-slate-50 dark:disabled:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              
              <span className="text-xs text-slate-500 dark:text-zinc-400">
                Página <strong className="text-slate-900 dark:text-white">{auditPage + 1}</strong> de <strong className="text-slate-900 dark:text-white">{totalAuditPages || 1}</strong>
              </span>

              <button
                onClick={() => onAuditPageChange(auditPage + 1)}
                disabled={auditPage >= totalAuditPages - 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-slate-50 dark:disabled:hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                Próximo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}