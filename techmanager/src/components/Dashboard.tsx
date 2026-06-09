import React, { useState, useMemo } from 'react';
import { Client, Technician, Ticket } from '../types';
import { Users, UserCheck, Play, CheckCircle, Flame, ArrowRight, Eye, ShieldCheck, ChevronLeft, ChevronRight, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  technicians: Technician[];
  tickets: Ticket[];
  auditLogs: any[];
  auditPage: number;
  totalAuditPages: number;
  currentUserId: string;
  currentUserName: string;
  isAdmin: boolean;
  isTechnical: boolean;
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

const priorityTranslations: Record<string, string> = {
  'CRITICAL': 'Crítica',
  'HIGH': 'Alta',
  'MEDIUM': 'Média',
  'LOW': 'Baixa',
};

const statusTranslations: Record<string, string> = {
  'OPEN': 'Aberto',
  'ASSIGNED': 'Atribuído',
  'PAYMENT_PENDING': 'Pgto. Pendente',
  'IN_PROGRESS': 'Em Andamento',
  'COMPLETED': 'Resolvido',
  'CANCELED': 'Cancelado',
};

export function Dashboard({
  clients = [],
  technicians = [],
  tickets = [],
  auditLogs = [],
  auditPage,
  totalAuditPages,
  isAdmin,
  isTechnical,
  currentUserId,
  currentUserName,
  onAuditPageChange,
  onViewTicket,
  onNavigateToTab,
}: DashboardProps) {

  if (!isAdmin && !isTechnical) return null;

  const safeClients = clients || [];
  const safeTechnicians = technicians || [];
  const safeTickets = tickets || [];

  // ── PAGINAÇÃO DE CHAMADOS ──
  const [ticketPage, setTicketPage] = useState(1);
  const ticketsPerPage = 6;

  // ── MÉTRICAS GLOBAIS (apenas para admin) ──
  const totalClientsCount = safeClients.length;
  const activeTechniciansCount = safeTechnicians.filter(t => t.status === 'Ativo' || t.status === 'Ocupado').length;
  const inProgressTicketsCount = safeTickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedTicketsCount = safeTickets.filter(t => t.status === 'COMPLETED').length;

  // ── CHAMADOS DO TÉCNICO LOGADO ──
  const myTickets = isTechnical
    ? safeTickets.filter(t => t.technicalName === currentUserName || t.assignedToId === currentUserId)
    : [];

  // ── CHAMADOS PRIORITÁRIOS (admin vê todos abertos/atribuídos; técnico vê só seus) ──
  const allPriorityTickets = (isAdmin ? safeTickets : myTickets)
    .filter(t => t && t.status !== 'COMPLETED' && t.status !== 'CANCELED')
    .sort((a, b) => {
      const w: Record<string, number> = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return (w[b.priority?.toUpperCase()] || 0) - (w[a.priority?.toUpperCase()] || 0);
    });

  // ── PAGINAÇÃO DE CHAMADOS ──
  const totalTicketPages = Math.ceil(allPriorityTickets.length / ticketsPerPage) || 1;
  const priorityTickets = useMemo(() => 
    allPriorityTickets.slice((ticketPage - 1) * ticketsPerPage, ticketPage * ticketsPerPage),
    [allPriorityTickets, ticketPage]
  );

  // ── Cálculos para cards de desempenho (admin) ──
  const completedByTech = safeTickets
    .filter(t => t.status === 'COMPLETED' && t.technicalName)
    .reduce((acc, t) => {
      const name = t.technicalName || 'N/A';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topCompleted = Object.entries(completedByTech).sort((a, b) => b[1] - a[1])[0];

  const inProgressByTech = safeTickets
    .filter(t => t.status === 'IN_PROGRESS' && t.technicalName)
    .reduce((acc, t) => {
      const name = t.technicalName || 'N/A';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topInProgress = Object.entries(inProgressByTech).sort((a, b) => b[1] - a[1])[0];

  const openByCategory = safeTickets
    .filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED')
    .reduce((acc, t) => {
      const cat = t.category || 'N/A';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const topCategory = Object.entries(openByCategory).sort((a, b) => b[1] - a[1])[0];

  const categoryLabels: Record<string, string> = {
    HARDWARE: 'Hardware', SOFTWARE: 'Software', NETWORK: 'Rede',
  };

  // ── Cálculos para cards do técnico ──
  const myOpen      = myTickets.filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED').length;
  const myProgress  = myTickets.filter(t => t.status === 'IN_PROGRESS').length;
  const myCompleted = myTickets.filter(t => t.status === 'COMPLETED').length;
  const myPending   = myTickets.filter(t => t.status === 'PAYMENT_PENDING').length;

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900';
      case 'HIGH':     return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
      case 'MEDIUM':   return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900';
      default:         return 'bg-slate-50 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':       return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
      case 'IN_PROGRESS':     return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      case 'OPEN':            return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
      case 'ASSIGNED':        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-900';
      case 'PAYMENT_PENDING': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
      case 'CANCELED':        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
      default:                return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
    }
  };

  return (
    <div className="space-y-8" id="dashboard-view-wrapper">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isAdmin ? 'Dashboard do Painel' : 'Meu Painel de Trabalho'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {isAdmin
              ? 'Acompanhe em tempo real o gerenciamento técnico corporativo e chamados ativos.'
              : 'Visualize e gerencie suas tarefas agendadas e atendimentos em andamento.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold self-start border border-emerald-200/50 dark:border-emerald-900/40">
          <ShieldCheck className="w-4 h-4 animate-pulse" />
          Servidor e Painel: 100% Operacional
        </div>
      </div>

      {/* ── Metrics Grid (APENAS ADMIN) ── */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div onClick={() => onNavigateToTab('clientes')}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Total de Clientes</span>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{totalClientsCount.toLocaleString('pt-BR')}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Atualizado</span>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div onClick={() => onNavigateToTab('tecnicos')}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Técnicos Ativos</span>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{activeTechniciansCount}</p>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">Monitorados</span>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div onClick={() => onNavigateToTab('chamados')}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Em Fila / Andamento</span>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{inProgressTicketsCount}</p>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                <Flame className="w-3.5 h-3.5 animate-bounce" /> {inProgressTicketsCount} Tickets
              </span>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6" />
            </div>
          </div>

          <div onClick={() => onNavigateToTab('chamados')}
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Chamados Finalizados</span>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{resolvedTicketsCount}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Concluídos</span>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* ── Details Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className={isAdmin ? 'lg:col-span-8 space-y-6' : 'lg:col-span-12 space-y-6'}>

          {/* ── Tabela de Chamados ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800/80 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAdmin ? 'Movimentação Dos Chamados' : 'Meus Chamados Ativos'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {isAdmin
                    ? 'Chamados pendentes ou em andamento ordenados por criticidade.'
                    : 'Listagem de chamados sob sua responsabilidade em andamento.'}
                </p>
              </div>
              <button onClick={() => onNavigateToTab('chamados')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1 cursor-pointer">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Cliente</th>
                    {isAdmin && <th className="py-3 px-3">Técnico</th>}
                    {isTechnical ? (
                      <>
                        <th className="py-3 px-3">Título</th>
                        <th className="py-3 px-3">Descrição</th>
                      </>
                    ) : (
                      <th className="py-3 px-3">Último Comentário</th>
                    )}
                    {isAdmin && <th className="py-3 px-3 text-center">Prioridade</th>}
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-2 text-center">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                  {priorityTickets.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin ? (isTechnical ? 8 : 8) : 7}
                        className="py-10 text-center text-xs text-slate-400 dark:text-zinc-500 italic">
                        {isTechnical
                          ? 'Nenhum chamado ativo atribuído a você no momento.'
                          : 'Nenhum chamado ativo no sistema.'}
                      </td>
                    </tr>
                  )}
                  {priorityTickets.map((t) => {
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{t.id.slice(0, 8)}...</td>
                        <td className="py-3 px-3 font-bold text-slate-900 dark:text-zinc-100 text-xs max-w-[80px] truncate">{t.clientName || 'N/A'}</td>
                        {isAdmin && (
                          <td className="py-3 px-3 text-xs font-semibold text-slate-700 dark:text-zinc-300 max-w-[80px] truncate">
                            {t.technicalName || <span className="text-rose-400 italic">N/A</span>}
                          </td>
                        )}
                        {isTechnical ? (
                          <>
                            <td className="py-3 px-3 text-slate-900 dark:text-zinc-100 text-xs font-semibold max-w-[120px] truncate">{t.title || 'Sem título'}</td>
                            <td className="py-3 px-3 text-slate-500 dark:text-zinc-400 italic text-xs max-w-[150px] truncate">{t.description || 'Sem descrição'}</td>
                          </>
                        ) : (
                          <td className="py-3 px-3 text-slate-500 dark:text-zinc-400 italic text-xs max-w-[130px] truncate">{t.description || 'Sem comentários'}</td>
                        )}
                        {isAdmin && (
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${getPriorityBadgeColor(t.priority)}`}>
                              {priorityTranslations[t.priority?.toUpperCase()] ?? t.priority}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeColor(t.status)}`}>
                            {statusTranslations[t.status?.toUpperCase()] ?? t.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                          {t.creationDate ? new Date(t.creationDate).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button onClick={() => onViewTicket(t.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── PAGINAÇÃO ── */}
            {allPriorityTickets.length > ticketsPerPage && (
              <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Mostrando <strong className="text-slate-700 dark:text-zinc-200">{allPriorityTickets.length === 0 ? 0 : (ticketPage - 1) * ticketsPerPage + 1}</strong> a{' '}
                  <strong className="text-slate-700 dark:text-zinc-200">{Math.min(ticketPage * ticketsPerPage, allPriorityTickets.length)}</strong> de{' '}
                  <strong className="text-slate-700 dark:text-zinc-200">{allPriorityTickets.length}</strong> chamados
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTicketPage(p => Math.max(p - 1, 1))} 
                    disabled={ticketPage === 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalTicketPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setTicketPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          p === ticketPage
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setTicketPage(p => Math.min(p + 1, totalTicketPages))} 
                    disabled={ticketPage === totalTicketPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Próximo <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Cards de Desempenho ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              {isAdmin ? 'Análise de Desempenho da Equipe' : 'Resumo dos Meus Atendimentos'}
            </h3>

            {isAdmin ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Top técnico concluídos */}
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-xl border border-slate-100 dark:border-zinc-800 min-h-[120px] flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Mais Produtivo
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                      {topCompleted ? `${topCompleted[1]} concluídos` : '—'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {topCompleted ? topCompleted[0] : 'Nenhum dado ainda'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Técnico com maior número de chamados finalizados.</p>
                </div>

                {/* Card 2: Top técnico em andamento */}
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Mais Ativo
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                      {topInProgress ? `${topInProgress[1]} em andamento` : '—'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {topInProgress ? topInProgress[0] : 'Nenhum dado ainda'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Técnico com mais atendimentos simultâneos agora.</p>
                </div>

                {/* Card 3: Categoria mais demandada */}
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Mais Demandada
                    </span>
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
                      {topCategory ? `${topCategory[1]} abertos` : '—'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {topCategory ? (categoryLabels[topCategory[0]] || topCategory[0]) : 'Nenhum dado ainda'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Categoria com maior fila de chamados pendentes.</p>
                </div>
              </div>
            ) : (
              // Cards do técnico
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Abertos</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{myOpen}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Aguardando início</p>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Em Andamento</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{myProgress}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Atendimentos ativos</p>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pgto. Pendente</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{myPending}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Aguardando pagamento</p>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800 space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Concluídos</span>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{myCompleted}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Finalizados com sucesso</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Auditoria (só admin) ── */}
        {isAdmin && (
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between h-full min-h-[500px]">
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Auditoria do Sistema</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Logs de segurança e ações recentes de administradores.</p>
                </div>

                <div className="space-y-4 relative pl-3 border-l border-slate-100 dark:border-zinc-800">
                  {(auditLogs || []).map((log: any, index: number) => {
                    const isCritical = ['LOGIN_FAILED', 'LOGIN_BLOCKED', 'USER_DELETED'].includes(log.action);
                    return (
                      <div key={log.id || index} className="flex flex-col space-y-1 relative pb-2">
                        <div className={`absolute -left-[17.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${isCritical ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`} />
                        <div className="flex justify-between items-center w-full gap-2">
                          <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                            {log.createdAt ? new Date(log.createdAt).toLocaleString('pt-BR') : 'Sem data'}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isCritical ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                            {log.action ? log.action.replace(/_/g, ' ') : 'AÇÃO'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{log.description}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono truncate">Alvo: {log.target || 'N/A'}</p>
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

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-4 mt-6">
                <button onClick={() => onAuditPageChange(auditPage - 1)} disabled={auditPage === 0}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer">
                  <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                </button>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  Página <strong className="text-slate-900 dark:text-white">{auditPage + 1}</strong> de <strong className="text-slate-900 dark:text-white">{totalAuditPages || 1}</strong>
                </span>
                <button onClick={() => onAuditPageChange(auditPage + 1)} disabled={auditPage >= totalAuditPages - 1}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer">
                  Próximo <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}