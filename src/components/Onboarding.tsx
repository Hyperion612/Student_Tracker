import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { updateProfile } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const STEPS = [
  {
    title: 'Привет! 👋',
    subtitle: 'Давай настроим твой трекер посещаемости',
  },
  {
    title: 'Когда начался семестр?',
    subtitle: 'Укажи даты начала и конца учебного семестра',
  },
  {
    title: 'Выбери акцентный цвет',
    subtitle: 'Он будет использоваться для подсветки элементов',
  },
];

const COLORS = [
  { name: 'lime', label: 'Лайм', class: 'bg-lime-400', ring: 'ring-lime-400' },
  { name: 'cyan', label: 'Циан', class: 'bg-cyan-400', ring: 'ring-cyan-400' },
  { name: 'violet', label: 'Виолет', class: 'bg-violet-400', ring: 'ring-violet-400' },
] as const;

export default function Onboarding() {
  const { settings, updateSettings, generateDemoData } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.name || '');
  const [startDate, setStartDate] = useState(settings.semesterStart);
  const [endDate, setEndDate] = useState(settings.semesterEnd);
  const [color, setColor] = useState<typeof COLORS[number]>(COLORS[0]);

  const handleNext = async () => {
    if (step === 0) {
      if (name.trim()) {
        updateSettings({ name: name.trim() });
        // Sync to Supabase if user is authenticated
        if (user) {
          await updateProfile(user.id, { name: name.trim() });
        }
        setStep(1);
      }
    } else if (step === 1) {
      updateSettings({ semesterStart: startDate, semesterEnd: endDate });
      // Sync to Supabase if user is authenticated
      if (user) {
        await updateProfile(user.id, { 
          semester_start: startDate, 
          semester_end: endDate 
        });
      }
      setStep(2);
    } else if (step === 2) {
      updateSettings({ accentColor: color.name as 'lime' | 'cyan' | 'violet', onboardingComplete: true });
      // Sync to Supabase if user is authenticated
      if (user) {
        await updateProfile(user.id, { 
          accent_color: color.name as 'lime' | 'cyan' | 'violet',
          onboarding_complete: true 
        });
      }
      // Generate demo data for local store
      generateDemoData();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-neutral-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-lime-400' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {step === 0 && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-display">{STEPS[0].title}</h1>
                <p className="text-neutral-400 mb-8">{STEPS[0].subtitle}</p>
                
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как тебя зовут?"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all"
                  autoFocus
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-display">{STEPS[1].title}</h1>
                <p className="text-neutral-400 mb-8">{STEPS[1].subtitle}</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-neutral-400 mb-1 block">Начало семестра</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-400 mb-1 block">Конец семестра</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-display">{STEPS[2].title}</h1>
                <p className="text-neutral-400 mb-8">{STEPS[2].subtitle}</p>
                
                <div className="flex gap-4 justify-center">
                  {COLORS.map((c) => (
                    <motion.button
                      key={c.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setColor(c)}
                      className={`w-16 h-16 rounded-2xl ${c.class} transition-all ${
                        color.name === c.name ? `ring-4 ${c.ring} ring-offset-4 ring-offset-neutral-950` : ''
                      }`}
                    />
                  ))}
                </div>
                <p className="text-center text-neutral-400 mt-4 text-sm">{color.label}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="mt-8 w-full py-3 rounded-xl bg-lime-400 text-neutral-900 font-semibold text-lg hover:bg-lime-300 transition-colors"
        >
          {step === 2 ? 'Начать! 🚀' : 'Далее →'}
        </motion.button>
      </motion.div>
    </div>
  );
}
