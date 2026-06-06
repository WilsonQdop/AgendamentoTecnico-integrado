import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, ShieldAlert, Key, Palette, Save, Bell, Check, Landmark, Camera } from 'lucide-react';

interface ConfiguracoesProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export function Configuracoes({ profile, onUpdateProfile }: ConfiguracoesProps) {
  
  // Basic info states matching Screen 11
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState(profile.avatar);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences configuration
  const [theme, setTheme] = useState<'light' | 'dark' | 'high_contrast'>(profile.theme);
  const [emailCalls, setEmailCalls] = useState(profile.notifications.emailCalls);
  const [smsAlerts, setSmsAlerts] = useState(profile.notifications.smsAlerts);
  const [criticalOnly, setCriticalOnly] = useState(profile.notifications.criticalOnly);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password validation if filled
    if (newPassword) {
      if (!currentPassword) {
        alert('Por favor, informe a senha de acesso atual para autorizar as alterações de segurança.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('As senhas novas digitadas não coincidem.');
        return;
      }
      if (newPassword.length < 6) {
        alert('A nova senha deve possuir um mínimo de 6 algarismos.');
        return;
      }
    }

    onUpdateProfile({
      name,
      email,
      phone,
      avatar,
      theme,
      notifications: {
        emailCalls,
        smsAlerts,
        criticalOnly,
      }
    });

    // Reset password inputs
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    alert('Informações de preferências e perfil atualizadas com sucesso!');
  };

  const handleTriggerMockAvatarUpload = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomChar = letters[Math.floor(Math.random() * letters.length)];
    setAvatar(randomChar);
    alert('Avatar corporativo atualizado automaticamente com as novas iniciais!');
  };

  return (
    <div className="space-y-6" id="configs-view-wrapper">
      
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Preferências e Configurações</h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Gerencie seu perfil, altere sua senha de acesso e customize a aparência visual do seu painel administrativo.
        </p>
      </div>

      <form onSubmit={handleSaveAll} className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="configs-master-form">
        
        {/* Left Side: Basic Info & Security */}
        <div className="lg:col-span-8 space-y-6" id="configs-left-zone">
          
          {/* Section 1: Informações Básicas */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5" id="card-basic-info">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <User className="w-4.5 h-4.5 text-indigo-500" /> Informações Básicas
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2" id="avatar-uploader-row">
              <div className="relative group cursor-pointer" onClick={handleTriggerMockAvatarUpload} id="avatar-uploader-circle">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold font-sans text-3xl shadow-inner uppercase">
                  {avatar || name.charAt(0)}
                </div>
                <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Foto do Perfil Administrativo</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
                  Iniciais de contato configurados com base no seu nome corporativo. Toque sobre a imagem para alterar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="basic-fields-grid">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">E-mail de Trabalho</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/55 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">Telefone Celular CORPORATIVO</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Segurança (Alterar Senha) */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-5" id="card-security-block">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <Key className="w-4.5 h-4.5 text-indigo-500" /> Segurança de Acesso
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="security-fields-grid">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">Senha de Acesso Atual</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">Nova Senha Corporativa</label>
                <input
                  type="password"
                  placeholder="Mínimo de 6 algarismos"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-550 dark:text-zinc-400">Confirmar Nova Senha</label>
                <input
                  type="password"
                  placeholder="Mínimo de 6 algarismos"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Theme Preferences selection (Screen 11 Preferências sidebar) */}
        <div className="lg:col-span-4 space-y-6" id="configs-right-zone">
          
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6" id="card-preferences">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Opções e Preferências</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Controle o estilo de exibição e limites de notificação.</p>
            </div>

            {/* Theme switcher */}
            <div className="space-y-2.5" id="pref-theme">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-500" /> Tema da Interface
              </label>
              
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                    theme === 'light'
                      ? 'bg-indigo-650 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900'
                      : 'bg-slate-50 border-slate-200 dark:bg-zinc-800/50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  ☀️ Tema Claro Clássico
                  {theme === 'light' && <Check className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                    theme === 'dark'
                      ? 'bg-indigo-650 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900'
                      : 'bg-slate-50 border-slate-200 dark:bg-zinc-800/50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  🌚 Tema Escuro Inteligente
                  {theme === 'dark' && <Check className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('high_contrast')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all ${
                    theme === 'high_contrast'
                      ? 'bg-black text-yellow-400 border-yellow-500 dark:bg-black dark:text-yellow-400'
                      : 'bg-slate-50 border-slate-200 dark:bg-zinc-800/50 dark:border-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  👁️ Alto Contraste Acessibilidade
                  {theme === 'high_contrast' && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Notification triggers Switches (Screen 11 side item) */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-zinc-800" id="pref-notifications">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-500" /> Configuração de Alertas
              </label>

              <div className="space-y-3" id="notifications-selectors">
                
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs">
                    <strong className="block text-slate-705 dark:text-zinc-200">Alertas por E-mail</strong>
                    <span className="block text-[10px] text-slate-400 leading-tight">Receber desboches de novos chamados atribuídos.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailCalls}
                    onChange={(e) => setEmailCalls(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-550"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs">
                    <strong className="block text-slate-705 dark:text-zinc-200">Disparo SMS Plantonista</strong>
                    <span className="block text-[10px] text-slate-400 leading-tight">Acionar robô de telefonia para chamado crítico automático.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-550"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs">
                    <strong className="block text-slate-750 dark:text-zinc-200">Somente Criticidade Crítica</strong>
                    <span className="block text-[10px] text-slate-400 leading-tight">Ignorar chamados categorizados como Baixa / Média.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalOnly}
                    onChange={(e) => setCriticalOnly(e.target.checked)}
                    className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-550"
                  />
                </div>

              </div>
            </div>

            {/* Submission card footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800" id="pref-save-block">
              <button
                type="submit"
                id="btn-configs-save"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Save className="w-4_5 h-4_5" /> Salvar Alterações
              </button>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
