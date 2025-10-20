import React, { useEffect, useState } from 'react';
import { supabase, Habit, DailyProgress } from '../lib/supabase';
import { calculateStreaks } from '../utils/performance';
import { Flame, TrendingUp, Award } from 'lucide-react';

export const Streaks: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [streaks, setStreaks] = useState<Map<string, number>>(new Map());
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

    const habits = habitsData || [];
    const progress = progressData || [];

    setHabits(habits);
    setProgress(progress);
    setStreaks(calculateStreaks(habits, progress));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading streaks...</p>
        </div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Habits to Track</h2>
            <p className="text-gray-600">Add habits to start building your streaks!</p>
          </div>
        </div>
      </div>
    );
  }

  const sortedHabits = [...habits].sort((a, b) => {
    const streakA = streaks.get(a.id) || 0;
    const streakB = streaks.get(b.id) || 0;
    return streakB - streakA;
  });

  const maxStreak = Math.max(...Array.from(streaks.values()));
  const totalStreakDays = Array.from(streaks.values()).reduce((sum, s) => sum + s, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Streaks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-orange-600" />
                <p className="text-sm font-medium text-gray-600">Longest Streak</p>
              </div>
              <p className="text-3xl font-bold text-orange-600">{maxStreak} days</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                <p className="text-sm font-medium text-gray-600">Total Streak Days</p>
              </div>
              <p className="text-3xl font-bold text-teal-600">{totalStreakDays}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-6 h-6 text-purple-600" />
                <p className="text-sm font-medium text-gray-600">Active Habits</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {Array.from(streaks.values()).filter(s => s > 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Habit Streaks</h3>
          <div className="space-y-3">
            {sortedHabits.map(habit => {
              const streak = streaks.get(habit.id) || 0;
              const isActive = streak > 0;

              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{habit.name}</p>
                      <p className="text-xs text-gray-500">{habit.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && <Flame className="w-5 h-5 text-orange-500" />}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">{streak}</p>
                      <p className="text-xs text-gray-500">
                        {streak === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {maxStreak >= 7 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8" />
              <h3 className="text-xl font-bold">Amazing Work!</h3>
            </div>
            <p className="text-amber-50">
              You've maintained a {maxStreak}-day streak! Keep up the incredible consistency!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
