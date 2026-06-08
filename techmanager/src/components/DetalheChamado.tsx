import React, { useState, useEffect } from 'react';
import { Ticket, Technician, TicketStatus, Priority, TicketUpdate } from '../types';
import { X, Clock, Loader2, Plus, Lock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, CreditCard, Play } from 'lucide-react';
import { api } from '../services/api';

interface DetalheChamadoProps {
  ticket: Ticket;
  technicians: Technician[];
  onUpdateTicket: (updatedTicket: Ticket) => void;
  onClose: () => void;
  currentUserEmail?: string;
  loggedTechId?: string;
  loggedTechName?: string;
  /** ID do cliente dono do chamado — para mostrar o botão de pagamento */
  loggedClientId?: string;
  userRole?: string;
}

const STATUS_LABEL: Record<TicketStatus, string> = {
  OPEN:            'Aberto',
  ASSIGNED:        'Atribuído',
  IN_PROGRESS:     'Em Andamento',
  COMPLETED:       'Concluído',
  CANCELED:        'Cancelado',
  PAYMENT_PENDING: 'Aguardando Pagamento',
};

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
  loggedClientId,
  userRole
}: DetalheChamadoProps) {

  const ticketTechId   = ticket.technicalId || '';
  const ticketTechName = ticket.technicalName || '';

  // ─── Paginação do histórico ───────────────────────────────────────────────
  const ITEMS_PER_PAGE = 4;
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);

  // ─── Permissões ───────────────────────────────────────────────────────────
  const isAssignedToMe = !!loggedTechId && !!ticketTechId && loggedTechId === ticketTechId;
const canEdit        = isAssignedToMe && !!loggedTechId; // admin não tem loggedTechId, nunca pode editar

  /** Dono do chamado (cliente) pode pagar */
  const isTicketOwner  = !!loggedClientId && loggedClientId === (ticket.clientId || '');

  const isPending      = ticket.status === 'OPEN' || ticket.status === 'ASSIGNED';
  const isInProgress   = ticket.status === 'IN_PROGRESS';
  const isPaymentPending = ticket.status === 'PAYMENT_PENDING';
  const isClosed       = ticket.status === 'COMPLETED' || ticket.status === 'CANCELED';

  // ─── Estado local ─────────────────────────────────────────────────────────
  const [status, setStatus]               = useState<TicketStatus>(ticket.status);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdating, setIsUpdating]       = useState(false);
  const [localUpdates, setLocalUpdates]   = useState<TicketUpdate[]>(ticket.updates || []);

  // Estado de pagamento
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [isPaying, setIsPaying]           = useState(false);

  // Sincroniza estado local quando o ticket mudar externamente
 useEffect(() => {
  setLocalUpdates(ticket.updates || []);
  setCurrentHistoryPage(1);
}, [ticket.id]); // só reseta quando muda de ticket

useEffect(() => {
  refetchTicketDetails();
}, []); 

  // ─── Recarregar dados do backend ─────────────────────────────────────────
  const refetchTicketDetails = async () => {
  try {
    const response = await api.tickets.getDetails(ticket.id);
    const updatedTicketData = response.data || response;
    const rawHistories = updatedTicketData.updates || [];

    const normalizedUpdates: TicketUpdate[] = rawHistories.map((up: any) => ({
      id: up.id,
      comment: up.comment || '',
      changeDate: up.changeDate
        ? new Date(up.changeDate).toLocaleString('pt-BR')
        : new Date().toLocaleString('pt-BR'),
      newStatus: up.newStatus,
      oldStatus: up.oldStatus,
      updateBy: up.updateBy || 'Sistema',
    }));

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
      technicianId: updatedTicketData.technicalId || '',
      technicalId: updatedTicketData.technicalId || '',
      technicalName: updatedTicketData.technicalName || '',
      updates: normalizedUpdates,
      location: ticket.location || 'N/A',
      equipment: ticket.equipment || 'N/A',
      clientId: updatedTicketData.customerId || updatedTicketData.clientId || '',
      slaEstimate: ticket.slaEstimate || 'N/A',
      files: updatedTicketData.files || [],
    };

    // Atualiza estado local PRIMEIRO — garante que a UI atualiza mesmo se onUpdateTicket falhar
    setLocalUpdates(normalizedUpdates);
   

    setStatus(transformedTicket.status);

    // Propaga para o App.tsx por último
    onUpdateTicket(transformedTicket);

    return transformedTicket;
  } catch (err) {
    console.error('❌ Erro ao recarregar dados do ticket:', err);
    // NÃO relança — deixa a UI no estado que conseguiu atualizar
  }
};

  

  // ─── Handlers de ação ────────────────────────────────────────────────────

  /** Inicia o chamado (OPEN/ASSIGNED → IN_PROGRESS) */
  const handleStart = async () => {
    if (!canEdit) return;
    setIsUpdating(true);
    try {
      await api.tickets.start(ticket.id);
      await refetchTicketDetails();
    } catch (err: any) {
      alert(`Erro ao iniciar chamado: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  /** Registra comentário no histórico; automaticamente mantém/define IN_PROGRESS */
  const handlePostUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!updateMessage.trim() || !canEdit) return;
  setIsUpdating(true);
  try {
    console.log('1. Postando comentário...');
    
    if (ticket.status !== 'IN_PROGRESS') {
      await api.tickets.start(ticket.id);
    }

    console.log('2. Chamando changeHistory...');
    await api.tickets.changeHistory(ticket.id, { comment: updateMessage });
    
    console.log('3. Chamando refetch...');
    await refetchTicketDetails();
    
    console.log('4. Limpando campo...');
    setUpdateMessage('');
  } catch (err: any) {
    console.error('ERRO NO handlePostUpdate:', err); // ← ver onde quebra
    alert(`Erro ao atualizar chamado: ${err.message || 'Erro desconhecido'}`);
  } finally {
    setIsUpdating(false);
  }
};

  /** Conclui chamado → PAYMENT_PENDING */
  const handleFinish = async () => {
    if (!canEdit) return;
    const confirmed = window.confirm('Deseja concluir este chamado? O status mudará para Aguardando Pagamento.');
    if (!confirmed) return;
    setIsUpdating(true);
    try {
      await api.tickets.finish(ticket.id);
      await refetchTicketDetails();
    } catch (err: any) {
      alert(`Erro ao concluir chamado: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  /** Cancela chamado → CANCELED */
  const handleCancel = async () => {
    if (!canEdit) return;
    const confirmed = window.confirm('Tem certeza que deseja cancelar este chamado? Esta ação não pode ser desfeita.');
    if (!confirmed) return;
    setIsUpdating(true);
    try {
      await api.tickets.cancel(ticket.id); // endpoint: PUT /ticket/cancel/{id}
      await refetchTicketDetails();
    } catch (err: any) {
      alert(`Erro ao cancelar chamado: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  /** Confirma pagamento (apenas o dono do chamado) */
  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      alert('Informe um valor de pagamento válido.');
      return;
    }
    const confirmed = window.confirm(`Confirmar pagamento de R$ ${amount.toFixed(2)}?`);
    if (!confirmed) return;
    setIsPaying(true);
    try {
      await api.tickets.pay(ticket.id, { value: amount });
      await refetchTicketDetails();
      setPaymentAmount('');
      alert('Pagamento confirmado com sucesso!');
    } catch (err: any) {
      alert(`Erro ao confirmar pagamento: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsPaying(false);
    }
  };

  // ─── Helpers visuais ─────────────────────────────────────────────────────

  const getPriorityBadgeColor = (p: Priority) => {
    switch (p) {
      case 'HIGH':   return 'bg-red-600 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-white';
      case 'LOW':    return 'bg-indigo-600 text-white';
      default:       return 'bg-slate-400 text-white';
    }
  };

// DEPOIS:
const isViewer = !!loggedTechId && !isAssignedToMe; // técnico logado mas não é o dono

const lockReason = (() => {
  if (isClosed) return null;
  if (isViewer) return null; // outros técnicos/admin podem ver sem aviso de bloqueio
  if (!ticketTechId) return 'Este chamado ainda não foi assumido. Vá à lista e clique em "Assumir".';
  if (!isAssignedToMe) return `Somente ${ticketTechName || 'o técnico atribuído'} pode gerenciar este chamado.`;
  return null;
})();

  // ─── Paginação ───────────────────────────────────────────────────────────
  const totalHistoryPages = Math.ceil(localUpdates.length / ITEMS_PER_PAGE);
  const reversedUpdates   = [...localUpdates].reverse();
  const startIndex        = (currentHistoryPage - 1) * ITEMS_PER_PAGE;
  const paginatedReversedUpdates = reversedUpdates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => setCurrentHistoryPage(prev => Math.max(1, prev - 1));
  const handleNextPage     = () => setCurrentHistoryPage(prev => Math.min(totalHistoryPages, prev + 1));

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden max-w-4xl mx-auto">

      {/* ── Header ── */}
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

        {/* ── Esquerdo: Descrição + Histórico ── */}
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

          {/* ── Timeline com paginação ── */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
            <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-400" /> Histórico de Atualizações
            </h3>

            {(!localUpdates || localUpdates.length === 0) ? (
              <p className="text-xs text-slate-400 dark:text-zinc-500 italic pl-3">Nenhuma ação registrada neste chamado até o momento.</p>
            ) : (
              <>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 relative border-l-2 border-slate-100 dark:border-zinc-800 pl-4">
                  {paginatedReversedUpdates.map((up) => (
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

                {totalHistoryPages > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800">
                    <button onClick={handlePreviousPage} disabled={currentHistoryPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">
                      <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                    </button>
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                      Página {currentHistoryPage} de {totalHistoryPages}
                      <span className="ml-1 text-slate-400 dark:text-zinc-500">({localUpdates.length} registros)</span>
                    </span>
                    <button onClick={handleNextPage} disabled={currentHistoryPage === totalHistoryPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all">
                      Próxima <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Direito: Controles ── */}
<div className="lg:col-span-5 p-6 space-y-6 bg-slate-50/40 dark:bg-zinc-900 flex flex-col justify-between">
  <div className="space-y-5">
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
        {canEdit ? 'Controles do Chamado' : 'Informações do Chamado'}
      </h3>

      {/* Badge de status atual — sempre visível */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-zinc-500 tracking-wider">Status atual:</span>
        <StatusBadge status={status} />
      </div>

      {/* Técnico responsável — sempre visível */}
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

      {/* ── SOMENTE PARA O TÉCNICO DONO ── */}
      {canEdit && (
        <>
          {/* Aviso de bloqueio */}
          {lockReason && (
            <div className="flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-[11px] text-red-600 dark:text-red-400 font-medium">
              <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {lockReason}
            </div>
          )}

          {isPending && (
            <button onClick={handleStart} disabled={isUpdating}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Iniciar Chamado
            </button>
          )}

          {isInProgress && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={handleFinish} disabled={isUpdating}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 col-span-1">
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Concluir
              </button>
              <button onClick={handleCancel} disabled={isUpdating}
                className="py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 col-span-1">
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Cancelar
              </button>
            </div>
          )}
        </>
      )}

      {/* ── PAGAMENTO: só para o cliente dono ── */}
      {isPaymentPending && isTicketOwner && (
        <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pagamento Pendente</h4>
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-white">
            Valor total:&nbsp;
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              R$ {ticket.finalValue?.toFixed(2) ?? '—'}
            </span>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              Valor a pagar (R$)
            </label>
            <input
              type="number" min="0" step="0.01"
              placeholder={`Ex: ${ticket.finalValue?.toFixed(2) ?? '100,00'}`}
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button onClick={handlePayment} disabled={isPaying || !paymentAmount}
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
            {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Confirmar Pagamento
          </button>
        </div>
      )}

      {/* Aviso PAYMENT_PENDING para quem não é o cliente dono */}
      {isPaymentPending && !isTicketOwner && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-[11px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2">
          <CreditCard className="w-3.5 h-3.5 shrink-0" />
          Aguardando confirmação de pagamento pelo cliente.
        </div>
      )}
    </div>

    {/* Cálculo de valor — sempre visível */}
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-slate-100 dark:border-zinc-700/80 shadow-sm space-y-3">
      <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Cálculo do Valor Técnico</h4>
      <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-500 dark:text-zinc-500 text-center tracking-wide">
        valor = base × horas × peso_categoria × peso_prioridade
      </div>
      <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
        <li>• <strong>Valor Base:</strong> R$ {ticket.baseValue?.toFixed(2) ?? '100,00'}/h</li>
        <li>• <strong>Horas:</strong> contadas a partir do início — mínimo cobrado: 1h</li>
        <li>• <strong>Valor Final:</strong> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">R$ {ticket.finalValue?.toFixed(2) ?? '—'}</span></li>
      </ul>
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-zinc-700">
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">Peso — Categoria</span>
          <ul className="space-y-0.5 text-[10px] text-slate-600 dark:text-zinc-400">
            <li className="flex justify-between"><span>Hardware</span><span className="font-mono font-bold text-slate-700 dark:text-zinc-300">× 1.0</span></li>
            <li className="flex justify-between"><span>Software</span><span className="font-mono font-bold text-amber-600 dark:text-amber-400">× 1.3</span></li>
            <li className="flex justify-between"><span>Network</span><span className="font-mono font-bold text-red-600 dark:text-red-400">× 1.5</span></li>
          </ul>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 block">Peso — Prioridade</span>
          <ul className="space-y-0.5 text-[10px] text-slate-600 dark:text-zinc-400">
            <li className="flex justify-between"><span>Baixa</span><span className="font-mono font-bold text-slate-700 dark:text-zinc-300">× 1.0</span></li>
            <li className="flex justify-between"><span>Média</span><span className="font-mono font-bold text-amber-600 dark:text-amber-400">× 1.2</span></li>
            <li className="flex justify-between"><span>Alta</span><span className="font-mono font-bold text-red-600 dark:text-red-400">× 1.5</span></li>
          </ul>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed pt-1 border-t border-slate-100 dark:border-zinc-700">
        Ex.: 2h · Network · Alta = R$ 100 × 2 × 1.5 × 1.5 = <strong className="text-emerald-600 dark:text-emerald-400">R$ 450,00</strong>
      </p>
    </div>
  </div>

  {/* Formulário de comentário — só para o técnico dono, em andamento */}
  {(isInProgress || isPaymentPending) && canEdit && (
    <form onSubmit={handlePostUpdate} className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-700 dark:text-zinc-400 uppercase tracking-wide block">
          Registrar Ação *
        </label>
        <textarea rows={3} required
          placeholder="Descreva o procedimento realizado para incluir no histórico..."
          value={updateMessage} onChange={e => setUpdateMessage(e.target.value)}
          className="w-full text-xs p-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button type="submit" disabled={isUpdating || !updateMessage.trim()}
        className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5">
        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
        Gravar Ação no Histórico
      </button>
    </form>
  )}

  {/* Chamado encerrado */}
  {isClosed && (
    <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
      <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic text-center">
        Este chamado está encerrado e não aceita mais atualizações.
      </p>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

// ─── Sub-componente: Badge de status ─────────────────────────────────────────
function StatusBadge({ status }: { status: TicketStatus }) {
  const config: Record<TicketStatus, { label: string; cls: string }> = {
    OPEN:            { label: 'Aberto',               cls: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300' },
    ASSIGNED:        { label: 'Atribuído',             cls: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400' },
    IN_PROGRESS:     { label: 'Em Andamento',          cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' },
    COMPLETED:       { label: 'Concluído',             cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
    CANCELED:        { label: 'Cancelado',             cls: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400' },
    PAYMENT_PENDING: { label: 'Aguardando Pagamento',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  };

  const { label, cls } = config[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}