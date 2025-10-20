import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Habit, DailyProgress } from '../lib/supabase';
import { getGreeting, getQuoteOfTheDay } from '../utils/quotes';
import { calculateMonthlyPerformance } from '../utils/performance';
import { PerformanceChart } from '../components/PerformanceChart';
import { ArrowRight, Sparkles } from 'lucide-react';

type Props = {
  onNavigate: (page: 'habits') => void;
};

export const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const greeting = getGreeting();
  const quote = getQuoteOfTheDay();
  const firstName = profile?.full_name.split(' ')[0] || 'Friend';

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

  const today = new Date();
  const performance = calculateMonthlyPerformance(
    habits,
    progress,
    today.getMonth(),
    today.getFullYear()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-teal-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              {greeting}, {firstName}
            </h1>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-6 text-white">
            <p className="text-lg font-medium italic">"{quote}"</p>
          </div>
        </div>

        <PerformanceChart performance={performance} />

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ready to track your habits?
          </h3>
          <p className="text-gray-600 mb-6">
            View your habit calendar and mark your progress for today
          </p>
          <button
            onClick={() => onNavigate('habits')}
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Go to Habit Calendar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
