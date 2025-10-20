import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus } from 'lucide-react';

export const AddHabit: React.FC = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [hasTarget, setHasTarget] = useState(false);
  const [targetValue, setTargetValue] = useState(5);
  const [icon, setIcon] = useState('✅');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Health', 'Spiritual', 'Study', 'Work', 'Fitness', 'Mindfulness', 'Other'];

  const commonIcons = [
    '✅', '💧', '🕌', '📚', '💪', '🧘', '🏃', '🎯', '⭐', '🌟',
    '🔥', '💡', '📖', '✍️', '🎨', '🎵', '🍎', '🥗', '😴', '☕'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name,
          category,
          has_target: hasTarget,
          target_value: hasTarget ? targetValue : 0,
          icon,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setName('');
      setCategory('Health');
      setHasTarget(false);
      setTargetValue(5);
      setIcon('✅');

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to add habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Habit</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="e.g., Drink Water, Pray Fajr, Read for 30 minutes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {commonIcons.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      icon === emoji
                        ? 'bg-teal-500 scale-110 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="hasTarget"
                  checked={hasTarget}
                  onChange={(e) => setHasTarget(e.target.checked)}
                  className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                />
                <label htmlFor="hasTarget" className="text-sm font-medium text-gray-700">
                  Track with a target number (e.g., 8 glasses of water, 5 prayers)
                </label>
              </div>

              {hasTarget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm">
                Habit added successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Adding...' : 'Add Habit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
