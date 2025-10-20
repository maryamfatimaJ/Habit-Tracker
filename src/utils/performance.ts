import { Habit, DailyProgress } from '../lib/supabase';

export type DayPerformance = {
  date: string;
  completionRate: number;
  completed: number;
  total: number;
};

export const calculateMonthlyPerformance = (
  habits: Habit[],
  progress: DailyProgress[],
  month: number,
  year: number
): DayPerformance[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const performance: DayPerformance[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayProgress = progress.filter(p => p.date === dateStr);

    let completed = 0;
    dayProgress.forEach(p => {
      const habit = habits.find(h => h.id === p.habit_id);
      if (habit) {
        if (habit.has_target) {
          if (p.current_value >= habit.target_value) {
            completed++;
          }
        } else if (p.completed) {
          completed++;
        }
      }
    });

    const total = habits.length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    performance.push({
      date: dateStr,
      completionRate,
      completed,
      total,
    });
  }

  return performance;
};

export const calculateStreaks = (
  habits: Habit[],
  progress: DailyProgress[]
): Map<string, number> => {
  const streaks = new Map<string, number>();

  habits.forEach(habit => {
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      const dayProgress = progress.find(
        p => p.habit_id === habit.id && p.date === dateStr
      );

      if (dayProgress) {
        const isComplete = habit.has_target
          ? dayProgress.current_value >= habit.target_value
          : dayProgress.completed;

        if (isComplete) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    streaks.set(habit.id, currentStreak);
  });

  return streaks;
};
