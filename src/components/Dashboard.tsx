import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import RecentActivity from './RecentActivity';
import Problems from './Problems';
import Learning from './Learning';
import Revision from './Revision';
import Roadmaps from './Roadmaps';
import AdvancedAnalytics from './AdvancedAnalytics';
import type { Problem } from '../types';
import { apiClient } from '../utils/apis';
import { AuthContext } from './AuthContext';
import { Rocket } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [problems, setProblems] = useState<Problem[]>([]);
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            if (!user?.id) return;

            try {
                const response = await apiClient.getProblems(user.id) as { success: boolean; data: Problem[] };
                if (response.success) {
                    setProblems(response.data);
                }
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        fetchProblems();
    }, [user?.id]);

    const handleSettingsClick = () => {
        navigate('/settings');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <Header activeTab={activeTab} onTabChange={setActiveTab} onSettingsClick={handleSettingsClick} />

                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-2xl border border-blue-500 p-8 relative overflow-hidden min-h-[200px]">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                                    backgroundSize: '40px 40px'
                                }}></div>
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                            Welcome back, {user?.firstName || 'Coder'}!
                                        </h1>
                                        <p className="text-gray-300 text-lg font-medium">Ready to tackle some coding challenges today?</p>
                                    </div>
                                    <div className="hidden md:block ml-8">
                                        <div className="w-40 h-40 flex items-center justify-center">
                                            <Rocket size={160} className="text-blue-400" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Activity - Takes 2 columns */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <RecentActivity
                                        problems={problems}
                                        onAddProblem={() => setActiveTab('problems')}
                                    />
                                </div>
                            </div>

                            {/* Side Panel - Takes 1 column */}
                            <div className="space-y-6">
                                {/* Quick Stats */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-4">
                                        <h3 className="text-base font-semibold text-gray-900">Quick Stats</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Today's Progress Ring */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16">
                                                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                            <defs>
                                                                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                    <stop offset="0%" stopColor="#3B82F6" />
                                                                    <stop offset="100%" stopColor="#1D4ED8" />
                                                                </linearGradient>
                                                            </defs>
                                                            <path
                                                                className="text-gray-200"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                            <path
                                                                stroke="url(#blueGradient)"
                                                                strokeWidth="4"
                                                                strokeLinecap="round"
                                                                fill="none"
                                                                strokeDasharray="60, 100"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-blue-600">60%</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Today's Progress</p>
                                                        <p className="text-xs text-gray-600">3/5 tasks completed</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* This Week Ring */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16">
                                                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                            <defs>
                                                                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                    <stop offset="0%" stopColor="#10B981" />
                                                                    <stop offset="100%" stopColor="#059669" />
                                                                </linearGradient>
                                                            </defs>
                                                            <path
                                                                className="text-gray-200"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                            <path
                                                                stroke="url(#greenGradient)"
                                                                strokeWidth="4"
                                                                strokeLinecap="round"
                                                                fill="none"
                                                                strokeDasharray="80, 100"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-green-600">12</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">This Week</p>
                                                        <p className="text-xs text-gray-600">Problems solved</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Current Streak Ring */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-16 h-16">
                                                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                                            <defs>
                                                                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                    <stop offset="0%" stopColor="#F59E0B" />
                                                                    <stop offset="100%" stopColor="#D97706" />
                                                                </linearGradient>
                                                            </defs>
                                                            <path
                                                                className="text-gray-200"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                            <path
                                                                stroke="url(#orangeGradient)"
                                                                strokeWidth="4"
                                                                strokeLinecap="round"
                                                                fill="none"
                                                                strokeDasharray="50, 100"
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-orange-600">5</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Current Streak</p>
                                                        <p className="text-xs text-gray-600">Days in a row</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-4">
                                        <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setActiveTab('problems')}
                                                className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">📝</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">Add Problem</div>
                                                    <div className="text-sm text-gray-600">Log a new coding problem</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('learning')}
                                                className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">📚</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">Start Learning</div>
                                                    <div className="text-sm text-gray-600">Continue your studies</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('revision')}
                                                className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">🔄</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">Review Notes</div>
                                                    <div className="text-sm text-gray-600">Revise previous topics</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Achievements */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-50 border-b border-gray-200 px-5 py-4">
                                        <h3 className="text-base font-semibold text-gray-900">Recent Achievements</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                                                <span className="text-2xl">🎯</span>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">Accuracy Master</div>
                                                    <div className="text-xs text-gray-600">85% success rate achieved</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                                <span className="text-2xl">⚡</span>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">Speed Demon</div>
                                                    <div className="text-xs text-gray-600">Solved problems in record time</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                                                <span className="text-2xl">🧠</span>
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">Knowledge Seeker</div>
                                                    <div className="text-xs text-gray-600">Completed 3 learning modules</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'problems' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <Problems activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                )}

                {activeTab === 'learning' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <Learning activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                )}

                {activeTab === 'revision' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <Revision activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                )}

                {activeTab === 'roadmaps' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <Roadmaps activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
                        <AdvancedAnalytics />
                    </div>
                )}
            </div>
        </div>
    );
};