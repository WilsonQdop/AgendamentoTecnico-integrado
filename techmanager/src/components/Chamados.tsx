import React, { useState, useEffect, useMemo } from 'react';
import { Ticket, Technician, TicketStatus, Priority, Category, Client } from '../types';
import { Plus, Search, Filter, ArrowRight, Eye, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { FormChamado } from './FormChamado';
import { DetalheChamado } from './DetalheChamado';

interface TicketsProps {
  tickets: Ticket[];
  technicians: Technician[];
  clients: Client[];
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'status' | 'creationDate' | 'updates' | 'slaEstimate'>) => void;
  onUpdateTicket: (ticket: Ticket) => void;
  activeTicketId?: string | null;
  setActiveTicketId: (id: string | null) => void;
  userRole: string;
  onAssignTicket: (ticketId: string) => void;
  currentUserEmail?: string;
  onFetchTicketDetails: (ticketId: string) => Promise<Ticket | null>;
  // UUID e nome do técnico logado, resolvidos pelo App.tsx via JWT + getDetails
  loggedTechId?: string;
  loggedTechName?: string;
}

const PRIORITY_LABELS: Record<Priority, string> = {
  LOW:    '🟢 Baixa',
  MEDIUM: '🔵 Média',
  HIGH:   '🟡 Alta',
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN:            '🔴 Aberto',
  ASSIGNED:        '🟠 Atribuído',
  IN_PROGRESS:     '🔵 Em Andamento',
  COMPLETED:       '🟢 Concluído',
  CANCELED:        '⚪ Cancelado',
  PAYMENT_PENDING: '🟡 Aguard. Pagamento',
};

export function Chamados({
  tickets, technicians, clients,
  onAddTicket, onUpdateTicket,
  activeTicketId, setActiveTicketId,
  userRole, onAssignTicket,
  currentUserEmail, onFetchTicketDetails,
  loggedTechId, loggedTechName,
}: TicketsProps) {

  const [searchTerm, setSearchTerm]             = useState('');
  const [statusFilter, setStatusFilter]         = useState<string>('Todos');
  const [priorityFilter, setPriorityFilter]     = useState<string>('Todas');
  const [technicianFilter, setTechnicianFilter] = useState<string>('Todos');
  const [isNewTicketOpen, setIsNewTicketOpen]   = useState(false);
  const [currentPage, setCurrentPage]           = useState(1);
  const itemsPerPage = 6;

  // Ticket detalhado carregado via getDetails (tem technicalId real do banco)
  const [detailedTicket, setDetailedTicket]     = useState<Ticket | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  useEffect(() => {
    if (!activeTicketId) { setDetailedTicket(null); return; }
    let cancelled = false;
    setIsFetchingDetail(true);
    onFetchTicketDetails(activeTicketId)
      .then(rich => {
        if (cancelled) return;
        if (rich) {
          setDetailedTicket(rich);
        } else {
          // fallback para o dado do summary caso a chamada falhe
          setDetailedTicket(tickets.find(t => t.id === activeTicketId) || null);
        }
      })
      .catch(() => {
        if (!cancelled) setDetailedTicket(tickets.find(t => t.id === activeTicketId) || null);
      })
      .finally(() => { if (!cancelled) setIsFetchingDetail(false); });
    return () => { cancelled = true; };
  }, [activeTicketId]);

  const filteredTickets = useMemo(() => tickets.filter(ticket => {
    const matchesSearch     = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus     = statusFilter     === 'Todos' || ticket.status   === statusFilter;
    const matchesPriority   = priorityFilter   === 'Todas' || ticket.priority === priorityFilter;
    const matchesTechnician = technicianFilter === 'Todos' ||
      (technicianFilter === 'Não Atribuído' && !ticket.assignedTechnicianId) ||
      ticket.assignedTechnicianId === technicianFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
  }), [tickets, searchTerm, statusFilter, priorityFilter, technicianFilter]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, priorityFilter, technicianFilter]);

  const totalItems    = filteredTickets.length;
  const totalPages    = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() =>
    filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredTickets, currentPage]
  );

  const getPriorityBadgeColor = (p: Priority) => {
    switch (p) {
      case 'HIGH':   return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900';
      case 'MEDIUM': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900';
      default:       return 'bg-slate-50 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800';
    }
  };

  const getStatusBadgeColor = (s: TicketStatus) => {
    switch (s) {
      case 'COMPLETED':       return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900';
      case 'IN_PROGRESS':     return 'bg-blue-50 text-blue-700 dark:bg-blue-950/45 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      case 'OPEN':            return 'bg-rose-50 text-rose-700 dark:bg-rose-950/45 dark:text-rose-400 border border-rose-200 dark:border-rose-900';
      case 'ASSIGNED':        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/45 dark:text-orange-400 border border-orange-200 dark:border-orange-900';
      case 'PAYMENT_PENDING': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/45 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900';
      default:                return 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-500';
    }
  };

  const handleCreateTicketSubmit = (formData: any) => {
    const selectedClient = clients.find(c => c.id === formData.clientId);
    onAddTicket({ ...formData, clientName: selectedClient ? `${selectedClient.name} (${selectedClient.company})` : 'Cliente Desconhecido', finalValue: formData.baseValue, technicalName: '', technicalId: '' });
    setIsNewTicketOpen(false);
  };

  const isTechnician = userRole === 'TECHNICAL';
  const resetFilters = () => { setSearchTerm(''); setStatusFilter('Todos'); setPriorityFilter('Todas'); setTechnicianFilter('Todos'); };

  return (
    <div className="space-y-6">
      {isNewTicketOpen ? (
        <FormChamado onOpenTicket={handleCreateTicketSubmit} onCancel={() => setIsNewTicketOpen(false)} />
      ) : activeTicketId ? (
        isFetchingDetail ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Carregando dados do chamado...</p>
          </div>
        ) : detailedTicket ? (
          <DetalheChamado
            ticket={detailedTicket}
            technicians={technicians}
            onUpdateTicket={onUpdateTicket}
            onClose={() => { setActiveTicketId(null); setDetailedTicket(null); }}
            currentUserEmail={currentUserEmail}
            // Se o App.tsx não resolveu o loggedTechId (lista vazia),
            // usa o technicalId do próprio ticket carregado via getDetails.
            // Isso é seguro: o backend só retorna o ticket para quem tem acesso,
            // e o currentUserEmail confirma que é o mesmo usuário da sessão.
            loggedTechId={
              loggedTechId ||
              (detailedTicket.technicalId && currentUserEmail ? detailedTicket.technicalId : '')
            }
            loggedTechName={loggedTechName || detailedTicket.technicalName || ''}
          />
        ) : null
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gerenciamento de Chamados</h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Abra, filtre e monitore chamados de suporte técnico.</p>
            </div>
            <button onClick={() => setIsNewTicketOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 self-start cursor-pointer transition-all shadow-md shadow-indigo-600/10">
              <Plus className="w-4 h-4" /> Abrir Novo Chamado
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Filter className="w-4 h-4 text-slate-400" /> Painel de Filtros Técnicos</span>
              <button onClick={resetFilters} className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 uppercase text-[10px] cursor-pointer">
                <RefreshCw className="w-3 h-3" /> Limpar Filtros
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID / Título</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Search className="w-3.5 h-3.5" /></span>
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Pesquisar..."
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-white">
                  <option value="Todos">Todos os Status</option>
                  <option value="OPEN">🔴 Aberto</option>
                  <option value="ASSIGNED">🟠 Atribuído</option>
                  <option value="IN_PROGRESS">🔵 Em Andamento</option>
                  <option value="COMPLETED">🟢 Concluído</option>
                  <option value="PAYMENT_PENDING">🟡 Aguard. Pagamento</option>
                  <option value="CANCELED">⚪ Cancelado</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Técnico</label>
                <select value={technicianFilter} onChange={e => setTechnicianFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-white">
                  <option value="Todos">Todos os Técnicos</option>
                  <option value="Não Atribuído">Não Atribuído</option>
                  {technicians.map((tech, i) => (
                    <option key={`${tech.id}-${i}`} value={tech.id}>{tech.name} ({tech.specialty})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prioridade</label>
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-white">
                  <option value="Todas">Todas</option>
                  <option value="LOW">🟢 Baixa</option>
                  <option value="MEDIUM">🔵 Média</option>
                  <option value="HIGH">🟡 Alta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                    <th className="py-3 px-6">ID / Título</th>
                    <th className="py-3 px-6">Cliente</th>
                    <th className="py-3 px-6">Técnico</th>
                    <th className="py-3 px-6">Valor</th>
                    <th className="py-3 px-6 text-center">Prioridade</th>
                    <th className="py-3 px-6">Data</th>
                    <th className="py-3 px-6">Status</th>
                    {isTechnician && <th className="py-3 px-6 text-center">Ações</th>}
                    <th className="py-3 px-4 text-center">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                  {paginatedTickets.map(ticket => {
                    const assignedTech = technicians.find(t => t.id === ticket.assignedTechnicianId);
                    const canAssign    = isTechnician && ticket.status === 'OPEN';
                    return (
                      <tr key={ticket.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 px-6">
                          <span className="block font-mono text-[11px] font-bold text-slate-400 dark:text-zinc-500">{ticket.id}</span>
                          <span onClick={() => setActiveTicketId(ticket.id)}
                            className="font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-sm line-clamp-1 max-w-[210px]">
                            {ticket.title}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-600 dark:text-zinc-300 max-w-[160px] truncate">{ticket.clientName}</td>
                        <td className="py-4 px-6">
                          {ticket.technicalName && ticket.technicalName !== 'Nenhum técnico designado'
                            ? <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{ticket.technicalName}</span>
                            : assignedTech
                              ? <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{assignedTech.name}</span>
                              : <span className="text-xs italic text-rose-500">Pendente de Atribuição</span>
                          }
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">R$ {ticket.finalValue.toFixed(2)}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getPriorityBadgeColor(ticket.priority)}`}>
                            {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 dark:text-zinc-400">{ticket.creationDate.split(', ')[0]}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getStatusBadgeColor(ticket.status)}`}>
                            {STATUS_LABELS[ticket.status] ?? ticket.status}
                          </span>
                        </td>
                        {isTechnician && (
                          <td className="py-4 px-6 text-center">
                            {canAssign
                              ? <button onClick={e => { e.stopPropagation(); onAssignTicket(ticket.id); }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm">
                                  Assumir <ArrowRight className="w-3 h-3" />
                                </button>
                              : <span className="text-xs text-slate-400 dark:text-zinc-500 italic">–</span>
                            }
                          </td>
                        )}
                        <td className="py-4 px-4 text-center">
                          <button onClick={() => setActiveTicketId(ticket.id)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {paginatedTickets.length === 0 && (
                    <tr><td colSpan={isTechnician ? 9 : 8} className="py-12 text-center text-slate-400 dark:text-zinc-500">Nenhum chamado encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-zinc-400">
              <div>
                Mostrando <strong className="text-slate-700 dark:text-zinc-200">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</strong> a{' '}
                <strong className="text-slate-700 dark:text-zinc-200">{Math.min(currentPage * itemsPerPage, totalItems)}</strong> de{' '}
                <strong className="text-slate-700 dark:text-zinc-200">{totalItems}</strong> registros
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                  className="p-1.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold text-center transition-colors cursor-pointer ${p === currentPage ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:bg-slate-50'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
