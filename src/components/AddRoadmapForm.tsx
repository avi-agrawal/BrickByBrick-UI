import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddRoadmapFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const AddRoadmapForm: React.FC<AddRoadmapFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: '#3B82F6',
        isPublic: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const colorOptions = [
        { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
        { value: '#10B981', label: 'Green', class: 'bg-green-500' },
        { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
        { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
        { value: '#F59E0B', label: 'Yellow', class: 'bg-yellow-500' },
        { value: '#6B7280', label: 'Gray', class: 'bg-gray-500' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Create New Roadmap</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Frontend Development, Data Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe what this roadmap covers..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                            <label key={color.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name="color"
                                    value={color.value}
                                    checked={formData.color === color.value}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className={`w-8 h-8 rounded-full ${color.class} cursor-pointer border-2 transition-all ${formData.color === color.value ? 'border-gray-900' : 'border-transparent hover:border-gray-400'
                                    }`} />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                        Make this roadmap public
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Roadmap
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoadmapForm;
