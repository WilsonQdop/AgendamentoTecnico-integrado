import React, { useState } from 'react';
import { BackupHistory, BackupConfig, BackupFrequency } from '../types';
import { Play, Calendar, CheckCircle2, AlertOctagon, HelpCircle, HardDrive, ShieldCheck, Download, Trash, RefreshCcw, Save, ServerCrash } from 'lucide-react';
import { api } from '../services/api';

interface BackupProps {
  backupHistory: BackupHistory[];
  backupConfig: BackupConfig;
  onUpdateConfig: (config: BackupConfig) => void;
  onTriggerBackup: (type: 'Incremental' | 'Geral') => void;
}

export function Backup({ backupHistory, backupConfig, onUpdateConfig, onTriggerBackup }: BackupProps) {
  
  // Schedule state matching Screen 10 options
  const [frequency, setFrequency] = useState<BackupFrequency>(backupConfig.frequency);
  const [startDate, setStartDate] = useState(backupConfig.startDate);
  const [startHour, setStartHour] = useState(backupConfig.startHour);
  const [cloudSync, setCloudSync] = useState(backupConfig.cloudSync);
  const [integrityCheck, setIntegrityCheck] = useState(backupConfig.integrityCheck);

  // Trigger loading state for manual backup
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupType, setBackupType] = useState<'Incremental' | 'Geral'>('Incremental');

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      frequency,
      startDate,
      startHour,
      cloudSync,
      integrityCheck,
    });
    alert('Configuração de agendamento de backup salva com sucesso!');
  };

  const handleManualBackupTrigger = (type: 'Incremental' | 'Geral') => {
    setBackupType(type);
    setIsBackingUp(true);
    
    // Simulate real file backup packing up space
    setTimeout(() => {
      onTriggerBackup(type);
      setIsBackingUp(false);
      alert(`Backup ${type} concluído com sucesso e sincronizado em nuvem!`);
    }, 2000);
  };

  const handleRestoreBackup = async (id: string, date: string) => {
    const confirmRestore = window.confirm(`Deseja restaurar o banco de dados conforme o backup executado em ${date}? Isto substituirá o estado atual.`);
    if (confirmRestore) {
      try {
        const response = await api.backups.restore(id);
        alert(response.message || `Restauração concluída com sucesso para a data de ${date}!`);
      } catch (err: any) {
        alert(`Erro ao restaurar backup: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6" id="backup-view-wrapper">
      
      {/* Header and Trigger Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="backup-header-block">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestão Técnica de Backups</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Configure redundância offsite automatizada e gerencie logs de integridade do banco corporativo.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start" id="backup-manual-actions">
          {/* Circular manual buttons */}
          <button
            disabled={isBackingUp}
            onClick={() => handleManualBackupTrigger('Incremental')}
            className="bg-indigo-650 hover:bg-slate-800 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isBackingUp && backupType === 'Incremental' ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 text-indigo-400" />
            )}
            {isBackingUp && backupType === 'Incremental' ? 'Efetuando...' : 'Backup Incremental'}
          </button>
          
          <button
            disabled={isBackingUp}
            onClick={() => handleManualBackupTrigger('Geral')}
            className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isBackingUp && backupType === 'Geral' ? (
              <RefreshCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isBackingUp && backupType === 'Geral' ? 'Processando...' : 'Executar Full Geral'}
          </button>
        </div>
      </div>

      {/* Grid: Scheduler on Left / Historical logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="backup-master-grid">
        
        {/* Box 1: Backup Scheduler Form */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5 h-fit" id="card-backup-schedule">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase">Políticas Globais</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Agendamento Recorrente</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Configure o intervalo automatizado de replicação local dos servidores.</p>
          </div>

          <form onSubmit={handleUpdateConfig} className="space-y-4" id="backup-schedule-form">
            
            <div className="space-y-1.5" id="sch-freq">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Frequência do Loop</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as BackupFrequency)}
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Diário">Diário (Recomendado)</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensal">Mensal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3" id="sch-dateTime">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Data de Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Hora do Silêncio</label>
                <input
                  type="time"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Checkboxes controls */}
            <div className="space-y-2.5 pt-2" id="sch-checkboxes">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="bck-cloud"
                  checked={cloudSync}
                  onChange={(e) => setCloudSync(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="bck-cloud" className="text-xs text-slate-650 dark:text-zinc-350 select-none">
                  <strong>Sincronização redundante em Nuvem Ativa</strong>
                  <span className="block text-[10px] text-slate-400">Envia criptografado em AES-256 para repositório Amazon S3 externo.</span>
                </label>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="bck-integrity"
                  checked={integrityCheck}
                  onChange={(e) => setIntegrityCheck(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="bck-integrity" className="text-xs text-slate-650 dark:text-zinc-350 select-none">
                  <strong>Análise de consistência e metadados</strong>
                  <span className="block text-[10px] text-slate-400">Garante que o JSON / banco não possui tabelas de SLA inacabadas.</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              id="btn-save-schedule"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Save className="w-4 h-4 text-indigo-400" /> Salvar Política Técnica
            </button>

          </form>
        </div>

        {/* Box 2: Backup History Log list Table */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between" id="card-backup-history">
          
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800" id="backup-history-header">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Redundância Histórica de Arquivos</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Últimos pacotes gerados pelo robô do TechManager.</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                  <th className="py-3 px-6">Identificador</th>
                  <th className="py-3 px-6">Tipo / Escopo</th>
                  <th className="py-3 px-6">Tamanho</th>
                  <th className="py-3 px-6">Data de Replicação</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {backupHistory.map((bck) => (
                  <tr key={bck.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors" id={`row-bck-${bck.id}`}>
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">
                      {bck.id}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800 dark:text-white text-xs">
                      {bck.type === 'Geral' ? 'Completo geral' : 'Redundância incremental'}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-600 dark:text-zinc-300 font-mono font-bold">
                      {bck.size}
                    </td>
                    <td className="py-3.5 px-6 text-xs text-slate-500 dark:text-zinc-400">
                      {bck.date}
                    </td>
                    <td className="py-3.5 px-6">
                      {bck.status === 'Sucesso' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/55">
                          Sucesso
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-100 dark:border-red-900/55">
                          Erro SLA
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleRestoreBackup(bck.id, bck.date)}
                        className="px-2 py-1 text-[11px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 rounded hover:bg-indigo-50 hover:text-indigo-600 font-semibold cursor-pointer"
                        title="Restaurar Banco de dados para esta data"
                        id={`btn-restore-${bck.id}`}
                      >
                        Restaurar
                      </button>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('Iniciando transferência segura do arquivo do backup GZIP...'); }}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-indigo-600 rounded-lg"
                        title="Transferir arquivo comprimido"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick instructions alert */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5" id="backup-instructions">
            <HelpCircle className="w-4 h-4 shrink-0" />
            Clique em "Restaurar" para reinicializar o ambiente simulado com a versão do log desejada.
          </div>

        </div>

      </div>

      {/* Row 3: Metrics indicators summary row (Screen 10 bottom row matching) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="backup-indicators-grid">
        
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4" id="indicator-storage">
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-xl">
            <HardDrive className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Armazenamento Usado</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-800 dark:text-white leading-tight">84% de Capacidade</span>
            </div>
            <p className="text-[11px] text-slate-400">Consumo total: 4.8 TB ativos protegidos.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4" id="indicator-integrity">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Integridade do Backup</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-850 dark:text-white leading-tight">Ótima Configuração</span>
            </div>
            <p className="text-[11px] text-slate-400">0% de setores corrompidos nos pacotes.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4" id="indicator-cloud">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Estado da Nuvem S3</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-850 dark:text-white leading-tight">Nuvem Sincronizada</span>
            </div>
            <p className="text-[11px] text-slate-400">Alinhamento seguro estabelecido no bucket.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
