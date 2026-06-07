import React, { useState, useEffect } from 'react';
import { BackupFrequency, BackupHistory, BackupScheduleState } from '../types';
import {
  Play, Save, RefreshCcw, HardDrive, ShieldCheck,
  Clock, CalendarClock, XCircle, CheckCircle2, AlertTriangle,
  ServerCrash, Loader2, Info, FileCode2
} from 'lucide-react';
import { api } from '../services/api';

const FREQUENCY_LABELS: Record<BackupFrequency, string> = {
  ONCE:    'Uma única vez',
  DAILY:   'Diário',
  WEEKLY:  'Semanal',
  MONTHLY: 'Mensal',
};

const SCHEDULE_KEY = 'tm_backup_schedule';

function loadSchedule(): BackupScheduleState {
  try { return JSON.parse(localStorage.getItem(SCHEDULE_KEY) || 'null') || { active: false, frequency: null, nextExecution: null }; }
  catch { return { active: false, frequency: null, nextExecution: null }; }
}

function saveSchedule(s: BackupScheduleState) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(s));
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('pt-BR'); }
  catch { return iso; }
}

// ─── Extrai a data legível do nome gerado pelo Java (ex: backup_db_20260607_143000.sql)
function parseDateFromFileName(fileName: string): string {
  const match = fileName.match(/_(\d{8}_\d{6})\.sql$/);
  if (match) {
    const str = match[1];
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);
    const hour = str.substring(9, 11);
    const min = str.substring(11, 13);
    const sec = str.substring(13, 15);
    return `${day}/${month}/${year} às ${hour}:${min}:${sec}`;
  }
  return 'Data desconhecida';
}

export function Backup() {
  // ─── Estado dos arquivos reais no servidor ────────────────────────────────
  const [serverFiles, setServerFiles] = useState<string[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // ─── Estado do agendamento ────────────────────────────────────────────────
  const [schedule, setSchedule] = useState<BackupScheduleState>(loadSchedule);

  // ─── Form de agendamento ──────────────────────────────────────────────────
  const [frequency, setFrequency]   = useState<BackupFrequency>('DAILY');
  const [startDate, setStartDate]   = useState('');
  const [startTime, setStartTime]   = useState('03:00');

  // ─── Loading states ───────────────────────────────────────────────────────
  const [isBackingUp, setIsBackingUp]     = useState(false);
  const [isScheduling, setIsScheduling]   = useState(false);
  const [isCancelling, setIsCancelling]   = useState(false);
  // ─── Paginação da Tabela ──────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Lógica matemática para fatiar o array
  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = serverFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(serverFiles.length / itemsPerPage);


  
  useEffect(() => { saveSchedule(schedule); }, [schedule]);

  // ─── Busca os arquivos reais da API ───────────────────────────────────────
  const fetchServerBackups = async () => {
    setIsLoadingFiles(true);
    try {
      const files = await api.backups.list();
      setServerFiles(files);
    } catch (err) {
      console.error("Erro ao buscar listagem de backups", err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchServerBackups();

    const syncScheduleStatus = async () => {
      try {
        const res = await api.backups.scheduleStatus();
        setSchedule({
          active: res.active,
          frequency: res.frequency ?? null,
          nextExecution: res.nextExecution ?? null,
        });
      } catch {
        // Ignora erro silenciosamente
      }
    };
    syncScheduleStatus();
  }, []);

  // ─── Backup manual ────────────────────────────────────────────────────────
  const handleManualBackup = async () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    try {
      const res = await api.backups.trigger();
      alert(`✅ ${res?.message || 'Backup concluído com sucesso!'}`);
      // Atualiza a tabela imediatamente após o sucesso!
      await fetchServerBackups();
    } catch (err: any) {
      alert(`❌ Erro ao executar backup: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setIsBackingUp(false);
    }
  };

  // ─── Agendar backup ───────────────────────────────────────────────────────
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !startTime) { alert('Informe a data e hora de início.'); return; }

    const startDateTime = `${startDate}T${startTime}:00`;

    setIsScheduling(true);
    try {
      const res = await api.backups.schedule({ startDateTime, frequency });
      const newSchedule: BackupScheduleState = {
        active: res.active,
        frequency: res.frequency,
        nextExecution: res.nextExecution,
      };
      setSchedule(newSchedule);
      alert(`✅ ${res.message}`);
    } catch (err: any) {
      alert(`❌ Erro ao agendar backup: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setIsScheduling(false);
    }
  };

  // ─── Cancelar agendamento ─────────────────────────────────────────────────
  const handleCancelSchedule = async () => {
    if (!window.confirm('Deseja cancelar o agendamento de backup ativo?')) return;
    setIsCancelling(true);
    try {
      const res = await api.backups.cancelSchedule();
      setSchedule({ active: false, frequency: null, nextExecution: null });
      alert(`✅ ${res.message}`);
    } catch (err: any) {
      alert(`❌ Erro ao cancelar agendamento: ${err?.message || 'Erro desconhecido'}`);
    } finally {
      setIsCancelling(false);
    }
  };

  // ─── Restaurar backup ─────────────────────────────────────────────────────
  const handleRestore = async (fileName: string) => {
    const ok = window.confirm(
      `⚠️ ATENÇÃO: Isso substituirá todo o banco de dados atual pelo backup:\n\n${fileName}\n\nDeseja continuar?`
    );
    if (!ok) return;
    try {
      const res = await api.backups.restore(fileName);
      alert(`✅ ${res?.message || 'Restauração concluída com sucesso!'}`);
    } catch (err: any) {
      alert(`❌ Erro na restauração: ${err?.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestão de Backups</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Execute backups manuais, agende replicações automáticas e restaure o banco quando necessário.
          </p>
        </div>

        <button onClick={handleManualBackup} disabled={isBackingUp}
          className="self-start flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
          {isBackingUp
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Executando...</>
            : <><Play className="w-4 h-4 text-indigo-400" /> Executar Backup Agora</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Esquerdo: Agendamento ── */}
        <div className="lg:col-span-5 space-y-4">

          {/* Card: status do agendamento ativo */}
          {schedule.active ? (
            <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Agendamento Ativo</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <div className="space-y-1 text-[11px] text-indigo-700 dark:text-indigo-300">
                <p><strong>Frequência:</strong> {schedule.frequency ? FREQUENCY_LABELS[schedule.frequency] : '—'}</p>
                <p><strong>Próxima execução:</strong> {formatDateTime(schedule.nextExecution)}</p>
              </div>
              <button onClick={handleCancelSchedule} disabled={isCancelling}
                className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40 transition-all cursor-pointer">
                {isCancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Cancelar Agendamento
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-500">
              <CalendarClock className="w-4 h-4 shrink-0" />
              Nenhum agendamento ativo no momento.
            </div>
          )}

          {/* Card: form de agendamento */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase">Agendamento</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Novo Agendamento</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Configure o intervalo de replicação automática do banco.</p>
            </div>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Frequência</label>
                <select value={frequency} onChange={e => setFrequency(e.target.value as BackupFrequency)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="ONCE">Uma única vez</option>
                  <option value="DAILY">Diário (Recomendado)</option>
                  <option value="WEEKLY">Semanal</option>
                  <option value="MONTHLY">Mensal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Data de Início</label>
                  <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Hora</label>
                  <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-zinc-800/40 rounded-xl text-[10px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                O backend executa <code>pg_dump</code> via Docker no horário configurado e salva o arquivo <code>.sql</code> localmente em <code>./backups</code>.
              </div>

              <button type="submit" disabled={isScheduling}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-indigo-400" />}
                {isScheduling ? 'Agendando...' : 'Agendar Backup'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Direito: Arquivos do Servidor ── */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Arquivos no Servidor</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Arquivos `.sql` disponíveis para restauração física.</p>
            </div>
            <button onClick={fetchServerBackups} disabled={isLoadingFiles} className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg text-slate-500 transition-colors">
              <RefreshCcw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/90 dark:bg-zinc-800/90 backdrop-blur-sm z-10">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                  {/* Voltando ao padding original */}
                  <th className="py-3 px-4">Nome do Arquivo</th>
                  <th className="py-3 px-4">Data de Criação</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {isLoadingFiles ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-zinc-500 text-xs">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 opacity-50" />
                      Sincronizando com o servidor...
                    </td>
                  </tr>
                ) : serverFiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-zinc-500 text-xs italic">
                      Nenhum arquivo de backup encontrado no diretório <code>./backups</code>.
                    </td>
                  </tr>
                ) : currentFiles.map((fileName) => {
                  // Remove o "_" seguido dos números do timestamp e a extensão .sql apenas para exibição
                  const displayName = fileName.replace(/_\d{8}_\d{6}\.sql$/, '');

                  return (
                    <tr key={fileName} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors group">
                      {/* Voltando ao padding original py-3 e tamanho de fonte normal */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="w-4 h-4 text-indigo-400 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <span className="font-mono text-sm font-bold text-slate-600 dark:text-zinc-300 block" title={fileName}>
                            {displayName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap font-medium">
                        {parseDateFromFileName(fileName)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                          <CheckCircle2 className="w-3 h-3" /> Disponível
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {/* Mantém o fileName original aqui para a restauração funcionar perfeitamente */}
                        <button onClick={() => handleRestore(fileName)}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/30 dark:hover:text-amber-400 font-semibold cursor-pointer transition-colors">
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* ── CONTROLES DE PAGINAÇÃO ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              >
                Anterior
              </button>
              
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
              >
                Próxima
              </button>
            </div>
          )}

          {totalPages <= 1 && (
            <div className="p-3 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
              <Info className="w-3 h-3 shrink-0" />
              Exibindo os arquivos reais localizados no servidor.
            </div>
          )}
          
          <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 text-xs text-slate-400 dark:text-zinc-500">
            <Info className="w-3.5 h-3.5 shrink-0" />
            Exibindo os arquivos reais localizados no servidor.
          </div>
        </div>
      </div>

      {/* ── Cards de status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Arquivos no Servidor</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">{serverFiles.length}</span>
            <p className="text-[11px] text-slate-400">Backups físicos disponíveis</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${schedule.active ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500'}`}>
            <CalendarClock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Agendamento</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {schedule.active ? FREQUENCY_LABELS[schedule.frequency!] : 'Inativo'}
            </span>
            <p className="text-[11px] text-slate-400">
              {schedule.active ? `Próximo: ${formatDateTime(schedule.nextExecution)}` : 'Nenhum agendamento ativo'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Último Backup</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {serverFiles.length > 0 ? 'OK' : '—'}
            </span>
            <p className="text-[11px] text-slate-400">
              {serverFiles.length > 0 ? parseDateFromFileName(serverFiles[0]) : 'Sem registros'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}