import React, { useState } from 'react';
import { Monitor, ShieldCheck, Mail, Key, User, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface RegisterProps {
  onRegisterSuccess: (name: string, email: string) => void;
  onNavigateToLogin: () => void;
}

export function Register({ onRegisterSuccess, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }
    if (password.length < 10) {
      setError('A senha deve ter pelo menos 10 caracteres (exigência do sistema).');
      return;
    }
    if (!email.includes('@')) {
      setError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.register({
        name,
        email,
        phone: 'N/A', // O frontend atual não coleta telefone
        password,
        passwordConfirmed: confirmPassword
      });
      onRegisterSuccess(name, email);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="register-container" className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Left side: Branding (Symmetric to Login) */}
      <div id="register-branding-panel" className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-zinc-950 p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10" id="register-logo-holder">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-sans font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              TechManager
            </span>
            <span className="block text-[10px] font-mono tracking-widest text-indigo-400">PRO SUITE</span>
          </div>
        </div>

        <div className="my-auto py-12 relative z-10" id="register-slogan-section">
          <h1 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight leading-tight text-white mb-6">
            Crie sua conta corporativa em segundos.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
            Integre toda a sua operação de suporte, agende backups inteligentes e gerencie equipes de campo em uma plataforma robusta de alta visibilidade.
          </p>

          <div className="space-y-4" id="register-features-list">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Dashboard consolidado com tempos de SLA reais e alertas de estouro.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Configuração rápida de políticas de redundância e backups periódicos.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Atribuição facilitada com base na geolocalização e expertise técnica.</p>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-xs flex justify-between items-center relative z-10" id="register-branding-footer">
          <span>&copy; {new Date().getFullYear()} TechManager Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sistema Seguro SSL
          </span>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div id="register-form-panel" className="lg:col-span-7 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6" id="register-form-card">
          
          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-1 text-slate-500 dark:text-zinc-400 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-wider font-semibold cursor-pointer mb-2"
            id="register-btn-back-to-login"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Login
          </button>

          <div>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Crie sua conta
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Preencha o formulário abaixo para registrar seus dados corporativos no TechManager.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-sm" id="register-error-msg">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} id="register-form">
            
            <div className="space-y-1.5" id="register-field-name">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Nome Completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="register-field-email">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                E-mail Profissional
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="register-field-password">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="register-field-confirm-password">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Confirmar Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1" id="register-terms">
              <input
                type="checkbox"
                required
                id="agree-terms"
                className="rounded border-slate-300 dark:border-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="agree-terms" className="text-xs text-slate-500 dark:text-zinc-400">
                Estou de acordo com os <span className="text-indigo-600 dark:text-indigo-400 underline cursor-pointer">Termos de Uso</span> e <span className="text-indigo-600 dark:text-indigo-400 underline cursor-pointer">Políticas de Segurança</span>.
              </label>
            </div>

            <button
              type="submit"
              id="btn-register-submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Crie sua Conta'
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-zinc-400 pt-2" id="register-footer-login-link">
            Já tem um cadastro?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Acesse sua conta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
