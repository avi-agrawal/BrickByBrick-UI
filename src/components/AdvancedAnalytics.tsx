import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Target,
    Clock,
    BookOpen,
    Brain,
    Lightbulb,
    AlertTriangle,
    BarChart3,
    PieChart,
    Activity,
    Zap,
    Award,
    Star
} from 'lucide-react';
import type { AdvancedAnalytics as AdvancedAnalyticsType } from '../types';
import { apiClient } from '../utils/apis';
import { AuthContext } from './AuthContext';

interface AdvancedAnalyticsProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'custom'>('month');
    const [selectedView, setSelectedView] = useState<'overview' | 'performance' | 'topics' | 'ai'>('overview');
    const [data, setData] = useState<AdvancedAnalyticsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [customDateRange, setCustomDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const { user } = React.useContext(AuthContext);

    const loadAnalytics = async () => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);

            // Prepare date parameters for API call
            let dateParams = {};
            if (selectedTimeframe === 'custom' && customDateRange.startDate && customDateRange.endDate) {
                dateParams = {
                    startDate: customDateRange.startDate,
                    endDate: customDateRange.endDate
                };
            } else {
                dateParams = { timeframe: selectedTimeframe };
            }

            const response = await apiClient.getAnalytics(user.id, dateParams) as { success: boolean; data: any };
            if (response.success && response.data) {
                // Transform the server response to match the AdvancedAnalytics interface
                const transformedData: AdvancedAnalyticsType = {
                    overview: {
                        totalProblems: response.data.overview?.totalProblems || 0,
                        totalLearningHours: response.data.overview?.totalLearningHours || 0,
                        currentStreak: response.data.overview?.currentStreak || 0,
                        successRate: response.data.overview?.successRate || 0,
                        averageTimePerProblem: response.data.overview?.averageTimePerProblem || 0,
                        totalTopics: response.data.overview?.totalTopics || 0,
                        completedRoadmaps: response.data.overview?.completedRoadmaps || 0,
                    },
                    performanceMetrics: {
                        dailyActivity: response.data.performanceMetrics?.dailyActivity || [],
                        weeklyProgress: response.data.performanceMetrics?.weeklyProgress || [],
                        monthlyTrends: response.data.performanceMetrics?.monthlyTrends || [],
                    },
                    topicAnalysis: {
                        strongestTopics: response.data.topicAnalysis?.strongestTopics || [],
                        weakestTopics: response.data.topicAnalysis?.weakestTopics || [],
                        topicDistribution: response.data.topicAnalysis?.topicDistribution || [],
                    },
                    difficultyAnalysis: response.data.difficultyAnalysis || {
                        easyProblems: { solved: 0, total: 0, successRate: 0 },
                        mediumProblems: { solved: 0, total: 0, successRate: 0 },
                        hardProblems: { solved: 0, total: 0, successRate: 0 }
                    },
                    timeAnalysis: {
                        bestPerformingHours: response.data.timeAnalysis?.bestPerformingHours || [],
                        averageTimeByDifficulty: response.data.timeAnalysis?.averageTimeByDifficulty || {
                            easy: 0,
                            medium: 0,
                            hard: 0
                        },
                        productivityPatterns: response.data.timeAnalysis?.productivityPatterns || [],
                    },
                    aiInsights: {
                        recommendations: response.data.aiInsights?.recommendations || [],
                        predictions: response.data.aiInsights?.predictions || [],
                        strengths: response.data.aiInsights?.strengths || [],
                        improvements: response.data.aiInsights?.improvements || [],
                    },
                    learningProgress: {
                        coursesCompleted: response.data.learningProgress?.coursesCompleted || 0,
                        coursesInProgress: response.data.learningProgress?.coursesInProgress || 0,
                        totalLearningHours: response.data.learningProgress?.totalLearningHours || 0,
                        learningStreak: response.data.learningProgress?.learningStreak || 0,
                        favoriteTopics: response.data.learningProgress?.favoriteTopics || [],
                    },
                    roadmapProgress: {
                        totalRoadmaps: response.data.roadmapProgress?.totalRoadmaps || 0,
                        completedRoadmaps: response.data.roadmapProgress?.completedRoadmaps || 0,
                        inProgressRoadmaps: response.data.roadmapProgress?.inProgressRoadmaps || 0,
                        nextMilestones: response.data.roadmapProgress?.nextMilestones || [],
                    }
                };
                setData(transformedData);
            }
        } catch (error) {
            console.error('Error fetching advanced analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [user?.id, selectedTimeframe, customDateRange]);

    const handleTimeframeChange = (timeframe: 'week' | 'month' | 'quarter' | 'custom') => {
        setSelectedTimeframe(timeframe);
        if (timeframe === 'custom') {
            setShowCustomDatePicker(true);
        } else {
            setShowCustomDatePicker(false);
        }
    };

    const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
        setCustomDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const applyCustomDateRange = () => {
        if (customDateRange.startDate && customDateRange.endDate) {
            setShowCustomDatePicker(false);
            // The useEffect will automatically reload data when customDateRange changes
        }
    };

    const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'topic': return <BookOpen size={16} />;
            case 'difficulty': return <Target size={16} />;
            case 'time': return <Clock size={16} />;
            case 'pattern': return <Activity size={16} />;
            default: return <Lightbulb size={16} />;
        }
    };

    const OverviewSection = () => (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Problems</p>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{data?.overview.totalProblems || 0}</p>
                            )}
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-2xl font-bold text-green-600">{data?.overview.totalLearningHours || 0}h</p>
                            )}
                        </div>
                        <Clock className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Current Streak</p>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-2xl font-bold text-purple-600">{data?.overview.currentStreak || 0}</p>
                            )}
                        </div>
                        <Zap className="h-8 w-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            {isLoading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            ) : (
                                <p className="text-2xl font-bold text-orange-600">{data?.overview.successRate || 0}%</p>
                            )}
                        </div>
                        <Award className="h-8 w-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
                        <BarChart3 className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {data?.performanceMetrics?.dailyActivity?.slice(0, 7).map((day, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-sm text-gray-600">{day.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium">{day.problemsSolved} problems</span>
                                    <span className="text-sm text-gray-500">{day.learningHours}h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
                        <TrendingUp className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-4">
                        {data?.performanceMetrics?.weeklyProgress?.map((week, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{week.week}</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{week.problemsSolved}</span>
                                        <span className="text-xs text-gray-500">problems</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-green-600">{week.successRate}%</span>
                                        <span className="text-xs text-gray-500">success</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const PerformanceSection = () => (
        <div className="space-y-6">
            {/* Difficulty Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Difficulty Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                            {data?.difficultyAnalysis?.easyProblems?.successRate || 0}%
                        </div>
                        <div className="text-sm text-gray-600 mb-1">Easy Problems</div>
                        <div className="text-xs text-gray-500">
                            {data?.difficultyAnalysis?.easyProblems?.solved || 0}/{data?.difficultyAnalysis?.easyProblems?.total || 0} solved
                        </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600 mb-2">
                            {data?.difficultyAnalysis?.mediumProblems?.successRate || 0}%
                        </div>
                        <div className="text-sm text-gray-600 mb-1">Medium Problems</div>
                        <div className="text-xs text-gray-500">
                            {data?.difficultyAnalysis?.mediumProblems?.solved || 0}/{data?.difficultyAnalysis?.mediumProblems?.total || 0} solved
                        </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600 mb-2">
                            {data?.difficultyAnalysis?.hardProblems?.successRate || 0}%
                        </div>
                        <div className="text-sm text-gray-600 mb-1">Hard Problems</div>
                        <div className="text-xs text-gray-500">
                            {data?.difficultyAnalysis?.hardProblems?.solved || 0}/{data?.difficultyAnalysis?.hardProblems?.total || 0} solved
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Best Performing Hours</h3>
                    <div className="space-y-4">
                        {data?.timeAnalysis?.bestPerformingHours?.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-sm font-medium">{hour.hour}:00</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-green-600 font-medium">{hour.successRate}%</span>
                                    <span className="text-xs text-gray-500">{hour.problemsSolved} problems</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Productivity by Day</h3>
                    <div className="space-y-3">
                        {data?.timeAnalysis?.productivityPatterns?.map((day, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{day.day}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${day.productivity}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium w-8">{day.productivity}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const TopicsSection = () => (
        <div className="space-y-6">
            {/* Topic Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Strongest Topics</h3>
                    <div className="space-y-4">
                        {data?.topicAnalysis?.strongestTopics?.map((topic, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-medium">{topic.topic}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-green-600 font-medium">{topic.successRate}%</span>
                                    <span className="text-xs text-gray-500">{topic.problemsSolved} problems</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Areas for Improvement</h3>
                    <div className="space-y-4">
                        {data?.topicAnalysis?.weakestTopics?.map((topic, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-medium">{topic.topic}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-red-600 font-medium">{topic.successRate}%</span>
                                    <span className="text-xs text-gray-500">{topic.problemsSolved} problems</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Topic Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Topic Distribution</h3>
                <div className="space-y-3">
                    {data?.topicAnalysis?.topicDistribution?.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium">{topic.topic}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${topic.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium w-12">{topic.percentage}%</span>
                                <span className="text-xs text-gray-500 w-8">{topic.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const AISection = () => (
        <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Brain className="text-purple-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                    {data?.aiInsights?.recommendations?.map((rec, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg">
                                    {getTypeIcon(rec.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium">{rec.title}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {rec.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{rec.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-blue-600" size={24} />
                        <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
                    </div>
                    <div className="space-y-4">
                        {data?.aiInsights?.predictions?.map((pred, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-medium text-sm">{pred.metric}</div>
                                    <div className="text-xs text-gray-500">{pred.timeframe}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">{pred.current} → {pred.predicted}</div>
                                    <div className="text-xs text-green-600">+{Math.round(((pred.predicted - pred.current) / pred.current) * 100)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-semibold text-gray-900">Your Strengths</h3>
                    </div>
                    <div className="space-y-4">
                        {data?.aiInsights?.strengths?.map((strength, index) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-sm">{strength.area}</div>
                                    <div className="text-xs text-green-600 font-medium">{strength.confidence}% confidence</div>
                                </div>
                                <p className="text-xs text-gray-600">{strength.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">{data?.learningProgress?.coursesCompleted || 0}</div>
                        <div className="text-sm text-gray-600">Courses Completed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{data?.learningProgress?.coursesInProgress || 0}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">{data?.learningProgress?.totalLearningHours || 0}h</div>
                        <div className="text-sm text-gray-600">Learning Hours</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-2">{data?.learningProgress?.learningStreak || 0}</div>
                        <div className="text-sm text-gray-600">Learning Streak</div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                        <p className="text-gray-600">AI-powered insights and performance metrics</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                        <p className="text-gray-600">AI-powered insights and performance metrics</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load analytics data. Please try again.</p>
                    <button
                        onClick={loadAnalytics}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                    <p className="text-gray-600">AI-powered insights and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => handleTimeframeChange(e.target.value as 'week' | 'month' | 'quarter' | 'custom')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="custom">Custom Range</option>
                    </select>

                    {showCustomDatePicker && (
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">From:</label>
                                <input
                                    type="date"
                                    value={customDateRange.startDate}
                                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">To:</label>
                                <input
                                    type="date"
                                    value={customDateRange.endDate}
                                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={applyCustomDateRange}
                                disabled={!customDateRange.startDate || !customDateRange.endDate}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                            <button
                                onClick={() => {
                                    setShowCustomDatePicker(false);
                                    setSelectedTimeframe('month');
                                }}
                                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'performance', label: 'Performance', icon: Activity },
                    { id: 'topics', label: 'Topics', icon: PieChart },
                    { id: 'ai', label: 'AI Insights', icon: Brain },
                ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedView(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <IconComponent size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            {selectedView === 'overview' && data && <OverviewSection />}
            {selectedView === 'performance' && data && <PerformanceSection />}
            {selectedView === 'topics' && data && <TopicsSection />}
            {selectedView === 'ai' && data && <AISection />}
        </div>
    );
};

export default AdvancedAnalytics;
