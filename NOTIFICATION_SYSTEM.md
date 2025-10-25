# Global Notification System

A comprehensive notification system for the Code Tracker Dashboard that provides real-time feedback for all CRUD operations and user interactions.

## Features

### 🎯 Core Functionality
- **Global State Management**: Centralized notification state using React Context
- **Multiple Notification Types**: Success, Error, Warning, and Info notifications
- **Auto-dismiss**: Configurable auto-dismiss duration for each notification type
- **Manual Dismiss**: Users can manually close notifications
- **Progress Indicators**: Visual progress bars showing remaining time
- **Smooth Animations**: Slide-in/out animations with CSS transitions
- **Responsive Design**: Works seamlessly across all screen sizes

### 🎨 Visual Features
- **Color-coded Types**: Each notification type has distinct colors and icons
- **Hover Effects**: Interactive hover states for better UX
- **Progress Bars**: Visual countdown for auto-dismissing notifications
- **Icon Integration**: Lucide React icons for visual clarity
- **Modern Design**: Clean, modern UI with Tailwind CSS

### 🔧 Developer Experience
- **TypeScript Support**: Full type safety and IntelliSense support
- **Easy Integration**: Simple hook-based API for components
- **Service Layer**: Comprehensive notification service for common operations
- **Error Handling**: Built-in error handling and user-friendly messages
- **Customizable**: Flexible configuration for different use cases

## Usage

### Basic Usage

```tsx
import { useNotification } from './components/NotificationContext';

const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleAction = () => {
    showSuccess('Success!', 'Operation completed successfully');
  };

  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
};
```

### Using the Notification Service

```tsx
import { notificationService } from './utils/notificationService';

// CRUD Operations
notificationService.showCreateSuccess('Problem', 'Two Sum problem added');
notificationService.showUpdateError('Learning Item', 'Failed to update progress');

// Authentication
notificationService.showLoginSuccess('John Doe');
notificationService.showSignupError('Email already exists');

// Progress Updates
notificationService.showProgressUpdate('React Course', 75);
notificationService.showStatusChange('Problem', 'In Progress', 'Completed');
```

### Advanced Usage with Actions

```tsx
const { showSuccess } = useNotification();

showSuccess(
  'Export Completed',
  'Your data has been exported successfully.',
  {
    duration: 0, // Don't auto-dismiss
    action: {
      label: 'Download File',
      onClick: () => {
        // Handle download action
        console.log('Download started');
      }
    }
  }
);
```

## API Reference

### useNotification Hook

```tsx
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message: string, options?: Partial<Notification>) => void;
  showError: (title: string, message: string, options?: Partial<Notification>) => void;
  showWarning: (title: string, message: string, options?: Partial<Notification>) => void;
  showInfo: (title: string, message: string, options?: Partial<Notification>) => void;
}
```

### Notification Interface

```tsx
interface Notification {
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

type NotificationType = 'success' | 'error' | 'warning' | 'info';
```

### NotificationService Methods

#### CRUD Operations
- `showCreateSuccess(entity: string, details?: string)`
- `showCreateError(entity: string, error?: string)`
- `showUpdateSuccess(entity: string, details?: string)`
- `showUpdateError(entity: string, error?: string)`
- `showDeleteSuccess(entity: string, details?: string)`
- `showDeleteError(entity: string, error?: string)`
- `showReadError(entity: string, error?: string)`

#### Authentication
- `showLoginSuccess(userName?: string)`
- `showLoginError(error?: string)`
- `showLogoutSuccess()`
- `showSignupSuccess(userName?: string)`
- `showSignupError(error?: string)`

#### Progress and Status
- `showProgressUpdate(entity: string, progress: number)`
- `showStatusChange(entity: string, oldStatus: string, newStatus: string)`

#### Network and Validation
- `showNetworkError()`
- `showServerError(error?: string)`
- `showValidationError(field: string, message?: string)`

## Integration

### 1. Provider Setup

Wrap your app with the NotificationProvider:

```tsx
import { NotificationProvider } from './components/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      {/* Your app components */}
    </NotificationProvider>
  );
}
```

### 2. Component Integration

```tsx
import { useNotification } from './components/NotificationContext';

const MyComponent = () => {
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async () => {
    try {
      await api.createItem(data);
      showSuccess('Item Created', 'Your item has been created successfully');
    } catch (error) {
      showError('Creation Failed', 'There was an error creating the item');
    }
  };

  return <button onClick={handleSubmit}>Create Item</button>;
};
```

### 3. Error Handling

```tsx
import { handleApiError } from './utils/notificationService';

const handleApiCall = async () => {
  try {
    await api.someOperation();
  } catch (error) {
    handleApiError(error, 'Create', 'Problem');
  }
};
```

## Styling

The notification system uses Tailwind CSS classes and custom CSS animations. Key classes include:

- `.notification-enter`: Slide-in animation
- `.notification-hover`: Hover effects
- `.notification-progress`: Progress bar styling
- `.notification-progress-{type}`: Type-specific progress bar colors

## Customization

### Duration Settings

```tsx
// Default durations
success: 4000ms
error: 0ms (no auto-dismiss)
warning: 6000ms
info: 5000ms
```

### Custom Styling

You can customize notification appearance by modifying the CSS classes in `index.css`:

```css
.notification-progress-success::after {
  background: linear-gradient(90deg, #10b981, #059669);
}
```

## Best Practices

1. **Use Appropriate Types**: Choose the right notification type for the context
2. **Keep Messages Concise**: Write clear, actionable messages
3. **Handle Errors Gracefully**: Always provide fallback error messages
4. **Don't Overwhelm Users**: Avoid showing too many notifications simultaneously
5. **Use Actions Sparingly**: Only add action buttons when they provide clear value
6. **Test Different Scenarios**: Ensure notifications work in various contexts

## Examples

See `NotificationDemo.tsx` for comprehensive examples of all notification types and features.

## Troubleshooting

### Common Issues

1. **Notifications not showing**: Ensure NotificationProvider is wrapped around your app
2. **Styling issues**: Check that Tailwind CSS is properly configured
3. **Animation problems**: Verify CSS animations are loaded correctly

### Debug Mode

Enable debug mode by setting the notification handler:

```tsx
import { notificationService } from './utils/notificationService';

// Set custom handler for debugging
notificationService.setNotificationHandler((notification) => {
  console.log('Notification:', notification);
  // Your custom logic
});
```
