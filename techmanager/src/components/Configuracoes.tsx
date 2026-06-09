import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Key, Palette, Save, Bell, Check, Camera, ShieldAlert } from 'lucide-react';
import { api, getUserRole } from '../services/api';

interface ConfiguracoesProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export function Configuracoes({ profile, onUpdateProfile }: ConfiguracoesProps) {

  const userRole = getUserRole();
  const isAdmin    = userRole === 'ADMIN';
  const isCustomer = userRole === 'CUSTOMER';
  const isTechnical = userRole === 'TECHNICAL';

  // Basic info states
  const [name, setName]   = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState(profile.avatar);

  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving]               = useState(false);

  // Preferences
  const [theme, setTheme]             = useState<'light' | 'dark' | 'high_contrast'>(profile.theme);
  const [emailCalls, setEmailCalls]   = useState(profile.notifications.emailCalls);
  const [smsAlerts, setSmsAlerts]     = useState(profile.notifications.smsAlerts);
  const [criticalOnly, setCriticalOnly] = useState(profile.notifications.criticalOnly);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de senha no frontend
    if (newPassword) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{10,}$/;
if (!passwordRegex.test(newPassword)) {
  alert('A senha deve ter no mínimo 10 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo.');
  return;
}
      if (newPassword !== confirmPassword) {
        alert('As senhas não coincidem. Verifique e tente novamente.');
        return;
      }
    }

    // Salva preferências locais (tema, notificações) independente do role
    onUpdateProfile({
      name: isAdmin ? profile.name : name,
      email: profile.email,
      phone: isAdmin ? profile.phone : phone,
      avatar: isAdmin ? profile.avatar : avatar,
      theme,
      notifications: { emailCalls, smsAlerts, criticalOnly },
    });

    // Admins não têm endpoint de update de perfil
    if (isAdmin) {
      alert('Preferências visuais salvas com sucesso!');
      return;
    }

    // Customer ou Technical — chama o backend
    if (!newPassword) {
      alert('Informe uma nova senha para salvar as alterações de perfil.');
      return;
    }

    setIsSaving(true);
    try {
      if (isCustomer) {
        await api.customer.update({ name, phone, password: newPassword });
      } else if (isTechnical) {
        console.log('PAYLOAD:', { name, phone, password: newPassword });

        await api.technical.update({ name, phone, password: newPassword, email: profile.email });

      }

      setNewPassword('');
      setConfirmPassword('');
      alert('Perfil atualizado com sucesso!');
    } catch (err: any) {
      // Backend lança erro específico para senha recentemente usada
      const msg = err?.message || err?.error || '';
      if (
        err?.status === 409 ||
        msg.toLowerCase().includes('recently') ||
        msg.toLowerCase().includes('recente') ||
        msg.toLowerCase().includes('history') ||
        msg.toLowerCase().includes('histórico')
      ) {
        alert('⚠️ Você não pode reutilizar uma das suas 3 últimas senhas. Por favor, escolha uma senha diferente.');
      } else {
        alert(`Erro ao atualizar perfil: ${msg || 'Tente novamente.'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTriggerMockAvatarUpload = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = letters[Math.floor(Math.random() * letters.length)];
    setAvatar(randomChar);
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Preferências e Configurações</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Gerencie seu perfil, altere sua senha de acesso e customize a aparência do painel.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Esquerda ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Informações Básicas — oculto para admin */}
          {!isAdmin && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                <User className="w-4 h-4 text-indigo-500" /> Informações Básicas
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                <div className="relative group cursor-pointer" onClick={handleTriggerMockAvatarUpload}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-3xl shadow-inner uppercase">
                    {avatar || name.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Foto do Perfil</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                    Iniciais geradas com base no seu nome. Clique para alterar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Nome Completo</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">E-mail</label>
                  <input type="email" value={profile.email} disabled
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-400 dark:text-zinc-500 cursor-not-allowed" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Telefone</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {/* Aviso para admin */}
          {isAdmin && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Conta Administrativa</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Contas de administrador não possuem edição de perfil neste painel. Para alterar dados da conta admin, utilize o painel de gerenciamento do servidor ou contate o responsável pelo sistema.
                </p>
              </div>
            </div>
          )}

          {/* Segurança — oculto para admin */}
          {!isAdmin && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <Key className="w-4 h-4 text-indigo-500" /> Alterar Senha
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Não é permitido reutilizar as 3 últimas senhas utilizadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Nova Senha</label>
                  <input type="password" placeholder="Mínimo 6 caracteres"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Confirmar Nova Senha</label>
                  <input type="password" placeholder="Repita a nova senha"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Direita: Preferências ── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Preferências Visuais</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Controle o estilo de exibição e alertas.</p>
            </div>

            {/* Tema */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-500" /> Tema da Interface
              </label>
              <div className="space-y-1.5">
                {([
                  { value: 'light',         label: '☀️ Tema Claro' },
                  { value: 'dark',          label: '🌚 Tema Escuro' },
                  { value: 'high_contrast', label: '👁️ Alto Contraste' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button" onClick={() => setTheme(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                      theme === opt.value
                        ? opt.value === 'high_contrast'
                          ? 'bg-black text-yellow-400 border-yellow-500'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900'
                        : 'bg-slate-50 border-slate-200 dark:bg-zinc-800/50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                    }`}>
                    {opt.label}
                    {theme === opt.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notificações */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-500" /> Alertas
              </label>
              <div className="space-y-3">
                {[
                  { label: 'Alertas por E-mail', desc: 'Receber notificações de chamados atribuídos.', value: emailCalls, onChange: setEmailCalls },
                  { label: 'SMS Plantonista',    desc: 'Acionar robô para chamados críticos.',         value: smsAlerts,  onChange: setSmsAlerts  },
                  { label: 'Somente Críticos',   desc: 'Ignorar chamados de baixa/média prioridade.',  value: criticalOnly, onChange: setCriticalOnly },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-3">
                    <div className="text-xs">
                      <strong className="block text-slate-800 dark:text-zinc-200">{item.label}</strong>
                      <span className="block text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                    </div>
                    <input type="checkbox" checked={item.value} onChange={e => item.onChange(e.target.checked)}
                      className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão salvar */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button type="submit" disabled={isSaving}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10">
                <Save className="w-4 h-4" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}