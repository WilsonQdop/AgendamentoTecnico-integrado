import React, { useState, useEffect } from 'react';
import { Ticket, Technician, TicketStatus, Priority, TicketUpdate } from '../types';
import { X, Clock, Loader2, Plus, Lock } from 'lucide-react';
import { api } from '../services/api';

interface DetalheChamadoProps {
  ticket: Ticket;
  technicians: Technician[];
  onUpdateTicket: (updatedTicket: Ticket) => void;
  onClose: () => void;
  currentUserEmail?: string;
  loggedTechId?: string;
  loggedTechName?: string;
}

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'IN_PROGRESS', label: '🔵 Em Andamento' },
  { value: 'COMPLETED',   label: '🟢 Concluído' },
  { value: 'CANCELED',    label: '⚪ Cancelado' },
];

const PRIORITY_LABEL: Record<Priority, string> = {
  HIGH:   'Alta',
  MEDIUM: 'Média',
  LOW:    'Baixa',
};

export function DetalheChamado({
  ticket,
  technicians,
  onUpdateTicket,
  onClose,
  currentUserEmail,
  loggedTechId,
  loggedTechName,
}: DetalheChamadoProps) {

  const ticketTechId   = ticket.technicalId || '';
  const ticketTechName = ticket.technicalName || '';

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isAssignedToMe = !!loggedTechId && !!ticketTechId && loggedTechId === ticketTechId;
  const canEdit        = isAssignedToMe;
  const isPending      = ticket.status === 'OPEN' || ticket.status === 'ASSIGNED';

  const [status, setStatus]               = useState<TicketStatus>(ticket.status);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdating, setIsUpdating]       = useState(false);
  
  // 🔥 Estado local isolado para garantir que a timeline mude na hora em que o backend responder
  const [localUpdates, setLocalUpdates]   = useState<TicketUpdate[]>(ticket.updates || []);

  // Sincroniza o estado local caso o ticket mude via props externamente
  useEffect(() => {
    if (ticket.updates) {
      setLocalUpdates(ticket.updates);
    }
    refetchTicketDetails();
  }, [ticket.updates]);

  // ─── Função auxiliar: Recarrega os dados do ticket do backend ─────────────
  const refetchTicketDetails = async () => {
    try {
      const response = await api.tickets.getDetails(ticket.id);
      const updatedTicketData = response.data || response;
      
      // Captura a lista mapeada no seu Record do Spring Boot (campo 'updates')
      const rawHistories = updatedTicketData.updates || [];

      // 🔄 NORMALIZAÇÃO: Converte o DTO do Java para a tipagem do Frontend
      const normalizedUpdates: TicketUpdate[] = rawHistories.map((up: any) => ({
        id: up.id,
        comment: up.comment || '',
        changeDate: up.changeDate 
          ? new Date(up.changeDate).toLocaleString('pt-BR') 
          : new Date().toLocaleString('pt-BR'),
        newStatus: up.newStatus,
        updateBy: up.updateBy || 'Sistema'
      }));

      // Transforma a resposta do backend para o tipo Ticket local
      const transformedTicket: Ticket = {
        id: updatedTicketData.id,
        title: updatedTicketData.title,
        description: updatedTicketData.description || 'Nenhuma descrição fornecida.',
        category: updatedTicketData.category,
        priority: updatedTicketData.priority,
        status: updatedTicketData.status,
        baseValue: updatedTicketData.baseValue || 100,
        finalValue: updatedTicketData.finalValue || 100,
        paymentConfirmed: updatedTicketData.paymentConfirmed || false,
        creationDate: updatedTicketData.creationDate 
          ? new Date(updatedTicketData.creationDate).toLocaleString('pt-BR') 
          : new Date().toLocaleString('pt-BR'),
        clientName: updatedTicketData.clientName || 'Cliente',
        technicalId: updatedTicketData.technicalId || '',
        technicalName: updatedTicketData.technicalName || '',
        updates: normalizedUpdates,

        // Campos complementares para o layout não quebrar
        location: ticket.location || 'N/A',
        equipment: ticket.equipment || 'N/A',
        clientId: updatedTicketData.clientId || '',
        slaEstimate: ticket.slaEstimate || 'N/A',
        files: updatedTicketData.files || [],
      };

      console.log('✅ Ticket atualizado do backend com histórico mapeado:', transformedTicket);
      
      // Força a renderização imediata do histórico local na janela aberta
      setLocalUpdates(normalizedUpdates);
      
      // Envia a atualização para o estado macro no App.tsx
      onUpdateTicket(transformedTicket);
      setStatus(transformedTicket.status);
      
      return transformedTicket;
    } catch (err) {
      console.error('❌ Erro ao recarregar dados do ticket:', err);
      throw err;
    }
  };

  const handleStart = async () => {
    if (!canEdit) return;
    setIsUpdating(true);
    try {
      await api.tickets.start(ticket.id);
      await refetchTicketDetails();
      alert('Chamado iniciado! O contador de horas começou.');
    } catch (err: any) {
      alert(`Erro ao iniciar chamado: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateMessage.trim() || !canEdit) return;
    setIsUpdating(true);
    try {
      // 1. Se o status na tela foi modificado para COMPLETED e o chamado não estava concluído
      if (status === 'COMPLETED' && ticket.status !== 'COMPLETED') {
        await api.tickets.finish(ticket.id);
      } else if (ticket.status !== 'IN_PROGRESS' && ticket.status !== 'COMPLETED') {
        // Se ainda for OPEN ou ASSIGNED, inicia por segurança antes de comentar
        await api.tickets.start(ticket.id);
      }

      // 2. Registra o comentário no histórico através da API
      await api.tickets.changeHistory(ticket.id, { comment: updateMessage });

      // 3. Recarrega os dados completos sincronizados com as tabelas do banco
      const updatedTicket = await refetchTicketDetails();

      // 4. Limpa o formulário de texto
      setUpdateMessage('');
      console.log('✅ Atualização salva e histórico recarregado:', updatedTicket);
    } catch (err: any) {
      alert(`Erro ao atualizar chamado: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityBadgeColor = (p: Priority) => {
    switch (p) {
      case 'HIGH':   return 'bg-red-600 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-white';
      case 'LOW':    return 'bg-indigo-600 text-white';
      default:       return 'bg-slate-400 text-white';
    }
  };

  const lockReason = (() => {
    if (!ticketTechId) return 'Este chamado ainda não foi assumido. Vá à lista e clique em "Assumir".';
    if (!isAssignedToMe) return `Somente ${ticketTechName || 'o técnico atribuído'} pode gerenciar este chamado.`;
    return null;
  })();

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden max-w-4xl mx-auto">

      {/* Header */}
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
          <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">{ticket.id}</span>
          <h2 className="text-xl font-bold tracking-tight line-clamp-1">{ticket.title}</h2>
          <p className="text-xs text-slate-400">{ticket.clientName || 'Cliente Corporativo'}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${getPriorityBadgeColor(ticket.priority)}`}>
            {PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
          </span>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-zinc-800">

        {/* Esquerdo: Descrição + Histórico */}
        <div className="lg:col-span-7 p-6 space-y-6">

          <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block uppercase tracking-wider text-[9px]">🕐 Data de Abertura</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.creationDate || '—'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block uppercase tracking-wider text-[9px]">📍 Localização / Setor</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.location || 'N/A'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Descrição do Problema</h3>
            <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80">
              {ticket.description || 'Nenhuma descrição detalhada fornecida.'}
            </p>
          </div>

          {/* Timeline mapeada com chaves do estado isolado localUpdates */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
            <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-400" /> Histórico de Atualizações
            </h3>
            
            {(!localUpdates || localUpdates.length === 0) ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 italic pl-3">Nenhuma ação registrada neste chamado até o momento.</p>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 relative border-l-2 border-slate-100 dark:border-zinc-800 pl-4">
                {localUpdates.map((up) => (
                  <div key={up.id} className="text-xs space-y-1 relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-400 dark:bg-indigo-600 border-2 border-white dark:border-zinc-900" />
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{up.changeDate}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{up.updateBy}</span>
                    </div>
                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed bg-slate-50/60 dark:bg-zinc-800/20 p-2 rounded-lg mt-0.5">
                      {up.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Direito: Controles */}
        <div className="lg:col-span-5 p-6 space-y-6 bg-slate-50/40 dark:bg-zinc-900 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">Controles do Chamado</h3>

              {lockReason && (
                <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-[11px] text-red-600 dark:text-red-400 font-medium">
                  <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {lockReason}
                </div>
              )}

              {isPending && canEdit && (
                <button onClick={handleStart} disabled={isUpdating}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : '▶'}
                  Iniciar Chamado
                </button>
              )}

              {!isPending && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-500">Alterar Status</label>
                  <select value={status} disabled={!canEdit} onChange={e => setStatus(e.target.value as TicketStatus)}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-semibold text-slate-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed">
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase dark:text-zinc-500">Técnico Responsável</label>
                <div className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-800 dark:text-white flex items-center gap-2">
                  {ticketTechName ? (
                    <>
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {ticketTechName.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-semibold">{ticketTechName}</span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-500 italic">Nenhum técnico assumiu ainda</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-100 dark:border-zinc-700/80 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Cálculo do Valor Técnico</h4>
              <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                <li>• <strong>Valor Base:</strong> R$ {ticket.baseValue?.toFixed(2) ?? '100,00'}/h</li>
                <li>• <strong>Contador:</strong> horas acumuladas a partir do início (<code>IN_PROGRESS</code>)</li>
                <li>• <strong>Valor Estimado:</strong> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">R$ {ticket.finalValue?.toFixed(2) ?? '—'}</span></li>
              </ul>
            </div>
          </div>

          {/* Formulário com gatilho sincronizado de recarregamento */}
          <form onSubmit={handlePostUpdate} className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wide block">Registrar Ação *</label>
              <textarea rows={3} required disabled={!canEdit}
                placeholder={canEdit ? 'Descreva o procedimento realizado para incluir no histórico...' : 'Acesso bloqueado — você não é o técnico responsável.'}
                value={updateMessage} onChange={e => setUpdateMessage(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button type="submit" disabled={isUpdating || !updateMessage.trim() || !canEdit}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5">
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Gravar Ação no Histórico
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}