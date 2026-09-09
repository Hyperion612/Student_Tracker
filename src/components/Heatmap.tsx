import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { DayStatus } from '../utils/attendance';
import { getDayOfWeek } from '../utils/attendance';

const STATUS_COLORS: Record<DayStatus, string> = {
  ATTENDED: 'bg-lime-400',
  SKIPPED: 'bg-red-500',
  EXCUSED: 'bg-amber-400',
  SICK: 'bg-blue-400',
  HOLIDAY: 'bg-neutral-700',
  UNMARKED: 'bg-neutral-800/60',
};

const STATUS_LABELS: Record<DayStatus, string> = {
  ATTENDED: 'Присутствовал',
  SKIPPED: 'Прогул',
  EXCUSED: 'Уважительная',
  SICK: 'Болезнь',
  HOLIDAY: 'Праздник/Отмена',
  UNMARKED: 'Не отмечено',
};

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Heatmap() {
  const { days, settings, setDayStatus } = useStore();
  const [tooltip, setTooltip] = useState<{ date: string; x: number; y: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const gridData = useMemo(() => {
    const start = new Date(settings.semesterStart);
    const end = new Date(settings.semesterEnd);
    const weeks: { date: string; status: DayStatus }[][] = [];
    
    // Align to Monday
    const firstDay = new Date(start);
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    firstDay.setDate(firstDay.getDate() + mondayOffset);
    
    const current = new Date(firstDay);
    while (current <= end || current.getDay() !== 1) {
      const week: { date: string; status: DayStatus }[] = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = current.toISOString().split('T')[0];
        const record = days.find(d => d.date === dateStr);
        const inRange = current >= start && current <= end;
        week.push({
          date: dateStr,
          status: record?.status || (inRange ? 'UNMARKED' : 'HOLIDAY'),
        });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
      if (current > end && current.getDay() === 1) break;
    }
    
    return weeks;
  }, [days, settings.semesterStart, settings.semesterEnd]);

  const handleCellClick = (date: string) => {
    setSelectedDate(date);
    setShowPicker(true);
  };

  const handleStatusSelect = (status: DayStatus) => {
    if (selectedDate) {
      setDayStatus(selectedDate, status);
      setShowPicker(false);
      setSelectedDate(null);
    }
  };

  const tooltipRecord = tooltip ? days.find(d => d.date === tooltip.date) : null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white/90 font-display">Мой учебный год</h2>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-lime-400" />Посетил</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />Уваж.</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400" />Болезнь</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" />Прогул</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[2px] min-w-fit">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1 pt-0">
            {DAY_NAMES.map((name, i) => (
              <div key={i} className="h-[14px] w-6 flex items-center text-[10px] text-neutral-500">
                {i % 2 === 0 ? name : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {gridData.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[2px]">
              {week.map((day, dayIdx) => {
                const isToday = day.date === today;
                const isWeekend = dayIdx >= 5;
                
                return (
                  <motion.div
                    key={day.date}
                    className={`w-[14px] h-[14px] rounded-[3px] cursor-pointer transition-all duration-150 ${
                      STATUS_COLORS[day.status]
                    } ${isToday ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-neutral-900' : ''} ${
                      isWeekend && day.status === 'UNMARKED' ? 'opacity-30' : ''
                    } hover:scale-150 hover:z-10`}
                    whileHover={{ scale: 1.8 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleCellClick(day.date)}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ date: day.date, x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    layout
                  >
                    {isToday && (
                      <motion.div
                        className="absolute inset-0 rounded-[3px] ring-2 ring-cyan-400"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 50,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl text-xs">
              <div className="text-white font-medium">
                {new Date(tooltip.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' })}
              </div>
              <div className="text-neutral-400 mt-0.5">
                {tooltipRecord ? STATUS_LABELS[tooltipRecord.status] : 'Не отмечено'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Picker Modal */}
      <AnimatePresence>
        {showPicker && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPicker(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold text-lg mb-1">
                {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' })}
              </h3>
              <p className="text-neutral-400 text-sm mb-4">Выберите статус:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(STATUS_LABELS) as [DayStatus, string][]).filter(([key]) => key !== 'UNMARKED').map(([status, label]) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 transition-colors ${
                      status === 'ATTENDED' ? 'hover:bg-lime-400/10' :
                      status === 'SKIPPED' ? 'hover:bg-red-500/10' :
                      status === 'EXCUSED' ? 'hover:bg-amber-400/10' :
                      status === 'SICK' ? 'hover:bg-blue-400/10' :
                      'hover:bg-neutral-700/50'
                    }`}
                    onClick={() => handleStatusSelect(status)}
                  >
                    <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[status]}`} />
                    <span className="text-sm text-white/90">{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
