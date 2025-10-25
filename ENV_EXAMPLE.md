# Environment Variables Configuration

Create a `.env` file in the `server/` directory with the following variables:

## Database Configuration
```
DATABASE_URL=sqlite:./database/database.sqlite
```

## JWT Configuration
```
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

## Session Configuration
```
SESSION_SECRET=your-super-secret-session-key-here
```

## Server Configuration
```
PORT=7007
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Google OAuth Configuration
To set up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `http://localhost:7007/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:7007/api/auth/google/callback
```

## GitHub OAuth Configuration
To set up GitHub OAuth:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL:
   - `http://localhost:7007/api/auth/github/callback` (for development)
   - `https://yourdomain.com/api/auth/github/callback` (for production)

```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:7007/api/auth/github/callback
```

## Frontend Environment Variables
Create a `.env` file in the root directory with:

```
VITE_API_URL=http://localhost:7007
```
