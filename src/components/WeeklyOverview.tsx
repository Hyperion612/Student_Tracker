import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Activity } from 'lucide-react';

export default function WeeklyOverview() {
  const { days } = useStore();

  const weekData = useMemo(() => {
    const today = new Date();
    const result: { date: string; day: string; status: string; isToday: boolean }[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
      const record = days.find(d => d.date === dateStr);
      const isToday = i === 0;
      
      result.push({
        date: dateStr,
        day: dayName,
        status: record?.status || 'UNMARKED',
        isToday,
      });
    }
    
    return result;
  }, [days]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATTENDED': return 'bg-lime-400';
      case 'SKIPPED': return 'bg-red-500';
      case 'EXCUSED': return 'bg-amber-400';
      case 'SICK': return 'bg-blue-400';
      case 'HOLIDAY': return 'bg-neutral-600';
      default: return 'bg-neutral-700';
    }
  };

  const getStatusHeight = (status: string) => {
    switch (status) {
      case 'ATTENDED': return '100%';
      case 'EXCUSED': return '75%';
      case 'SICK': return '50%';
      case 'SKIPPED': return '15%';
      case 'HOLIDAY': return '30%';
      default: return '10%';
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-lime-400" />
        <span className="text-xs text-neutral-400 uppercase tracking-wider">Последние 7 дней</span>
      </div>

      <div className="flex items-end justify-between gap-2 h-24">
        {weekData.map((day, i) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
            <motion.div
              className="w-full rounded-t-md relative overflow-hidden bg-neutral-800"
              style={{ height: '64px' }}
              initial={{ height: 0 }}
              animate={{ height: '64px' }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.div
                className={`absolute bottom-0 left-0 right-0 rounded-t-md ${getStatusColor(day.status)}`}
                initial={{ height: '0%' }}
                animate={{ height: getStatusHeight(day.status) }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
              />
            </motion.div>
            <span className={`text-[10px] ${day.isToday ? 'text-lime-400 font-bold' : 'text-neutral-500'}`}>
              {day.day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-neutral-500">
          Посещено: {weekData.filter(d => d.status === 'ATTENDED').length}/7
        </span>
        <span className="text-neutral-500">
          {weekData.filter(d => d.status === 'SKIPPED').length > 0 && (
            <span className="text-red-400">Пропусков: {weekData.filter(d => d.status === 'SKIPPED').length}</span>
          )}
        </span>
      </div>
    </div>
  );
}
