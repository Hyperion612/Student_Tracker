import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signUp } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { Sparkles, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Если Supabase не настроен, показываем предупреждение
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[128px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neutral-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display">Student Tracker</h1>
              <p className="text-xs text-neutral-500">Pro Edition</p>
            </div>
          </div>

          {/* Warning Card */}
          <div className="bg-neutral-900/80 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Supabase не настроен</h2>
                <p className="text-sm text-neutral-400 mb-4">
                  Для работы с облачной синхронизацией необходимо настроить Supabase.
                </p>
              </div>
            </div>

            <div className="bg-neutral-800/50 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-white mb-2">Как настроить:</h3>
              <ol className="text-xs text-neutral-400 space-y-2 list-decimal list-inside">
                <li>Создайте файл <code className="text-lime-400">.env</code> в корне проекта</li>
                <li>Добавьте переменные:
                  <div className="mt-1 bg-neutral-900 rounded p-2 font-mono text-[10px] text-neutral-300">
                    VITE_SUPABASE_URL=https://...<br/>
                    VITE_SUPABASE_ANON_KEY=eyJ...
                  </div>
                </li>
                <li>Перезапустите dev-сервер</li>
              </ol>
            </div>

            <p className="text-xs text-neutral-500 text-center">
              Подробная инструкция в файле <code className="text-lime-400">README.md</code>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-neutral-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-display">Student Tracker</h1>
            <p className="text-xs text-neutral-500">Pro Edition</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-neutral-800/50 rounded-xl p-1">
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm text-neutral-400 mb-1.5 block">Имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Как тебя зовут?"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-sm text-neutral-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-neutral-400 mb-1.5 block">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-lime-400 text-neutral-900 font-semibold text-base hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-4 text-center text-xs text-neutral-500">
            {mode === 'signin' ? (
              <p>Нет аккаунта? <button onClick={() => setMode('signup')} className="text-lime-400 hover:underline">Зарегистрируйся</button></p>
            ) : (
              <p>Уже есть аккаунт? <button onClick={() => setMode('signin')} className="text-lime-400 hover:underline">Войти</button></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
