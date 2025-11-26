# Toast Service Usage Guide

The Toast Service has been implemented using Angular Material Snackbar. You can use it anywhere in your application by injecting the `ToastService`.

## Usage Examples

### 1. Import in your component

```typescript
import { ToastService } from '../../core/services/toast.service';

constructor(private toast: ToastService) {}
```

### 2. Show different types of toasts

#### Success Toast

```typescript
this.toast.success("Operation completed successfully!");
this.toast.success("User created successfully", 5000); // Custom duration
```

#### Error Toast

```typescript
this.toast.error("Something went wrong!");
this.toast.error("Failed to save data", 4000);
```

#### Info Toast

```typescript
this.toast.info("Loading data...");
this.toast.info("Processing your request", 3000);
```

#### Warning Toast

```typescript
this.toast.warning("Please check your input");
this.toast.warning("Session will expire soon", 5000);
```

## Features

- **Positioning**: Top-right corner
- **Duration**: Configurable (default: 3-4 seconds)
- **Close Button**: Each toast has a "Close" button
- **Styling**: Custom colors for each type (success=green, error=red, info=blue, warning=orange)
- **Animation**: Smooth fade-in/fade-out animations

## Already Implemented In

1. **Login Component**: Shows success message on successful login, error message on failed login
2. **Header Component**: Shows info message when logging out

## Where to Use

You can use toast notifications for:

- Form submissions (success/error)
- Data loading states
- API call responses
- User actions feedback
- Validation messages
- Session/authentication updates
- CRUD operations feedback
