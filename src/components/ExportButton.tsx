import { useStore } from '../store/useStore';
import { calculateAttendance } from '../utils/attendance';
import { Download, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExportButton() {
  const { days, subjects, settings, exportData } = useStore();

  const handleExportCSV = () => {
    const headers = ['Дата', 'День недели', 'Статус', 'Предмет'];
    const statusLabels: Record<string, string> = {
      ATTENDED: 'Присутствовал',
      SKIPPED: 'Прогул',
      EXCUSED: 'Уважительная',
      SICK: 'Болезнь',
      HOLIDAY: 'Праздник/Отмена',
      UNMARKED: 'Не отмечено',
    };
    
    const rows = days
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => {
        const date = new Date(d.date);
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long' });
        const subject = subjects.find(s => s.id === d.subjectId)?.name || '';
        return [d.date, dayName, statusLabels[d.status] || d.status, subject];
      });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${settings.name}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student-tracker-backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const attendance = calculateAttendance(days);
    const totalDays = days.filter(d => d.status !== 'UNMARKED' && d.status !== 'HOLIDAY').length;
    const attended = days.filter(d => d.status === 'ATTENDED').length;
    const skipped = days.filter(d => d.status === 'SKIPPED').length;
    const excused = days.filter(d => d.status === 'EXCUSED').length;
    const sick = days.filter(d => d.status === 'SICK').length;

    const printContent = `
      <html>
      <head>
        <title>Отчёт о посещаемости - ${settings.name}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          .subtitle { color: #666; margin-bottom: 32px; }
          .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
          .stat { background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 32px; font-weight: bold; }
          .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
          .admission { padding: 12px 20px; border-radius: 8px; font-weight: bold; display: inline-block; margin-bottom: 24px; }
          .admission.ok { background: #dcfce7; color: #166534; }
          .admission.no { background: #fef2f2; color: #991b1b; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { padding: 8px 12px; border: 1px solid #e5e5e5; text-align: left; font-size: 13px; }
          th { background: #f5f5f5; font-weight: 600; }
          .footer { margin-top: 32px; font-size: 11px; color: #999; }
        </style>
      </head>
      <body>
        <h1>Отчёт о посещаемости</h1>
        <p class="subtitle">Студент: ${settings.name} | Период: ${settings.semesterStart} — ${settings.semesterEnd}</p>
        
        <div class="admission ${parseFloat(attendance.rating) >= 80 ? 'ok' : 'no'}">
          ${parseFloat(attendance.rating) >= 80 ? '✓ Допущен к сессии' : '✗ Не допущен к сессии'} (${attendance.rating}%)
        </div>
        
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${attended}</div>
            <div class="stat-label">Присутствий</div>
          </div>
          <div class="stat">
            <div class="stat-value">${skipped}</div>
            <div class="stat-label">Прогулов</div>
          </div>
          <div class="stat">
            <div class="stat-value">${excused + sick}</div>
            <div class="stat-label">Уважительных</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Показатель</th>
              <th>Значение</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Всего учебных дней</td><td>${totalDays}</td></tr>
            <tr><td>Присутствовал</td><td>${attended}</td></tr>
            <tr><td>Прогулы</td><td>${skipped}</td></tr>
            <tr><td>Уважительные причины</td><td>${excused}</td></tr>
            <tr><td>Болезнь</td><td>${sick}</td></tr>
            <tr><td>Процент посещаемости (рейтинг)</td><td>${attendance.rating}%</td></tr>
            <tr><td>Чистое посещение</td><td>${attendance.pure}%</td></tr>
          </tbody>
        </table>
        
        <p class="footer">Сгенерировано Student Tracker Pro • ${new Date().toLocaleDateString('ru-RU')}</p>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExportCSV}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white/80 text-sm hover:bg-neutral-700 transition-colors"
      >
        <FileSpreadsheet className="w-4 h-4 text-lime-400" />
        Экспорт CSV
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white/80 text-sm hover:bg-neutral-700 transition-colors"
      >
        <Download className="w-4 h-4 text-cyan-400" />
        Отчёт PDF
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExportJSON}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white/80 text-sm hover:bg-neutral-700 transition-colors"
      >
        <Download className="w-4 h-4 text-violet-400" />
        Бэкап JSON
      </motion.button>
    </div>
  );
}
