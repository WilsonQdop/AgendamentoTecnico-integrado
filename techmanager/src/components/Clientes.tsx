import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Search, Mail, Phone, Check, X, Building, Trash2 } from 'lucide-react';

interface ClientesProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onRemoveClient: (id: string) => void;
}

export function Clientes({ clients, onAddClient, onRemoveClient }: ClientesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // New Client Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    onAddClient({
      name,
      company,
      email,
      phone: phone || 'N/A',
      active: true,
    });
    // Reset Form
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setIsFormOpen(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6" id="clients-view-wrapper">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" id="clients-header-block">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gerenciamento de Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Adicione e monitore o cadastro corporativo das empresas atendidas pelo suporte técnico.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          id="btn-add-client-toggle"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl flex items-center gap-2 self-start cursor-pointer transition-all shadow-md shadow-indigo-600/10"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isFormOpen ? 'Fechar Formulário' : 'Novo Cliente'}
        </button>
      </div>

      {/* Grid containing Quick Form on left (if toggled) and Client List on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="clients-body-grid">
        
        {/* Form panel */}
        {isFormOpen && (
          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5 h-fit" id="card-add-client">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Cadastrar Novo Cliente</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Insira as informações básicas para faturamento de chamados.</p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4" id="add-client-form">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Nome do Solicitante *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Alencar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Empresa / Razão Social *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Logística Alfa S.A."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: contato@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Telefone / Ramal</label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                id="btn-client-submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Salvar Cadastro
              </button>
            </form>
          </div>
        )}

        {/* List panel */}
        <div className={`${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden`} id="card-clients-list">
          
          {/* List Toolbar */}
          <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4" id="clients-toolbar">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por cliente, empresa ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500">
              Mostrando <strong className="text-slate-600 dark:text-zinc-300">{filteredClients.length}</strong> de <strong className="text-slate-600 dark:text-zinc-300">{clients.length}</strong> registros
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" id="clients-table-wrapper">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-zinc-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                  <th className="py-3 px-6">ID / Solicitante</th>
                  <th className="py-3 px-6">Empresa / Razão Social</th>
                  <th className="py-3 px-6">Contato</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors" id={`client-row-${c.id}`}>
                    <td className="py-4 px-6">
                      <span className="block font-mono text-xs font-bold text-slate-400 dark:text-zinc-500">{c.id}</span>
                      <span className="font-bold text-slate-800 dark:text-white">{c.name}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600 dark:text-zinc-300">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-slate-400" />
                        {c.company}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-zinc-400 space-y-0.5">
                      <p className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {c.email}</p>
                      <p className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {c.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        <Check className="w-3.5 h-3.5" /> Ativo
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {/* Prevents deleting seeded system-related clients */}
                      {c.id.startsWith('CLI-1') && clients.length > 3 ? (
                        <button
                          onClick={() => onRemoveClient(c.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Remover Cliente"
                          id={`btn-delete-${c.id}`}
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-zinc-600 italic">Protegido</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                      Nenhum cliente cadastrado atende ao termo de pesquisa informado.
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
