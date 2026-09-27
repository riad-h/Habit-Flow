import { useState } from 'react';
import { getCalendarDays, getMonthName, getTodayDate } from '../utils/dateUtils';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitCalendar({ completions, habitName }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const completedDates = new Set(completions.map(c => c.completed_date));
  const todayStr = getTodayDate();
  const days = getCalendarDays(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Don't allow navigating to future months
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>{getMonthName(currentMonth)} {currentYear}</h3>
        <div className="calendar-nav">
          <button onClick={goToPrevMonth} aria-label="Previous month">←</button>
          <button onClick={goToNextMonth} aria-label="Next month" disabled={isCurrentMonth}>→</button>
        </div>
      </div>
      <div className="calendar-grid">
        {DAY_HEADERS.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="calendar-day empty" />;
          }
          const isToday = date === todayStr;
          const isCompleted = completedDates.has(date);
          const classes = ['calendar-day'];
          if (isToday) classes.push('today');
          if (isCompleted) classes.push('completed');
          return (
            <div key={date} className={classes.join(' ')} title={isCompleted ? `${habitName} completed` : ''}>
              {parseInt(date.split('-')[2])}
            </div>
          );
        })}
      </div>
    </div>
  );
}
