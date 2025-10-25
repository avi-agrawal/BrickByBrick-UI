import React from 'react';
import { useNotification } from './NotificationContext';
import { notificationService } from '../utils/notificationService';
import {
    CheckCircle,
    AlertCircle,
    Info,
    XCircle,
    Database,
    User,
    Settings,
    Download,
    Trash2,
    Edit
} from 'lucide-react';

const NotificationDemo: React.FC = () => {
    const { showSuccess, showError, showWarning, showInfo, clearAllNotifications } = useNotification();

    const handleBasicNotifications = () => {
        showSuccess('Success!', 'This is a success notification');
        setTimeout(() => showError('Error!', 'This is an error notification'), 500);
        setTimeout(() => showWarning('Warning!', 'This is a warning notification'), 1000);
        setTimeout(() => showInfo('Info!', 'This is an info notification'), 1500);
    };

    const handleCrudNotifications = () => {
        // Simulate CRUD operations
        notificationService.showCreateSuccess('Problem', 'Two Sum problem has been added successfully');
        setTimeout(() => notificationService.showUpdateSuccess('Learning Item', 'React Tutorial progress updated'), 1000);
        setTimeout(() => notificationService.showDeleteSuccess('Revision Item', 'Old notes have been removed'), 2000);
        setTimeout(() => notificationService.showReadError('Analytics Data', 'Failed to load performance metrics'), 3000);
    };

    const handleAuthNotifications = () => {
        notificationService.showLoginSuccess('John Doe');
        setTimeout(() => notificationService.showSignupSuccess('Jane Smith'), 1000);
        setTimeout(() => notificationService.showLogoutSuccess(), 2000);
        setTimeout(() => notificationService.showLoginError('Invalid credentials'), 3000);
    };

    const handleProgressNotifications = () => {
        notificationService.showProgressUpdate('React Course', 75);
        setTimeout(() => notificationService.showStatusChange('Problem', 'In Progress', 'Completed'), 1000);
        setTimeout(() => notificationService.showFormSaveSuccess('Learning Form'), 2000);
    };

    const handleNetworkNotifications = () => {
        notificationService.showNetworkError();
        setTimeout(() => notificationService.showServerError('Database connection failed'), 1000);
        setTimeout(() => notificationService.showOfflineMode(), 2000);
    };

    const handleNotificationsWithActions = () => {
        showSuccess(
            'Export Completed',
            'Your data has been exported successfully.',
            {
                duration: 0, // Don't auto-dismiss
                action: {
                    label: 'Download File',
                    onClick: () => {
                        // Simulate download
                        showInfo('Download Started', 'Your file download has started');
                    }
                }
            }
        );
    };

    const handleLongNotifications = () => {
        showInfo(
            'System Maintenance',
            'We will be performing scheduled maintenance on our servers tonight from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable. We apologize for any inconvenience.',
            { duration: 10000 }
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification System Demo</h2>
                <p className="text-gray-600">Test different types of notifications and their behaviors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Basic Notifications */}
                <button
                    onClick={handleBasicNotifications}
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Basic Notifications</div>
                        <div className="text-sm text-gray-600">Test all notification types</div>
                    </div>
                </button>

                {/* CRUD Notifications */}
                <button
                    onClick={handleCrudNotifications}
                    className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">CRUD Operations</div>
                        <div className="text-sm text-gray-600">Create, Update, Delete, Read</div>
                    </div>
                </button>

                {/* Auth Notifications */}
                <button
                    onClick={handleAuthNotifications}
                    className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Authentication</div>
                        <div className="text-sm text-gray-600">Login, Signup, Logout</div>
                    </div>
                </button>

                {/* Progress Notifications */}
                <button
                    onClick={handleProgressNotifications}
                    className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Progress Updates</div>
                        <div className="text-sm text-gray-600">Status changes and progress</div>
                    </div>
                </button>

                {/* Network Notifications */}
                <button
                    onClick={handleNetworkNotifications}
                    className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Network Issues</div>
                        <div className="text-sm text-gray-600">Connection and server errors</div>
                    </div>
                </button>

                {/* Notifications with Actions */}
                <button
                    onClick={handleNotificationsWithActions}
                    className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">With Actions</div>
                        <div className="text-sm text-gray-600">Interactive notifications</div>
                    </div>
                </button>

                {/* Long Notifications */}
                <button
                    onClick={handleLongNotifications}
                    className="flex items-center gap-3 p-4 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                        <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Long Messages</div>
                        <div className="text-sm text-gray-600">Extended notification content</div>
                    </div>
                </button>

                {/* Clear All */}
                <button
                    onClick={clearAllNotifications}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">Clear All</div>
                        <div className="text-sm text-gray-600">Remove all notifications</div>
                    </div>
                </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Notification Features:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Auto-dismiss with customizable duration</li>
                    <li>• Manual dismiss with close button</li>
                    <li>• Progress bar showing remaining time</li>
                    <li>• Smooth slide-in animations</li>
                    <li>• Hover effects and transitions</li>
                    <li>• Action buttons for interactive notifications</li>
                    <li>• Different types: Success, Error, Warning, Info</li>
                    <li>• Responsive design for all screen sizes</li>
                </ul>
            </div>
        </div>
    );
};

export default NotificationDemo;
