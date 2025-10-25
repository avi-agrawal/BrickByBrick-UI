import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Play, Pause, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import type { LearningItem } from '../types';
import { AuthContext } from './AuthContext';
import { apiClient } from '../utils/apis';

interface LearningProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Learning: React.FC<LearningProps> = ({ activeTab, onTabChange }) => {
    const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Partial<LearningItem>>({
        title: '',
        type: 'course',
        category: '',
        subtopic: '',
        timeSpent: 0,
        progress: 0,
        status: 'not-started',
        link: '',
        tags: '',
        notes: '',
        resourceLink: '',
        isRevision: false,
        difficulty: 'beginner',
        platform: '',
    });
    const { user } = React.useContext(AuthContext);

    const handleAddLearning = async () => {
        if (!formData.title || !formData.category || !user?.id) return;

        try {
            const response = await apiClient.createLearningItem(formData, { id: user.id });
            if (response.success) {
                loadLearningItems(); // Refresh the list from backend
                setShowAddForm(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error creating learning item:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            type: 'course',
            category: '',
            subtopic: '',
            timeSpent: 0,
            progress: 0,
            status: 'not-started',
            link: '',
            tags: '',
            notes: '',
            resourceLink: '',
            isRevision: false,
            difficulty: 'beginner',
            platform: '',
        });
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const loadLearningItems = async () => {
        if (!user?.id) return;

        try {
            const response = await apiClient.getLearningItems(user.id);
            if (response.success) {
                setLearningItems(response.data);
            }
        } catch (error) {
            console.error('Error loading learning items:', error);
        }
    };

    const updateProgress = async (id: string, progress: number) => {
        try {
            const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
            await apiClient.updateLearningItem(id, { progress, status });
            loadLearningItems(); // Refresh from backend
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const updateStatus = async (id: string, status: LearningItem['status']) => {
        try {
            await apiClient.updateLearningItem(id, { status });
            loadLearningItems(); // Refresh from backend
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: LearningItem['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: LearningItem['type']) => {
        switch (type) {
            case 'course': return '🎓';
            case 'book': return '📚';
            case 'tutorial': return '📖';
            case 'article': return '📄';
            case 'video': return '🎥';
            case 'podcast': return '🎧';
            case 'workshop': return '🔧';
            default: return '📝';
        }
    };

    useEffect(() => {
        loadLearningItems();
    }, [user?.id]);

    if (activeTab !== 'learning') {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{learningItems.length}</p>
                        </div>
                        <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">
                                {learningItems.filter(item => item.status === 'completed').length}
                            </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {learningItems.filter(item => item.status === 'in-progress').length}
                            </p>
                        </div>
                        <Play className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Time</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {learningItems.reduce((sum, item) => sum + item.timeSpent, 0)}m
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Learning Items List */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                        Learning Items
                    </h2>
                    <button
                        onClick={handleShowAddForm}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={14} />
                        Add Learning Item
                    </button>
                </div>

                <div className="p-6">
                    {learningItems.length === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No learning items yet</h3>
                            <p className="text-gray-600 mb-4">Start tracking your learning journey by adding your first item</p>
                            <button
                                onClick={handleShowAddForm}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={14} />
                                Add Learning Item
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {learningItems.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-lg">{getTypeIcon(item.type)}</span>
                                                <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(item.status)}`}>
                                                    {item.status.replace('-', ' ')}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <span className="capitalize">{item.type}</span>
                                                <span>•</span>
                                                <span>{item.category}</span>
                                                {item.platform && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{item.platform}</span>
                                                    </>
                                                )}
                                                {item.difficulty && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="capitalize">{item.difficulty}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-2">
                                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                    <span>Progress</span>
                                                    <span>{item.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {item.notes && (
                                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    View Resource
                                                </a>
                                            )}

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => updateProgress(item.id, Math.max(0, item.progress - 10))}
                                                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                                >
                                                    -10%
                                                </button>
                                                <button
                                                    onClick={() => updateProgress(item.id, Math.min(100, item.progress + 10))}
                                                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                                >
                                                    +10%
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Learning Form */}
            {showAddForm && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Learning Item</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., React Fundamentals Course"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as LearningItem['type'] }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="course">Course</option>
                                <option value="book">Book</option>
                                <option value="tutorial">Tutorial</option>
                                <option value="article">Article</option>
                                <option value="video">Video</option>
                                <option value="podcast">Podcast</option>
                                <option value="workshop">Workshop</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Web Development"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                            <input
                                type="text"
                                value={formData.platform}
                                onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Coursera, YouTube"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as LearningItem['difficulty'] }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Spent (minutes)</label>
                            <input
                                type="number"
                                value={formData.timeSpent}
                                onChange={(e) => setFormData(prev => ({ ...prev, timeSpent: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="60"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Key takeaways, concepts learned..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Link</label>
                            <input
                                type="url"
                                value={formData.resourceLink}
                                onChange={(e) => setFormData(prev => ({ ...prev, resourceLink: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isRevision"
                                checked={formData.isRevision}
                                onChange={(e) => setFormData(prev => ({ ...prev, isRevision: e.target.checked }))}
                                className="mr-2"
                            />
                            <label htmlFor="isRevision" className="text-sm text-gray-700">
                                Add to revision schedule
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleAddLearning}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                            Add Learning Item
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learning;
