import type { Notification } from '../components/NotificationContext';

// Notification service for CRUD operations
export class NotificationService {
    private static instance: NotificationService;
    private notificationHandler: ((notification: Omit<Notification, 'id'>) => void) | null = null;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Set the notification handler (called by NotificationProvider)
    public setNotificationHandler(handler: (notification: Omit<Notification, 'id'>) => void) {
        this.notificationHandler = handler;
    }

    private showNotification(notification: Omit<Notification, 'id'>) {
        if (this.notificationHandler) {
            this.notificationHandler(notification);
        }
    }

    // CRUD Operation Notifications
    public showCreateSuccess(entity: string, details?: string) {
        this.showNotification({
            type: 'success',
            title: `${entity} Created`,
            message: details || `${entity} has been successfully created.`,
            duration: 4000,
        });
    }

    public showCreateError(entity: string, error?: string) {
        this.showNotification({
            type: 'error',
            title: `Failed to Create ${entity}`,
            message: error || `There was an error creating the ${entity.toLowerCase()}. Please try again.`,
            duration: 0,
        });
    }

    public showUpdateSuccess(entity: string, details?: string) {
        this.showNotification({
            type: 'success',
            title: `${entity} Updated`,
            message: details || `${entity} has been successfully updated.`,
            duration: 4000,
        });
    }

    public showUpdateError(entity: string, error?: string) {
        this.showNotification({
            type: 'error',
            title: `Failed to Update ${entity}`,
            message: error || `There was an error updating the ${entity.toLowerCase()}. Please try again.`,
            duration: 0,
        });
    }

    public showDeleteSuccess(entity: string, details?: string) {
        this.showNotification({
            type: 'success',
            title: `${entity} Deleted`,
            message: details || `${entity} has been successfully deleted.`,
            duration: 4000,
        });
    }

    public showDeleteError(entity: string, error?: string) {
        this.showNotification({
            type: 'error',
            title: `Failed to Delete ${entity}`,
            message: error || `There was an error deleting the ${entity.toLowerCase()}. Please try again.`,
            duration: 0,
        });
    }

    public showReadError(entity: string, error?: string) {
        this.showNotification({
            type: 'error',
            title: `Failed to Load ${entity}`,
            message: error || `There was an error loading the ${entity.toLowerCase()}. Please try again.`,
            duration: 0,
        });
    }

    // Authentication Notifications
    public showLoginSuccess(userName?: string) {
        this.showNotification({
            type: 'success',
            title: 'Welcome Back!',
            message: userName ? `Welcome back, ${userName}!` : 'You have successfully logged in.',
            duration: 4000,
        });
    }

    public showLoginError(error?: string) {
        this.showNotification({
            type: 'error',
            title: 'Login Failed',
            message: error || 'Invalid email or password. Please try again.',
            duration: 0,
        });
    }

    public showLogoutSuccess() {
        this.showNotification({
            type: 'info',
            title: 'Logged Out',
            message: 'You have been successfully logged out.',
            duration: 3000,
        });
    }

    public showSignupSuccess(userName?: string) {
        this.showNotification({
            type: 'success',
            title: 'Account Created!',
            message: userName ? `Welcome, ${userName}! Your account has been created.` : 'Your account has been successfully created.',
            duration: 5000,
        });
    }

    public showSignupError(error?: string) {
        this.showNotification({
            type: 'error',
            title: 'Signup Failed',
            message: error || 'There was an error creating your account. Please try again.',
            duration: 0,
        });
    }

    // Progress and Status Notifications
    public showProgressUpdate(entity: string, progress: number) {
        this.showNotification({
            type: 'info',
            title: `${entity} Progress Updated`,
            message: `Progress updated to ${progress}%.`,
            duration: 3000,
        });
    }

    public showStatusChange(entity: string, oldStatus: string, newStatus: string) {
        this.showNotification({
            type: 'info',
            title: `${entity} Status Changed`,
            message: `Status changed from ${oldStatus} to ${newStatus}.`,
            duration: 4000,
        });
    }

    // Validation and Form Notifications
    public showValidationError(field: string, message?: string) {
        this.showNotification({
            type: 'warning',
            title: 'Validation Error',
            message: message || `Please check the ${field} field.`,
            duration: 5000,
        });
    }

    public showFormSaveSuccess(formName: string) {
        this.showNotification({
            type: 'success',
            title: 'Form Saved',
            message: `${formName} has been saved successfully.`,
            duration: 3000,
        });
    }

    public showFormResetSuccess(formName: string) {
        this.showNotification({
            type: 'info',
            title: 'Form Reset',
            message: `${formName} has been reset to default values.`,
            duration: 3000,
        });
    }

    // Network and Connection Notifications
    public showNetworkError() {
        this.showNotification({
            type: 'error',
            title: 'Connection Error',
            message: 'Please check your internet connection and try again.',
            duration: 0,
        });
    }

    public showServerError(error?: string) {
        this.showNotification({
            type: 'error',
            title: 'Server Error',
            message: error || 'Something went wrong on our end. Please try again later.',
            duration: 0,
        });
    }

    public showOfflineMode() {
        this.showNotification({
            type: 'warning',
            title: 'Offline Mode',
            message: 'You are currently offline. Some features may be limited.',
            duration: 0,
        });
    }

    // Generic Notifications
    public showSuccess(title: string, message: string, duration?: number) {
        this.showNotification({
            type: 'success',
            title,
            message,
            duration: duration || 4000,
        });
    }

    public showError(title: string, message: string) {
        this.showNotification({
            type: 'error',
            title,
            message,
            duration: 0,
        });
    }

    public showWarning(title: string, message: string, duration?: number) {
        this.showNotification({
            type: 'warning',
            title,
            message,
            duration: duration || 6000,
        });
    }

    public showInfo(title: string, message: string, duration?: number) {
        this.showNotification({
            type: 'info',
            title,
            message,
            duration: duration || 5000,
        });
    }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Helper function to handle API errors
export const handleApiError = (error: any, operation: string, entity: string) => {
    const notificationService = NotificationService.getInstance();

    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Unknown error occurred';

        switch (status) {
            case 400:
                notificationService.showValidationError(entity, message);
                break;
            case 401:
                notificationService.showLoginError('Your session has expired. Please log in again.');
                break;
            case 403:
                notificationService.showError('Access Denied', 'You do not have permission to perform this action.');
                break;
            case 404:
                notificationService.showError('Not Found', `${entity} not found.`);
                break;
            case 409:
                notificationService.showWarning('Conflict', message);
                break;
            case 422:
                notificationService.showValidationError(entity, message);
                break;
            case 500:
                notificationService.showServerError(message);
                break;
            default:
                notificationService.showError(`${operation} Failed`, message);
        }
    } else if (error.request) {
        // Network error
        notificationService.showNetworkError();
    } else {
        // Other error
        notificationService.showError(`${operation} Failed`, error.message || 'An unexpected error occurred');
    }
};

// Helper function to handle CRUD operation results
export const handleCrudResult = (
    result: any,
    operation: 'create' | 'update' | 'delete' | 'read',
    entity: string,
    successMessage?: string
) => {
    const notificationService = NotificationService.getInstance();

    if (result.success) {
        switch (operation) {
            case 'create':
                notificationService.showCreateSuccess(entity, successMessage);
                break;
            case 'update':
                notificationService.showUpdateSuccess(entity, successMessage);
                break;
            case 'delete':
                notificationService.showDeleteSuccess(entity, successMessage);
                break;
            case 'read':
                // Usually no notification for successful reads
                break;
        }
    } else {
        const errorMessage = result.message || result.error;
        switch (operation) {
            case 'create':
                notificationService.showCreateError(entity, errorMessage);
                break;
            case 'update':
                notificationService.showUpdateError(entity, errorMessage);
                break;
            case 'delete':
                notificationService.showDeleteError(entity, errorMessage);
                break;
            case 'read':
                notificationService.showReadError(entity, errorMessage);
                break;
        }
    }
};
