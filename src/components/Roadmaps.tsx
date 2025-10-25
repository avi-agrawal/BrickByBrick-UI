import React, { useState, useEffect } from 'react';
import { Map, Plus, BookOpen, Target, TrendingUp, CheckCircle, Clock, Edit3, Trash2, ArrowLeft, Calendar, BarChart3, Star } from 'lucide-react';
import type { Roadmap, Topic, Subtopic, RoadmapProgress } from '../types';
import { apiClient } from '../utils/apis';
import { AuthContext } from './AuthContext';

interface RoadmapsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Roadmaps: React.FC<RoadmapsProps> = ({ activeTab, onTabChange }) => {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [showSubtopicForm, setShowSubtopicForm] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [editingItem, setEditingItem] = useState<{ type: 'topic' | 'subtopic', id: string } | null>(null);

    // Form data
    const [roadmapFormData, setRoadmapFormData] = useState({
        title: '',
        description: '',
        color: '#3B82F6'
    });
    const [topicFormData, setTopicFormData] = useState({
        title: '',
        description: ''
    });
    const [subtopicFormData, setSubtopicFormData] = useState({
        title: '',
        description: '',
        difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
        estimatedTime: ''
    });

    const { user } = React.useContext(AuthContext);

    // Load roadmaps
    const loadRoadmaps = async () => {
        if (!user?.id) return;

        try {
            const response = await apiClient.getRoadmaps(user.id);
            if (response.success) {
                setRoadmaps(response.data);
            }
        } catch (error) {
            console.error('Error loading roadmaps:', error);
        }
    };

    // Load specific roadmap
    const loadRoadmap = async (roadmapId: string) => {
        try {
            const response = await apiClient.getRoadmap(roadmapId);
            if (response.success) {
                setSelectedRoadmap(response.data);
            }
        } catch (error) {
            console.error('Error loading roadmap:', error);
        }
    };

    // Create roadmap
    const handleCreateRoadmap = async () => {
        if (!roadmapFormData.title || !user?.id) return;

        try {
            const response = await apiClient.createRoadmap(roadmapFormData, { id: user.id });
            if (response.success) {
                loadRoadmaps();
                setShowCreateForm(false);
                setRoadmapFormData({ title: '', description: '', color: '#3B82F6' });
            }
        } catch (error) {
            console.error('Error creating roadmap:', error);
        }
    };

    // Create topic
    const handleCreateTopic = async () => {
        if (!topicFormData.title || !selectedRoadmap?.id) return;

        try {
            const response = await apiClient.createTopic(topicFormData, selectedRoadmap.id);
            if (response.success) {
                await loadRoadmap(selectedRoadmap.id);
                setShowTopicForm(false);
                setTopicFormData({ title: '', description: '' });
            }
        } catch (error) {
            console.error('Error creating topic:', error);
        }
    };

    // Create subtopic
    const handleCreateSubtopic = async () => {
        if (!subtopicFormData.title || !selectedTopic?.id) return;

        try {
            const response = await apiClient.createSubtopic({
                ...subtopicFormData,
                estimatedTime: subtopicFormData.estimatedTime ? parseInt(subtopicFormData.estimatedTime) : null
            }, selectedTopic.id);
            if (response.success) {
                if (selectedRoadmap) {
                    await loadRoadmap(selectedRoadmap.id);
                }
                setShowSubtopicForm(false);
                setSubtopicFormData({ title: '', description: '', difficulty: 'beginner', estimatedTime: '' });
                setSelectedTopic(null);
            }
        } catch (error) {
            console.error('Error creating subtopic:', error);
        }
    };

    // Toggle completion
    const handleCompleteTopic = async (topic: Topic) => {
        try {
            if (topic.isCompleted) {
                await apiClient.uncompleteTopic(topic.id);
            } else {
                await apiClient.completeTopic(topic.id);
            }
            if (selectedRoadmap) {
                await loadRoadmap(selectedRoadmap.id);
            }
        } catch (error) {
            console.error('Error toggling topic completion:', error);
        }
    };

    const handleCompleteSubtopic = async (subtopic: Subtopic) => {
        try {
            if (subtopic.isCompleted) {
                await apiClient.uncompleteSubtopic(subtopic.id);
            } else {
                await apiClient.completeSubtopic(subtopic.id);
            }
            if (selectedRoadmap) {
                await loadRoadmap(selectedRoadmap.id);
            }
        } catch (error) {
            console.error('Error toggling subtopic completion:', error);
        }
    };

    // Calculate progress
    const calculateProgress = (roadmap: Roadmap): RoadmapProgress => {
        if (!roadmap || !roadmap.topics) {
            return {
                totalTopics: 0,
                completedTopics: 0,
                totalSubtopics: 0,
                completedSubtopics: 0,
                overallProgress: 0
            };
        }

        const totalTopics = roadmap.topics.length;
        const completedTopics = roadmap.topics.filter(topic => topic && topic.isCompleted).length;

        const totalSubtopics = roadmap.topics.reduce((sum, topic) => sum + (topic.totalSubtopics || 0), 0);
        const completedSubtopics = roadmap.topics.reduce((sum, topic) => sum + (topic.completedSubtopics || 0), 0);

        // Calculate overall progress based on all items (topics + subtopics)
        const totalItems = totalTopics + totalSubtopics;
        const completedItems = completedTopics + completedSubtopics;
        const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        return {
            totalTopics,
            completedTopics,
            totalSubtopics,
            completedSubtopics,
            overallProgress
        };
    };

    // Get difficulty color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-600 bg-green-100';
            case 'intermediate': return 'text-yellow-600 bg-yellow-100';
            case 'advanced': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        loadRoadmaps();
    }, [user?.id]);

    if (activeTab !== 'roadmaps') {
        return null;
    }

    // If a roadmap is selected, show the individual roadmap page
    if (selectedRoadmap) {
        const progress = calculateProgress(selectedRoadmap);

        return (
            <div className="space-y-6">
                {/* Header with back button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedRoadmap(null)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Roadmaps
                    </button>
                </div>

                {/* Roadmap Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: selectedRoadmap.color }}
                                ></div>
                                <h1 className="text-2xl font-bold text-gray-900">{selectedRoadmap.title}</h1>
                            </div>
                            {selectedRoadmap.description && (
                                <p className="text-gray-600 mb-4">{selectedRoadmap.description}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Last visited: {selectedRoadmap.lastVisited ? new Date(selectedRoadmap.lastVisited).toLocaleDateString() : 'Never'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{Math.round(progress.overallProgress)}%</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="h-5 w-5 text-green-600" />
                                <span className="text-sm font-medium text-gray-700">Topics</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{progress.completedTopics}/{progress.totalTopics}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="h-5 w-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-700">Subtopics</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{progress.completedSubtopics}/{progress.totalSubtopics}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-5 w-5 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                {progress.totalSubtopics > 0 ? Math.round((progress.completedSubtopics / progress.totalSubtopics) * 100) : 0}%
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Overall Progress</span>
                            <span>{Math.round(progress.overallProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress.overallProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Topics */}
                <div className="space-y-4">
                    {selectedRoadmap.topics.map((topic) => (
                        <div key={topic.id} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleCompleteTopic(topic)}
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${topic.isCompleted
                                            ? 'bg-blue-500 border-blue-500 text-white shadow-md'
                                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        {topic.isCompleted ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                        )}
                                    </button>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${topic.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                            {topic.title}
                                        </h3>
                                        {topic.description && (
                                            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Topic Progress */}
                                    <div className="text-sm text-gray-600">
                                        {topic.completedSubtopics || 0}/{topic.totalSubtopics || 0} subtopics
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedTopic(topic);
                                            setShowSubtopicForm(true);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Subtopic
                                    </button>
                                </div>
                            </div>

                            {/* Subtopics */}
                            {topic.subtopics && topic.subtopics.length > 0 && (
                                <div className="ml-8 space-y-2">
                                    {topic.subtopics.map((subtopic) => (
                                        <div key={subtopic.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <button
                                                onClick={() => handleCompleteSubtopic(subtopic)}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${subtopic.isCompleted
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                                                    }`}
                                            >
                                                {subtopic.isCompleted ? (
                                                    <CheckCircle className="h-3 w-3" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-medium ${subtopic.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                        {subtopic.title}
                                                    </span>
                                                    {subtopic.difficulty && (
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(subtopic.difficulty)}`}>
                                                            {subtopic.difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                                {subtopic.description && (
                                                    <p className="text-xs text-gray-600 mt-1">{subtopic.description}</p>
                                                )}
                                                {subtopic.estimatedTime && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Clock className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">{subtopic.estimatedTime} min</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Topic Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowTopicForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Topic
                    </button>
                </div>

                {/* Create Topic Form */}
                {showTopicForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Topic to {selectedRoadmap.title}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={topicFormData.title}
                                        onChange={(e) => setTopicFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Arrays"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={topicFormData.description}
                                        onChange={(e) => setTopicFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Brief description of this topic..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleCreateTopic}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Topic
                                </button>
                                <button
                                    onClick={() => setShowTopicForm(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Subtopic Form */}
                {showSubtopicForm && selectedTopic && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Add Subtopic to "{selectedTopic.title}"
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={subtopicFormData.title}
                                        onChange={(e) => setSubtopicFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., Two Pointers"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={subtopicFormData.description}
                                        onChange={(e) => setSubtopicFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Brief description of this subtopic..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                        <select
                                            value={subtopicFormData.difficulty}
                                            onChange={(e) => setSubtopicFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Est. Time (min)</label>
                                        <input
                                            type="number"
                                            value={subtopicFormData.estimatedTime}
                                            onChange={(e) => setSubtopicFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button
                                    onClick={handleCreateSubtopic}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add Subtopic
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSubtopicForm(false);
                                        setSelectedTopic(null);
                                    }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Main roadmaps list view
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Map className="h-6 w-6 text-blue-600" />
                        Learning Roadmaps
                    </h1>
                    <p className="text-gray-600 mt-1">Create and track your learning paths</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Roadmap
                </button>
            </div>

            {/* Roadmaps Grid */}
            {roadmaps.length === 0 ? (
                <div className="text-center py-12">
                    <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No roadmaps yet</h3>
                    <p className="text-gray-600 mb-4">Create your first learning roadmap to get started</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Create Roadmap
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap) => {
                        const progress = calculateProgress(roadmap);
                        return (
                            <div
                                key={roadmap.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => loadRoadmap(roadmap.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{roadmap.title}</h3>
                                        {roadmap.description && (
                                            <p className="text-sm text-gray-600 mb-2">{roadmap.description}</p>
                                        )}
                                    </div>
                                    <div
                                        className="w-4 h-4 rounded-full ml-2"
                                        style={{ backgroundColor: roadmap.color }}
                                    ></div>
                                </div>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>Progress</span>
                                        <span>{Math.round(progress.overallProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${progress.overallProgress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">{progress.completedTopics}/{progress.totalTopics}</div>
                                        <div className="text-xs text-gray-600">Topics</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">{progress.completedSubtopics}/{progress.totalSubtopics}</div>
                                        <div className="text-xs text-gray-600">Subtopics</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {progress.totalSubtopics > 0 ? Math.round((progress.completedSubtopics / progress.totalSubtopics) * 100) : 0}%
                                        </div>
                                        <div className="text-xs text-gray-600">Complete</div>
                                    </div>
                                </div>

                                {/* Last Visited */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        Last visited: {roadmap.lastVisited ? new Date(roadmap.lastVisited).toLocaleDateString() : 'Never'}
                                    </span>
                                </div>

                                {/* Topics Preview */}
                                <div className="space-y-2">
                                    {roadmap.topics.slice(0, 2).map((topic) => (
                                        <div key={topic.id} className="flex items-center gap-2 text-sm">
                                            <div className={`w-2 h-2 rounded-full ${topic.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className={topic.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}>
                                                {topic.title}
                                            </span>
                                        </div>
                                    ))}
                                    {roadmap.topics.length > 2 && (
                                        <div className="text-xs text-gray-500">
                                            +{roadmap.topics.length - 2} more topics
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <span className="text-sm text-blue-600 font-medium">Click to open →</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Roadmap Form */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Roadmap</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={roadmapFormData.title}
                                    onChange={(e) => setRoadmapFormData(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Data Structures & Algorithms"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={roadmapFormData.description}
                                    onChange={(e) => setRoadmapFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Brief description of this roadmap..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        '#3B82F6', // Blue
                                        '#EF4444', // Red
                                        '#10B981', // Green
                                        '#F59E0B', // Amber
                                        '#8B5CF6', // Purple
                                        '#EC4899', // Pink
                                        '#06B6D4', // Cyan
                                        '#84CC16', // Lime
                                        '#F97316'  // Orange
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setRoadmapFormData(prev => ({ ...prev, color }))}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${roadmapFormData.color === color
                                                ? 'border-gray-400 scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={`Select ${color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleCreateRoadmap}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create Roadmap
                            </button>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roadmaps;