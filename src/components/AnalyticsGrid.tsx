import React from 'react';
import { CheckCircle, Calendar, Flame, Target, TrendingUp } from 'lucide-react';
import type { AnalyticsData } from '../types';

interface AnalyticsGridProps {
  data: AnalyticsData;
}

const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total Problems',
      value: data.totalProblems,
      change: `+${data.monthlyChange} this month`,
      icon: CheckCircle,
      color: 'border-t-blue-600',
    },
    {
      title: 'Weekly Solved',
      value: data.weeklySolved,
      change: `+${data.weeklyChange} from last week`,
      icon: Calendar,
      color: 'border-t-green-600',
      period: '7 days',
    },
    {
      title: 'Current Streak',
      value: data.currentStreak,
      change: `+${data.streakChange} day`,
      icon: Flame,
      color: 'border-t-yellow-600',
      period: 'days',
    },
    {
      title: 'Success Rate',
      value: `${data.successRate}%`,
      change: `+${data.rateChange}% this month`,
      icon: Target,
      color: 'border-t-purple-600',
      period: '30 days',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`bg-white border border-gray-200 rounded-md p-5 relative overflow-hidden border-t-4 ${card.color}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {card.title}
              </h3>
              <div className="bg-gray-50 rounded p-1.5 text-gray-400">
                <IconComponent size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-mono mb-2">
              {card.value}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <TrendingUp size={12} />
                {card.change}
              </div>
              {card.period && (
                <div className="text-gray-400">{card.period}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsGrid;