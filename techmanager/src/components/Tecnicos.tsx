import React, { useState } from 'react';
import { Technician, Category } from '../types';
import { Plus, Search, Mail, Phone, ShieldCheck, Check, X, Award, Briefcase, Trash2 } from 'lucide-react';

interface TecnicosProps {
  technicians: Technician[];
  onAddTechnician: (technician: Omit<Technician, 'id' | 'ticketsCount'>) => void;
  onRemoveTechnician: (id: string) => void;
}

export function Tecnicos({ technicians, onAddTechnician, onRemoveTechnician }: TecnicosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New Technician Web Form state (Screen 3)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState<Category>('Redes');
  const [password, setPassword] = useState('');

  const specialties: Category[] = ['Redes', 'Hardware', 'Software', 'Infraestrutura'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Passamos a senha como parte de um objeto estendido para o handler no App.tsx
    (onAddTechnician as any)({
      name,
      email,
      phone: phone || '(11) 99999-9999',
      specialty,
      status: 'Ativo',
      password
    });

    // Reset Form (Screen 3 Save Action)
    setName('');
    setEmail('');
    setPhone('');
    setSpecialty('Redes');
    setPassword('');
    setIsFormOpen(false);
  };

  const getStatusBadge = (status: 'Ativo' | 'Ocupado' | 'Inativo') => {
    switch (status) {
      case 'Ativo':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';
      case 'Ocupado':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50';
      default:
        return 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700';
    }
  };

  const filteredTechnicians = technicians.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="tech-view-wrapper">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="tech-header-block">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gerenciamento de Técnicos</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Cadastre novos profissionais especialista por área e gerencie a fila de atendimento operacional.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          id="btn-add-tech-toggle"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 self-start cursor-pointer transition-all shadow-md shadow-indigo-600/10"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isFormOpen ? 'Fechar Formulário' : 'Novo Técnico'}
        </button>
      </div>

      {/* Grid: Form context on Left / List table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tech-body-grid">
        
        {/* Form container matching Screen 3 Form exactly */}
        {isFormOpen && (
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5 h-fit" id="card-add-tech">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-indigo-500 font-bold uppercase">Formulário de Entrada</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Novo Técnico</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Cadastre o especialista corporativo abaixo definindo a área de atuação técnica principal.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" id="add-tech-form">
              
              <div className="space-y-1.5" id="form-field-tech-name">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5" id="form-field-tech-email">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  E-mail Profissional *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: carlos.eduardo@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5" id="form-field-tech-phone">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Telefone de Contato
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 91234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5" id="form-field-tech-specialty">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Especialidade Principal *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value as Category)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec} className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-white">
                      Especialista em {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5" id="form-field-tech-password">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Senha Provisória *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Insira a senha temporária do profissional"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2" id="form-actions">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-medium rounded-xl text-sm transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Gravar Dados
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Master Technicians Table */}
        <div className={`${isFormOpen ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden`} id="card-techs-list">
          
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4" id="tech-toolbar">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por técnico ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500">
              Mostrando <strong className="text-slate-600 dark:text-zinc-300">{filteredTechnicians.length}</strong> de <strong className="text-slate-600 dark:text-zinc-300">{technicians.length}</strong> especialistas
            </div>
          </div>

          <div className="overflow-x-auto" id="tech-table-wrapper">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                  <th className="py-3 px-6">Técnico / Profissional</th>
                  <th className="py-3 px-6">Contato Corporativo</th>
                  <th className="py-3 px-6">Especialidade</th>
                  <th className="py-3 px-6">Atendimentos</th>
                  <th className="py-3 px-6 col-span-2">Disponibilidade Status</th>
                  <th className="py-3 px-4 text-right">Remover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filteredTechnicians.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors" id={`tech-row-${t.id}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-slate-200/50 dark:border-zinc-700">
                          {t.name.split(' ')[0][0]}{t.name.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-800 dark:text-white leading-tight">{t.name}</span>
                          <span className="block font-mono text-[10px] text-slate-400 dark:text-zinc-500">{t.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-zinc-400 space-y-0.5">
                      <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {t.email}</p>
                      <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {t.phone}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-indigo-5 border border-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-450">
                        <Award className="w-3.5 h-3.5 text-indigo-550" />
                        {t.specialty}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {t.ticketsCount} chamados activos
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusBadge(t.status)}`}>
                        <Check className="w-3.5 h-3.5" />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
  {/* Prevent removing seeded main technical users - Blindado com ?. */}
  {t.id?.startsWith('TEC-0') && technicians.length > 3 ? (
    <button
      onClick={() => onRemoveTechnician(t.id)}
      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
      title="Remover Técnico"
      id={`btn-delete-${t.id}`}
    >
      <Trash2 className="w-4.5 h-4.5" />
    </button>
  ) : (
    <span className="text-xs text-slate-400 dark:text-zinc-650 italic">Protegido</span>
  )}
</td>
                  </tr>
                ))}
                {filteredTechnicians.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                      Nenhum técnico encontrado com o termo informado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
