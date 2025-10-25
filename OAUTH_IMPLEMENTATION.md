# OAuth Implementation Guide

This document outlines the OAuth authentication implementation for Google and GitHub providers in the Code Tracker Dashboard.

## Overview

The implementation includes:
- Enhanced User schema with OAuth support
- Google OAuth 2.0 integration
- GitHub OAuth 2.0 integration
- Frontend OAuth buttons and callback handling
- Secure token management

## Backend Implementation

### 1. Enhanced User Schema

The User model has been updated to support multiple authentication providers:

```javascript
// New fields added to User model:
authProvider: 'local' | 'google' | 'github'
providerId: STRING (OAuth provider user ID)
profilePicture: TEXT (URL to user profile picture)
isEmailVerified: BOOLEAN
lastLoginAt: DATE
refreshToken: TEXT (OAuth refresh token)
```

### 2. OAuth Configuration

**File: `server/src/config/oauth.js`**
- Passport.js configuration for Google and GitHub strategies
- Automatic user creation/linking for OAuth users
- Session management for OAuth flow

### 3. OAuth Routes

**File: `server/src/routes/authRoutes.js`**
- `/api/auth/google` - Initiate Google OAuth
- `/api/auth/google/callback` - Google OAuth callback
- `/api/auth/github` - Initiate GitHub OAuth
- `/api/auth/github/callback` - GitHub OAuth callback
- `/api/auth/verify-oauth` - Verify OAuth tokens

### 4. Dependencies Added

```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-github2": "^0.1.12",
  "express-session": "^1.17.3"
}
```

## Frontend Implementation

### 1. Enhanced AuthContext

**File: `src/components/AuthContext.tsx`**
- Added OAuth methods: `loginWithGoogle()`, `loginWithGitHub()`, `handleOAuthCallback()`
- Updated User interface with OAuth fields
- OAuth token verification

### 2. OAuth Buttons

**Files: `src/components/LoginPage.tsx`, `src/components/SignupPage.tsx`**
- Google OAuth button with Google branding
- GitHub OAuth button with GitHub branding
- Consistent styling with existing UI

### 3. OAuth Callback Handler

**File: `src/components/OAuthCallback.tsx`**
- Handles OAuth redirects from providers
- Token verification and user authentication
- Loading states and error handling
- Automatic redirect to dashboard

### 4. API Client Updates

**File: `src/utils/apis.ts`**
- Added `verifyOAuthToken()` method
- OAuth token verification endpoint

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `server/` directory:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Server Configuration
PORT=7007
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:7007/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:7007/api/auth/github/callback
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:7007/api/auth/google/callback`

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:7007/api/auth/github/callback`

### 4. Frontend Environment

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:7007
```

## OAuth Flow

### 1. User Initiates OAuth
- User clicks "Continue with Google/GitHub" button
- Frontend redirects to `/api/auth/google` or `/api/auth/github`
- Server redirects to OAuth provider

### 2. OAuth Provider Authentication
- User authenticates with Google/GitHub
- Provider redirects back to callback URL with authorization code

### 3. Server Processing
- Server exchanges authorization code for access token
- Fetches user profile from OAuth provider
- Creates or links user account
- Generates JWT token

### 4. Frontend Callback
- Server redirects to frontend with JWT token
- Frontend verifies token with server
- User is authenticated and redirected to dashboard

## Security Features

1. **JWT Token Management**: Secure token generation and verification
2. **Session Security**: Secure session configuration with proper cookies
3. **CORS Protection**: Configured CORS for frontend-backend communication
4. **Token Verification**: Server-side token verification for OAuth callbacks
5. **Account Linking**: Automatic linking of OAuth accounts to existing users

## Database Migration

The User schema changes require a database migration. The new fields are:
- `authProvider` (default: 'local')
- `providerId` (nullable)
- `profilePicture` (nullable)
- `isEmailVerified` (default: false)
- `lastLoginAt` (nullable)
- `refreshToken` (nullable)

## Testing

### 1. Local Testing
1. Set up OAuth applications with Google and GitHub
2. Configure environment variables
3. Start the server: `npm run dev` (in server directory)
4. Start the frontend: `npm run dev` (in root directory)
5. Test OAuth flows on login and signup pages

### 2. Production Deployment
1. Update OAuth application settings with production URLs
2. Set production environment variables
3. Ensure HTTPS for OAuth callbacks
4. Test OAuth flows in production environment

## Troubleshooting

### Common Issues

1. **OAuth Callback Errors**
   - Check redirect URIs in OAuth applications
   - Verify environment variables
   - Check CORS configuration

2. **Token Verification Failures**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Ensure proper error handling

3. **User Account Linking Issues**
   - Check email matching logic
   - Verify database constraints
   - Check for duplicate accounts

## Future Enhancements

1. **Additional OAuth Providers**: Facebook, Twitter, LinkedIn
2. **Account Merging**: UI for merging multiple OAuth accounts
3. **Profile Picture Sync**: Automatic profile picture updates
4. **OAuth Token Refresh**: Automatic token refresh for long-lived sessions
5. **Social Login Analytics**: Track OAuth usage and success rates
