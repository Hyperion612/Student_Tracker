import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { useAuth } from './hooks/useAuth';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { signOut } from './lib/api';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import Heatmap from './components/Heatmap';
import DashboardStats from './components/DashboardStats';
import QuickMark from './components/QuickMark';
import Subjects from './components/Subjects';
import Achievements from './components/Achievements';
import ExportButton from './components/ExportButton';
import WeeklyOverview from './components/WeeklyOverview';
import { LayoutDashboard, BookOpen, Trophy, Download, Menu, X, Sparkles, LogOut } from 'lucide-react';

type Tab = 'dashboard' | 'subjects' | 'achievements' | 'export';

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'subjects', label: 'Дисциплины', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'achievements', label: 'Цели', icon: <Trophy className="w-5 h-5" /> },
  { id: 'export', label: 'Экспорт', icon: <Download className="w-5 h-5" /> },
];

export default function App() {
  const { settings } = useStore();
  const { user, loading, isConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync with Supabase when user is authenticated
  useSupabaseSync(user);
  
  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
      </div>
    );
  }

  // Show auth screen if not logged in (only if Supabase is configured)
  if (!user && isConfigured) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  // Show guest login if Supabase is not configured and onboarding not complete
  if (!isConfigured && !settings.onboardingComplete) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  // Show onboarding if not complete (only for authenticated users)
  if (isConfigured && !settings.onboardingComplete) {
    return <Onboarding />;
  }

  const handleSignOut = async () => {
    if (isConfigured) {
      await signOut();
    } else {
      // Guest mode - clear local storage and reload
      localStorage.removeItem('student-tracker-pro');
      window.location.reload();
    }
  };
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-400/3 rounded-full blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-800 bg-neutral-950/80 backdrop-blur-xl p-4 sticky top-0 h-screen relative z-10">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-neutral-900" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-display">Student Tracker</h1>
            <p className="text-[10px] text-neutral-500">Pro Edition</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {item.icon}
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold">
              {settings.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{settings.name}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email || 'Демо-режим'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            </div>
            <h1 className="text-sm font-bold text-white font-display">Student Tracker Pro</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-neutral-800"
            >
              <nav className="p-2 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === item.id
                        ? 'bg-lime-400/10 text-lime-400'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Выйти
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:p-6 pt-16 lg:pt-0 pb-24 lg:pb-6 overflow-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white font-display">
              Привет, {settings.name}! 👋
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <QuickMark />
                  <DashboardStats />
                  <WeeklyOverview />
                  <Heatmap />
                </div>
              )}

              {activeTab === 'subjects' && (
                <Subjects />
              )}

              {activeTab === 'achievements' && (
                <Achievements />
              )}

              {activeTab === 'export' && (
                <div>
                  <h2 className="text-lg font-semibold text-white/90 font-display mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Экспорт данных
                  </h2>
                  <p className="text-neutral-400 text-sm mb-4">
                    Скачайте отчёт о посещаемости в удобном формате. PDF-отчёт подойдёт для родителей или военкомата.
                  </p>
                  <ExportButton />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'text-lime-400'
                  : 'text-neutral-500'
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0 w-8 h-0.5 bg-lime-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
}
