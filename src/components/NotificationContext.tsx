import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number; // Auto-dismiss duration in ms (0 = no auto-dismiss)
    action?: {
        label: string;
        onClick: () => void;
    };
}

// Notification State
interface NotificationState {
    notifications: Notification[];
}

// Notification Actions
type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string }
    | { type: 'CLEAR_ALL_NOTIFICATIONS' };

// Initial State
const initialState: NotificationState = {
    notifications: [],
};

// Reducer
const notificationReducer = (
    state: NotificationState,
    action: NotificationAction
): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
            };
        case 'CLEAR_ALL_NOTIFICATIONS':
            return {
                ...state,
                notifications: [],
            };
        default:
            return state;
    }
};

// Context
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
    // Convenience methods for different notification types
    showSuccess: (title: string, message: string, options?: Partial<Notification>) => void;
    showError: (title: string, message: string, options?: Partial<Notification>) => void;
    showWarning: (title: string, message: string, options?: Partial<Notification>) => void;
    showInfo: (title: string, message: string, options?: Partial<Notification>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider Component
interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, initialState);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };

        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

        // Auto-remove notification after duration (if specified)
        if (notification.duration !== 0) {
            const duration = notification.duration || 5000; // Default 5 seconds
            setTimeout(() => {
                dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
            }, duration);
        }
    };

    const removeNotification = (id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };

    const clearAllNotifications = () => {
        dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
    };

    // Convenience methods
    const showSuccess = (title: string, message: string, options?: Partial<Notification>) => {
        addNotification({
            type: 'success',
            title,
            message,
            duration: 4000,
            ...options,
        });
    };

    const showError = (title: string, message: string, options?: Partial<Notification>) => {
        addNotification({
            type: 'error',
            title,
            message,
            duration: 0, // Errors don't auto-dismiss
            ...options,
        });
    };

    const showWarning = (title: string, message: string, options?: Partial<Notification>) => {
        addNotification({
            type: 'warning',
            title,
            message,
            duration: 6000,
            ...options,
        });
    };

    const showInfo = (title: string, message: string, options?: Partial<Notification>) => {
        addNotification({
            type: 'info',
            title,
            message,
            duration: 5000,
            ...options,
        });
    };

    const contextValue: NotificationContextType = {
        notifications: state.notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

// Hook to use notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Notification Container Component
const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getNotificationStyles = (type: NotificationType) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification-enter notification-hover ${getNotificationStyles(
                        notification.type
                    )} border rounded-lg shadow-lg p-4 relative transition-all duration-300 ease-in-out`}
                    style={{
                        '--duration': notification.duration ? `${notification.duration}ms` : '5000ms'
                    } as React.CSSProperties}
                >
                    {/* Progress bar */}
                    {notification.duration && notification.duration > 0 && (
                        <div className={`notification-progress notification-progress-${notification.type} absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg`} />
                    )}

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold mb-1">
                                {notification.title}
                            </h4>
                            <p className="text-sm opacity-90">
                                {notification.message}
                            </p>
                            {notification.action && (
                                <button
                                    onClick={notification.action.onClick}
                                    className="mt-2 text-sm font-medium underline hover:no-underline transition-colors"
                                >
                                    {notification.action.label}
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationContext;
