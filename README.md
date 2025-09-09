# LawGen Frontend

LawGen Frontend is a modern web application built with Next.js and React, designed to provide users with legal information, AI-powered chat, legal aid directory, quizzes, and user account management. It integrates with a backend API for authentication, user data, and legal resources.

## Features

- **Authentication**: Sign up, sign in, password reset, and email verification using credentials and JWT tokens. Session management with refresh token support.
- **Profile Management**: View and update user profile, manage subscription, and track usage.
- **AI Chat**: AI-powered legal assistant chat for general legal information and guidance.
- **Legal Aid Directory**: Browse and search for legal organizations, law firms, and legal aid providers. Publicly accessible.
- **Quizzes**: Test your legal knowledge with interactive quizzes. Requires authentication.
- **Categories**: Explore legal topics by category. Requires authentication.
- **Feedback**: Submit feedback to help improve the platform.
- **Responsive Design**: Fully responsive UI with modern navigation, theming, and accessibility support.

## Public vs Protected Pages

- **Public**: Legal Aid Directory, Chat, Landing Page, Sign In/Up, Password Reset
- **Protected (require sign-in)**: Categories, Profile, Quizzes

## Tech Stack

- Next.js (App Router, React 18)
- TypeScript
- Tailwind CSS
- next-auth for authentication
- Custom API integration (see `.env` for API URLs)

## Getting Started

1. **Install dependencies**

   ```sh
   pnpm install
   # or
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file with:

   ```env
   NEXT_PUBLIC_API_BASE_URL=
   NEXT_PUBLIC_FEEDBACK_API_BASE_URL=
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=
   NEXTAUTH_SECRET=
   NEXT_PUBLIC_QUIZ_BASE_URL=
   NEXT_PUBLIC_CHAPA_PUBLIC_KEY=
   chapa_secret_key=
   chapa_encryption_key=

   ```

3. **Run the development server**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
   The app will be available at http://localhost:3000

## Project Structure

- `app/` - Main application pages (auth, profile, chat, legal-aid, categories, quiz, etc.)
- `components/` - Reusable UI components (navigation, forms, etc.)
- `src/lib/api.ts` - API utility for backend requests
- `public/` - Static assets (including logo)

## Customization

- **Logo**: The LawGen logo is used throughout the app for branding. Replace `public/logo (1).svg` to update the logo.
- **Navigation**: Main navigation is in `components/ui/main-navigation.tsx`.
- **Theming**: Uses Tailwind CSS and `next-themes` for dark/light mode.

## Contributing

Pull requests are welcome! Please ensure your code follows the existing style and passes all checks.

## License

[MIT](LICENSE)

---

For more details, see the code and comments in each file.
