import React, { useState } from 'react';
import { Save, Loader2, FileText, X, Zap, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import type { NewProblemForm } from '../types';
import { apiClient } from '../utils/apis';
import { AuthContext } from './AuthContext';
import { useNotification } from './NotificationContext';

interface AddProblemFormProps {
  onSubmit: (data: NewProblemForm) => void;
}

const AddProblemForm: React.FC<AddProblemFormProps> = ({ onSubmit }) => {
  const { user } = React.useContext(AuthContext);
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [formData, setFormData] = useState<NewProblemForm>({
    title: '',
    platform: '',
    difficulty: '',
    topic: '',
    subtopic: '',
    outcome: '',
    timeSpent: 0,
    link: '',
    tags: [],
    approachNotes: '',
    isRevision: false,
    codeLink: '',
  });

  // Smart selection data
  const platforms = ['LeetCode', 'HackerRank', 'CodeChef', 'Codeforces', 'AtCoder', 'InterviewBit'];
  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600', icon: CheckCircle },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', icon: AlertCircle },
    { value: 'hard', label: 'Hard', color: 'text-red-600', icon: XCircle }
  ];
  const topics = [
    'Arrays', 'Strings', 'Hash Table', 'Dynamic Programming', 'Tree', 'Graph',
    'Binary Search', 'Two Pointers', 'Sliding Window', 'Stack', 'Queue', 'Heap'
  ];
  const outcomes = [
    { value: 'solved', label: 'Solved', color: 'text-green-600', icon: CheckCircle },
    { value: 'hints', label: 'With Hints', color: 'text-yellow-600', icon: AlertCircle },
    { value: 'failed', label: 'Failed', color: 'text-red-600', icon: XCircle }
  ];
  const quickTimes = [5, 10, 15, 30, 45, 60, 90, 120];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (user && user.id) {
      try {
        // Create problem using API client
        await apiClient.createProblem(formData, { id: user.id });

        // Show success notification
        showSuccess(
          'Problem Added Successfully',
          `"${formData.title}" has been logged to your problem tracker.`
        );

        onSubmit(formData);
      } catch (error) {
        console.error('Error creating problem:', error);
        showError(
          'Failed to Add Problem',
          'There was an error saving your problem. Please try again.'
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Reset form
    setFormData({
      title: '',
      platform: '',
      difficulty: '',
      topic: '',
      subtopic: '',
      outcome: '',
      timeSpent: 0,
      link: '',
      tags: [],
      approachNotes: '',
      isRevision: false,
      codeLink: '',
    });

    setIsSubmitting(false);
  };

  const validTitleRegex = /^[a-zA-Z0-9\s\-_,\.;:()]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'title') {
      if (value && !validTitleRegex.test(value)) {
        setIsValidTitle(false);
      } else {
        setIsValidTitle(true);
      }
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isRevision: e.target.checked
    }));
  };

  // Smart selection handlers
  const handlePlatformSelect = (platform: string) => {
    setFormData(prev => ({ ...prev, platform }));
  };

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setFormData(prev => ({ ...prev, difficulty }));
  };

  const handleTopicSelect = (topic: string) => {
    setFormData(prev => ({ ...prev, topic }));
  };

  const handleOutcomeSelect = (outcome: 'solved' | 'hints' | 'failed') => {
    setFormData(prev => ({ ...prev, outcome }));
  };

  const handleQuickTimeSelect = (time: number) => {
    setFormData(prev => ({ ...prev, timeSpent: time }));
  };

  // Quick fill for common scenarios
  const quickFill = (scenario: string) => {
    switch (scenario) {
      case 'leetcode-easy':
        setFormData(prev => ({ ...prev, platform: 'LeetCode', difficulty: 'easy', outcome: 'solved', timeSpent: 15 }));
        break;
      case 'leetcode-medium':
        setFormData(prev => ({ ...prev, platform: 'LeetCode', difficulty: 'medium', outcome: 'solved', timeSpent: 30 }));
        break;
      case 'leetcode-hard':
        setFormData(prev => ({ ...prev, platform: 'LeetCode', difficulty: 'hard', outcome: 'hints', timeSpent: 60 }));
        break;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={20} className="text-gray-600" />
          Log New Problem
        </h2>
        <button
          type="button"
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          <Zap size={16} />
          Quick Fill
        </button>
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => quickFill('leetcode-easy')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
            >
              <CheckCircle size={20} className="text-green-600" />
              LeetCode Easy
            </button>
            <button
              onClick={() => quickFill('leetcode-medium')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
            >
              <AlertCircle size={20} className="text-yellow-600" />
              LeetCode Medium
            </button>
            <button
              onClick={() => quickFill('leetcode-hard')}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            >
              <XCircle size={20} className="text-red-600" />
              LeetCode Hard
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Problem Title - Most Important */}
          <div>
            <label htmlFor="title" className={`block text-sm font-medium mb-2 ${!isValidTitle ? 'text-red-600' : 'text-gray-700'}`}>
              Problem Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Two Sum"
              required
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!isValidTitle ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            />
          </div>

          {/* Smart Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformSelect(platform)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${formData.platform === platform
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
            <div className="flex gap-3">
              {difficulties.map((diff) => {
                const IconComponent = diff.icon;
                return (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => handleDifficultySelect(diff.value as 'easy' | 'medium' | 'hard')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${formData.difficulty === diff.value
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <IconComponent size={20} className={formData.difficulty === diff.value ? diff.color : 'text-gray-500'} />
                    {diff.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${formData.topic === topic
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-topic (Optional) */}
          <div>
            <label htmlFor="subtopic" className="block text-sm font-medium text-gray-700 mb-2">
              Sub-topic (Optional)
            </label>
            <input
              type="text"
              id="subtopic"
              name="subtopic"
              value={formData.subtopic}
              onChange={handleChange}
              placeholder="e.g., Sliding Window, Two Pointers"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Smart Outcome Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Outcome *</label>
            <div className="flex gap-3">
              {outcomes.map((outcome) => {
                const IconComponent = outcome.icon;
                return (
                  <button
                    key={outcome.value}
                    type="button"
                    onClick={() => handleOutcomeSelect(outcome.value as 'solved' | 'hints' | 'failed')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${formData.outcome === outcome.value
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <IconComponent size={20} className={formData.outcome === outcome.value ? outcome.color : 'text-gray-500'} />
                    {outcome.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Taken (minutes) *</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleQuickTimeSelect(time)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${formData.timeSpent === time
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {time}m
                </button>
              ))}
            </div>
            <input
              type="number"
              id="timeSpent"
              name="timeSpent"
              value={formData.timeSpent || ''}
              onChange={handleChange}
              placeholder="Enter custom time"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Optional Fields - Collapsible */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Additional Details (Optional)</h3>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => setShowQuickActions(!showQuickActions)}
              >
                {showQuickActions ? 'Hide' : 'Show'} Details
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Link
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags/Keywords
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="two pointers, binary search, recursion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="approachNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Approach Notes
                </label>
                <textarea
                  id="approachNotes"
                  name="approachNotes"
                  value={formData.approachNotes}
                  onChange={handleChange}
                  placeholder="Describe your approach, edge cases, time/space complexity..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="codeLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Solution Link
                  </label>
                  <input
                    type="url"
                    id="codeLink"
                    name="codeLink"
                    value={formData.codeLink}
                    onChange={handleChange}
                    placeholder="GitHub Gist URL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isRevision"
                      checked={formData.isRevision}
                      onChange={handleCheckboxChange}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isRevision" className="text-sm text-gray-700">
                      Add to revision schedule
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isValidTitle || !formData.platform || !formData.difficulty || !formData.topic || !formData.outcome}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Problem
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                title: '',
                platform: '',
                difficulty: '',
                topic: '',
                subtopic: '',
                outcome: '',
                timeSpent: 0,
                link: '',
                tags: [],
                approachNotes: '',
                isRevision: false,
                codeLink: '',
              })}
              className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProblemForm;