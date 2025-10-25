import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../utils/apis';
import { AuthContext } from './AuthContext';

interface AddRevisionFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const AddRevisionForm: React.FC<AddRevisionFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        itemId: '',
        itemType: 'problem' as const,
        nextRevisionDate: ''
    });
    const [problems, setProblems] = useState<any[]>([]);
    const [learningItems, setLearningItems] = useState<any[]>([]);
    const { user } = React.useContext(AuthContext);

    useEffect(() => {
        const fetchItems = async () => {
            if (!user?.id) return;

            try {
                const [problemsRes, learningRes] = await Promise.all([
                    apiClient.getProblems(user.id),
                    apiClient.getLearningItems(user.id)
                ]);
                setProblems(problemsRes.data || []);
                setLearningItems(learningRes.data || []);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [user?.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getAvailableItems = () => {
        if (formData.itemType === 'problem') {
            return problems;
        } else {
            return learningItems;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Add Revision Item</h2>
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
                        Item Type *
                    </label>
                    <select
                        name="itemType"
                        value={formData.itemType}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="problem">Problem</option>
                        <option value="learning">Learning Item</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Item *
                    </label>
                    <select
                        name="itemId"
                        value={formData.itemId}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Choose an item...</option>
                        {getAvailableItems().map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title} ({item.difficulty || item.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Revision Date *
                    </label>
                    <input
                        type="date"
                        name="nextRevisionDate"
                        value={formData.nextRevisionDate}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                        Add Revision Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRevisionForm;
