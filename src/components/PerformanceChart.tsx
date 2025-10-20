import React from 'react';
import { DayPerformance } from '../utils/performance';

type Props = {
  performance: DayPerformance[];
};

export const PerformanceChart: React.FC<Props> = ({ performance }) => {
  const recentDays = performance.slice(-14);
  const maxHeight = 200;

  const todayPerformance = performance[performance.length - 1];
  const bestDay = performance.reduce((max, day) =>
    day.completionRate > max.completionRate ? day : max,
    performance[0] || { completionRate: 0, date: '' }
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Graph</h3>

      <div className="flex items-end justify-between gap-2 h-[200px] mb-6">
        {recentDays.map((day, index) => {
          const height = (day.completionRate / 100) * maxHeight;
          const dayNum = new Date(day.date).getDate();

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex flex-col justify-end items-center" style={{ height: maxHeight }}>
                <div
                  className="w-full bg-gradient-to-t from-teal-500 to-teal-400 rounded-t-lg transition-all duration-300 hover:from-teal-600 hover:to-teal-500 cursor-pointer group relative"
                  style={{ height: `${height}px`, minHeight: day.completionRate > 0 ? '4px' : '0' }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.completed}/{day.total} ({Math.round(day.completionRate)}%)
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{dayNum}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-teal-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Today's Completion</p>
          <p className="text-2xl font-bold text-teal-600">
            {Math.round(todayPerformance?.completionRate || 0)}%
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Best Day</p>
          <p className="text-2xl font-bold text-emerald-600">
            {Math.round(bestDay?.completionRate || 0)}%
          </p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Average (14d)</p>
          <p className="text-2xl font-bold text-amber-600">
            {Math.round(recentDays.reduce((sum, d) => sum + d.completionRate, 0) / recentDays.length) || 0}%
          </p>
        </div>
      </div>
    </div>
  );
};
