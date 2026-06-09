import React, { useState } from 'react';
import { ShieldCheck, Monitor, HelpCircle, Key, Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToRegister: () => void;
}

import { api } from '../services/api';

export function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
  const data = await api.auth.login({ email, password });
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('userName', data.name);
  setIsLoading(false); 
  onLoginSuccess(email);
} catch (err: any) {
  console.error('Erro detalhado:', err);

  if (err.status === 423) {
    const fullMsg = JSON.stringify(err);
    const match = fullMsg.match(/(\d+)/);
    const minutes = match ? match[1] : '?';
    setError(`🔒 Conta bloqueada por excesso de tentativas. Tente novamente em ${minutes} minuto(s).`);
  } else if (err.status === 401) {
    const attemptsMsg = err.message?.includes('tentativa') ? ` ${err.message}` : '';
    setError(`❌ Senha incorreta. Verifique suas credenciais.${attemptsMsg}`);
  } else if (err.status === 404) {
    setError('❌ E-mail não encontrado. Verifique o endereço digitado.');
  } else {
    setError(err.message || 'Erro ao realizar login. Tente novamente.');
  }
} finally {
  setIsLoading(false); 
}
  };

  return (
    <div id="login-container" className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200">
      
      {/* Left side: Branding Information */}
      <div id="login-branding-panel" className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-zinc-950 p-8 md:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden border-r border-slate-800">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10" id="login-logo-holder">
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

        <div className="my-auto py-12 relative z-10" id="login-slogan-section">
          <h1 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight leading-tight text-white mb-6">
            Gestão Técnica Precisa e Escalável.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
            Otimize chamados, gerencie técnicos com SLA integrado e acompanhe seus indicadores em tempo real. Uma solução robusta para operações corporativas modernas.
          </p>

          <div className="space-y-4" id="login-features-list">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Distribuição inteligente de chamados por especialidade e carga.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Controle de valores financeiros estimados e faturados.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-slate-200 text-sm">Monitoramento e agendamento contínuo de backups de dados.</p>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-xs flex justify-between items-center relative z-10" id="login-branding-footer">
          <span>&copy; {new Date().getFullYear()} TechManager Inc.</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Sistema Seguro SSL
          </span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div id="login-form-panel" className="lg:col-span-7 flex flex-col justify-center items-center p-8 md:p-12 lg:p-20">
        <div className="w-full max-w-md space-y-8" id="login-form-card">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Acesse sua conta
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">
              Preencha suas credenciais corporativas para iniciar o painel técnico.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-sm" id="login-error-msg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} id="login-form">
            
            <div className="space-y-1.5" id="field-email">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                E-mail Profissional
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="field-password">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Senha de Acesso
                </label>
                <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Key className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 group cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar no Sistema
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 dark:text-zinc-400" id="login-footer-register-link">
            Não possui uma conta?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
            >
              Crie uma conta corporativa
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 text-center text-xs text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1.5" id="login-demo-helper">
            <HelpCircle className="w-4 h-4" />
            Dúvidas? Entre em contato com o suporte técnico.
          </div>

        </div>
      </div>
    </div>
  );
}