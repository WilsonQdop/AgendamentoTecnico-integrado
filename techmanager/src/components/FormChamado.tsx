import React, { useState, useEffect } from 'react';
import { Priority, Category } from '../types';
import { Paperclip, X, AlertTriangle, UploadCloud, User, DollarSign } from 'lucide-react';

interface FormChamadoProps {
  onOpenTicket: (ticket: {
    title: string;
    priority: Priority;
    category: Category;
    location: string;
    equipment: string;
    description: string;
    clientId: string;
    baseValue: number;
    finalValue: number;    // ← adicionar
    estimatedHours: number;
    files: string[];
  }) => void;
  onCancel: () => void;
}

// Pesos conforme backend
const PRIORITY_WEIGHTS: Record<Priority, number> = {
  LOW: 1.0,
  MEDIUM: 1.2,
  HIGH: 1.5,
};

const CATEGORY_WEIGHTS: Record<Category, number> = {
  HARDWARE: 1.0,
  SOFTWARE: 1.3,
  NETWORK: 1.5,
};

// Labels amigáveis em português para exibição ao usuário
const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: '🟢 Baixa',
  MEDIUM: '🔵 Média',
  HIGH: '🟡 Alta',
};

const CATEGORY_LABELS: Record<Category, string> = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  NETWORK: 'Redes',
};

const BASE_HOURLY_RATE = 100;

function calculateEstimatedValue(priority: Priority, category: Category, estimatedHours: number): number {
  const hours = Math.max(estimatedHours, 1);
  return BASE_HOURLY_RATE * hours * CATEGORY_WEIGHTS[category] * PRIORITY_WEIGHTS[priority];
}

export function FormChamado({ onOpenTicket, onCancel }: FormChamadoProps) {
  // Pega o nome do usuário logado direto do localStorage
  const loggedUserName = (() => {
    try {
      const profile = localStorage.getItem('tm_db_user_profile');
      if (profile) return JSON.parse(profile).name || 'Usuário';
    } catch {}
    return localStorage.getItem('userName') || 'Usuário';
  })();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [category, setCategory] = useState<Category>('NETWORK');
  const [location, setLocation] = useState('');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState<number>(1);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Valor calculado dinamicamente com base nos pesos
  const estimatedValue = calculateEstimatedValue(priority, category, estimatedHours);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles: string[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        newFiles.push(e.dataTransfer.files[i].name);
      }
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const triggerFileInput = () => {
    const fileNames = ['laudo_tecnico_diagnostico.pdf', 'estrutura-rack.png', 'foto-led-falha.jpg', 'log-erros-sistema.txt'];
    const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
    if (!attachments.includes(randomFile)) setAttachments([...attachments, randomFile]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }
    onOpenTicket({
      title,
      priority,       // Enum: 'LOW' | 'MEDIUM' | 'HIGH'
      category,       // Enum: 'HARDWARE' | 'SOFTWARE' | 'NETWORK'
      location: location || 'Não especificada',
      equipment: equipment || 'Não especificado',
      description,
      clientId: '',
      baseValue: BASE_HOURLY_RATE,         // taxa base para referência
  finalValue: estimatedValue,          // ✅ valor já calculado com os pesos
  estimatedHours,      // Taxa base por hora (R$ 100,00)
      files: attachments,
      // status será definido como 'OPEN' pelo handler pai ao criar o ticket
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm p-6 max-w-3xl mx-auto space-y-6" id="form-ticket-wrapper">

      {/* Form Header */}
      <div className="pb-5 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between" id="form-header">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase">Abertura de Chamado</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Abertura de Chamado Técnico</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Insira as informações técnicas detalhadas para acionar os especialistas técnicos.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" id="ticket-creation-form">

        {/* Row 1: Solicitante (Bloqueado) + Valor Estimado (Calculado) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Solicitante
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <div className="w-full pl-10 text-sm px-3.5 py-2.5 bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-500 dark:text-zinc-400 select-none cursor-not-allowed min-h-[40px] flex items-center">
                {loggedUserName}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Valor Estimado
              <span className="ml-1 text-[9px] text-indigo-400 normal-case font-normal">(baseado nos pesos)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <div className="w-full pl-9 text-sm px-3.5 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-400 select-none cursor-not-allowed font-mono font-bold min-h-[40px] flex items-center">
                R$ {estimatedValue.toFixed(2)}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
              Base R$100/h × {estimatedHours}h × categoria ({CATEGORY_WEIGHTS[category]}x) × prioridade ({PRIORITY_WEIGHTS[priority]}x)
            </p>
          </div>
        </div>

        {/* Row 2: Title & category */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Título Breve do Problema *</label>
            <input
              type="text"
              required
              placeholder="Ex: Falha de conexão no switch principal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Categoria Técnica *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Priority, hours, location, equipment */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Nível de Prioridade *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              {(Object.keys(PRIORITY_LABELS) as Priority[]).map((pri) => (
                <option key={pri} value={pri}>{PRIORITY_LABELS[pri]}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Horas Estimadas
            </label>
            <input
              type="number"
              min={1}
              max={999}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Localização / Setor</label>
            <input
              type="text"
              placeholder="Ex: Servidores / 3º Andar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Ativo / Equipamento</label>
            <input
              type="text"
              placeholder="Ex: Switch Cisco Catalyst 9300"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Descrição Detalhada do Problema *</label>
          <textarea
            required
            rows={4}
            placeholder="Forneça detalhes adicionais para o técnico, como mensagens de erro exibidas nos logs ou histórico dos sintomas ocorridos..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* File attachments */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Anexos Técnicos (Diagramas, Evidências, Logs)</label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`cursor-pointer group py-6 px-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-900/60 hover:bg-slate-50/60 dark:hover:bg-zinc-800/10'
            }`}
          >
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/45 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-zinc-300 text-center">
              Arraste e solte arquivos aqui, ou <strong className="text-indigo-600 dark:text-indigo-400">clique para anexar</strong>.
            </p>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">SUPORTA PDF, JPEG, PNG, GIF, ZIP (MÁX 15MB)</span>
          </div>

          {attachments.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg py-1 px-2.5 text-xs text-slate-800 dark:text-zinc-300 font-mono"
                >
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span className="max-w-[150px] truncate">{file}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveAttachment(idx); }}
                    className="p-0.5 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-red-500 rounded-md transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Critical warning for HIGH priority */}
        {priority === 'HIGH' && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/25 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs rounded-xl">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 animate-bounce" />
            <div>
              <strong className="font-semibold block">Atenção ao SLA Crítico configurado!</strong>
              Este chamado gerará disparo automático de SMS para técnicos plantonistas especializados.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-medium rounded-xl text-sm transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Abrir Chamado Técnico
          </button>
        </div>

      </form>
    </div>
  );
}
