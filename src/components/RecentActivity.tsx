import React from 'react';
import type { Problem } from '../types';
import { getDifficultyColor, getOutcomeColor, getStatusDotColor } from '../utils/helpers';
import { ExternalLink, Search, Download, Plus, FileText, Activity, BookOpen, RotateCcw, Map, Clock } from 'lucide-react';

interface RecentActivityProps {
    problems: Problem[];
    onAddProblem: () => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ problems, onAddProblem }) => {

    function formatDateToCustomString(isoDate: string): string {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        };

        const raw = new Date(isoDate).toLocaleString("en-GB", options).replace(",", "");

        // Split into parts: "07 Jul 2025 02:11 PM"
        const [day, month, year, time, period] = raw.split(" ");

        return `${day} ${month}, ${year} ${time} ${period}`;
    }

    // Mock recent activities - in a real app, this would come from an API
    const mockActivities = [
        {
            id: '1',
            type: 'problem',
            title: 'Two Sum',
            description: 'Solved LeetCode problem',
            platform: 'LeetCode',
            difficulty: 'Easy',
            outcome: 'solved',
            timeSpent: 15,
            date: new Date().toISOString(),
            icon: Activity,
            color: 'text-green-600'
        },
        {
            id: '2',
            type: 'learning',
            title: 'React Hooks Deep Dive',
            description: 'Completed learning module',
            platform: 'Codecademy',
            difficulty: 'Medium',
            outcome: 'completed',
            timeSpent: 45,
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: BookOpen,
            color: 'text-blue-600'
        },
        {
            id: '3',
            type: 'revision',
            title: 'Data Structures Review',
            description: 'Reviewed binary trees',
            platform: 'Personal Notes',
            difficulty: 'Hard',
            outcome: 'reviewed',
            timeSpent: 30,
            date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            icon: RotateCcw,
            color: 'text-purple-600'
        },
        {
            id: '4',
            type: 'roadmap',
            title: 'Frontend Development Path',
            description: 'Updated roadmap progress',
            platform: 'Personal Roadmap',
            difficulty: 'Medium',
            outcome: 'updated',
            timeSpent: 20,
            date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            icon: Map,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Activity size={20} className="text-gray-600" />
                    Recent Activity
                </h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                        <Search size={14} />
                        Filter
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                        <Download size={14} />
                        Export
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {mockActivities.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No recent activity. Start coding to see your activity here!
                    </div>
                )}
                {mockActivities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <div className="flex-shrink-0 mt-1">
                                <IconComponent size={20} className={activity.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-medium capitalize">
                                        {activity.type}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                                        {activity.platform}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${getDifficultyColor(activity.difficulty)}`}>
                                        {activity.difficulty}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px] font-medium flex items-center gap-1">
                                        <Clock size={10} />
                                        {activity.timeSpent}m
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${getOutcomeColor(activity.outcome)}`}>
                                        {activity.outcome.charAt(0).toUpperCase() + activity.outcome.slice(1)}
                                    </span>
                                </div>
                                <div className="mt-2 text-gray-500 text-[11px]">
                                    {formatDateToCustomString(activity.date)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex gap-2">
                <button
                    onClick={onAddProblem}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                    <Plus size={14} />
                    Add Activity
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                    <FileText size={14} />
                    View All
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;
