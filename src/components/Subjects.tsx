import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getAttendanceBySubject } from '../utils/attendance';
import { Plus, Trash2, BookOpen } from 'lucide-react';

const EMOJI_OPTIONS = ['📐', '💻', '🏃', '📚', '🧪', '🎨', '🌍', '📊', '🔬', '🎵', '✍️', '🧮'];
const COLOR_OPTIONS = ['#84cc16', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#ec4899'];

export default function Subjects() {
  const { subjects, days, addSubject, removeSubject } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const handleAdd = () => {
    if (name.trim()) {
      addSubject({ name: name.trim(), emoji, color });
      setName('');
      setEmoji('📚');
      setColor(COLOR_OPTIONS[0]);
      setShowAdd(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/90 font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Дисциплины
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs text-lime-400 hover:text-lime-300 transition-colors px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название дисциплины"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                autoFocus
              />
              
              <div className="mb-3">
                <label className="text-xs text-neutral-400 mb-1.5 block">Иконка</label>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                        emoji === e ? 'bg-lime-400/20 ring-2 ring-lime-400' : 'bg-neutral-800 hover:bg-neutral-700'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-neutral-400 mb-1.5 block">Цвет</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${
                        color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-lime-400 text-neutral-900 font-medium text-sm hover:bg-lime-300 transition-colors"
              >
                Сохранить
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject list */}
      <div className="space-y-2">
        {subjects.length === 0 && (
          <div className="text-center py-8 text-neutral-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Добавьте дисциплины для отслеживания</p>
          </div>
        )}
        
        {subjects.map((subject) => {
          const stats = getAttendanceBySubject(days, subject.id);
          const percent = parseFloat(stats.percent);
          
          return (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                {subject.emoji}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white truncate">{subject.name}</h3>
                  <span className="text-sm font-mono tabular-nums text-white ml-2">{stats.percent}%</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">{stats.attended}/{stats.total} пар</span>
                  {stats.skipped > 0 && <span className="text-xs text-red-400">пропущено: {stats.skipped}</span>}
                </div>
                <div className="mt-2 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: subject.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeSubject(subject.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
