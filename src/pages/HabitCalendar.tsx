import React, { useEffect, useState } from 'react';
import { supabase, Habit, DailyProgress } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

export const HabitCalendar: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    const { data: progressData } = await supabase
      .from('daily_progress')
      .select('*');

    setHabits(habitsData || []);
    setProgress(progressData || []);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getProgressForDate = (habitId: string, date: string) => {
    return progress.find(p => p.habit_id === habitId && p.date === date);
  };

  const updateProgress = async (habitId: string, date: string, completed: boolean, value?: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const existingProgress = getProgressForDate(habitId, date);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (existingProgress) {
      const { data, error } = await supabase
        .from('daily_progress')
        .update({
          completed,
          current_value: value ?? existingProgress.current_value,
        })
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (data) {
        setProgress(prev => prev.map(p => p.id === data.id ? data : p));
      }
    } else {
      const { data, error } = await supabase
        .from('daily_progress')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          date,
          completed,
          current_value: value ?? 0,
        })
        .select()
        .single();

      if (data) {
        setProgress(prev => [...prev, data]);
      }
    }
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const daysInMonth = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading habits...</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Habits Yet</h2>
            <p className="text-gray-600 mb-6">Start building better habits by adding your first habit!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white z-10 px-4 py-3 text-left font-semibold text-gray-700 border-b-2 border-gray-200 min-w-[200px]">
                    Habit
                  </th>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <th key={day} className="px-2 py-3 text-center font-medium text-gray-600 border-b-2 border-gray-200 min-w-[60px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="sticky left-0 bg-white z-10 px-4 py-3 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{habit.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">{habit.name}</p>
                          <p className="text-xs text-gray-500">{habit.category}</p>
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayProgress = getProgressForDate(habit.id, dateStr);
                      const isPast = new Date(dateStr) < new Date(new Date().toDateString());
                      const isToday = dateStr === new Date().toISOString().split('T')[0];

                      return (
                        <td key={day} className={`px-2 py-3 text-center ${isToday ? 'bg-teal-50' : ''}`}>
                          {habit.has_target ? (
                            <input
                              type="number"
                              min="0"
                              max={habit.target_value}
                              value={dayProgress?.current_value || ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                updateProgress(habit.id, dateStr, value >= habit.target_value, value);
                              }}
                              className={`w-14 px-2 py-1 text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                dayProgress && dayProgress.current_value >= habit.target_value
                                  ? 'bg-green-100 border-green-300'
                                  : 'border-gray-300'
                              }`}
                              placeholder={`/${habit.target_value}`}
                            />
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => updateProgress(habit.id, dateStr, true)}
                                className={`p-1 rounded transition-all ${
                                  dayProgress?.completed
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-400 hover:bg-green-100'
                                }`}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateProgress(habit.id, dateStr, false)}
                                className={`p-1 rounded transition-all ${
                                  dayProgress && !dayProgress.completed
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-400 hover:bg-red-100'
                                }`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
