# Google Authentication without Client ID Implementation

This implementation provides Google authentication using NextAuth with a custom credentials provider that works entirely through your backend, without requiring a Google Client ID on the frontend.

## Components Implemented

### 1. NextAuth Configuration (`app/api/auth/[...nextauth]/route.ts`)

- **Google Backend Provider**: Custom credentials provider that handles authorization codes
- **Backend Integration**: Exchanges auth codes with your backend at `/auth/google`
- **JWT Callbacks**: Manages access tokens, refresh tokens, and user data
- **Session Callbacks**: Provides access to tokens and user data in the session
- **Token Refresh**: Automatic refresh token rotation for long sessions

### 2. Google SignIn Component (`components/auth/GoogleSignIn.tsx`)

- **Direct Backend Redirect**: Redirects directly to your backend's OAuth endpoint
- **State Management**: Generates and validates state parameters for security
- **No Google Client ID Required**: Works entirely through your backend

### 3. Google Callback Handler (`components/auth/google/callback.tsx`)

- **Authorization Code Processing**: Handles the OAuth callback from Google
- **NextAuth Integration**: Signs in using the authorization code
- **State Validation**: Verifies CSRF protection via state parameter
- **Error Handling**: Comprehensive error handling with user feedback

### 4. Type Definitions (`types/next-auth.d.ts`)

- **Extended User Type**: Includes accessToken, refreshToken, and role
- **Extended Session Type**: Provides typed access to tokens and user data
- **Extended JWT Type**: Handles token storage and refresh logic

## Environment Variables Required

```env
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://lawgen-backend.onrender.com
```

**Note**: No `NEXT_PUBLIC_GOOGLE_CLIENT_ID` required!

## Usage Examples

### Basic Google Sign-In

```tsx
import GoogleSignIn from "@/components/auth/GoogleSignIn";

export default function LoginPage() {
  return (
    <div>
      <GoogleSignIn />
    </div>
  );
}
```

### Using the Auth Session Hook

```tsx
import { useAuthSession } from "@/hooks/use-auth-session";

export default function Dashboard() {
  const { user, accessToken, isAuthenticated, isLoading } = useAuthSession();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

### Making Authenticated API Requests

```tsx
import { api } from "@/lib/api-client";

// GET request with authentication
const userData = await api.get("/user/profile");

// POST request with authentication
const result = await api.post("/user/update", {
  name: "John Doe",
  email: "john@example.com",
});
```

### Manual Session Access

```tsx
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div>
      <p>Access Token: {session?.accessToken}</p>
      <p>User Role: {session?.user?.role}</p>
    </div>
  );
}
```

## Backend Integration

Your backend should expect the following request format:

```json
POST /auth/google
{
  "id_token": "google_id_token_here"
}
```

And return the following response format:

```json
{
  "access_token": "your_access_token",
  "refresh_token": "your_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_picture_url",
    "role": "user"
  }
}
```

## Token Refresh Endpoint

For automatic token refresh, implement this endpoint:

```json
POST /auth/refresh
{
  "refresh_token": "current_refresh_token"
}
```

Response:

```json
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token", // optional
  "expires_in": 3600
}
```

## Security Features

1. **Automatic Token Refresh**: Handles expired access tokens automatically
2. **Secure Token Storage**: Tokens are stored in secure HTTP-only cookies via NextAuth
3. **Error Handling**: Comprehensive error handling for authentication failures
4. **Type Safety**: Full TypeScript support for all authentication data

## Troubleshooting

1. **Google Services Not Loading**: Check your `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. **Backend Authentication Fails**: Verify your backend endpoint is accessible
3. **Token Issues**: Check the NextAuth secret and ensure proper token format from backend
4. **CORS Issues**: Ensure your backend allows requests from your frontend domain

## Next Steps

1. Test the Google sign-in flow
2. Implement protected routes using the session data
3. Add error handling for authentication failures
4. Customize the UI/UX based on your design requirements
