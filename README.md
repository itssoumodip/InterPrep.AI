# InterPrep.AI

InterPrep.AI is an AI-powered interview preparation platform that simulates realistic interview experiences with voice-based AI interviewers. Practice, improve, and excel in your job interviews with personalized feedback and analytics.

![InterPrep.AI Logo](interprepai/public/logo.svg)

## Features

- **AI Voice Interviews**: Engage in natural conversations with AI interviewers that respond in real-time
- **Multiple Interview Types**: Practice technical, behavioral, or mixed interviews tailored to your needs
- **Technology-Specific Questions**: Get relevant questions for specific tech stacks (React, Tailwind, etc.)
- **Instant Feedback**: Receive comprehensive analysis of your performance after each interview
- **Progress Tracking**: Monitor your improvement across different skill categories
- **User Authentication**: Secure sign-up and sign-in functionality
- **Interview History**: Review past interviews and track your progress

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js Server Actions, API Routes
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Voice Interaction**: Vapi.ai
- **AI Integration**: Google Gemini

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase account
- Vapi.ai account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/InterPrep.AI.git
   cd InterPrep.AI/interprepai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
3. Set up environment variables:
   Create a `.env.local` file in the `interprepai` directory with the following variables:
   ```
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   
   # Vapi.ai
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your-vapi-web-token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your-vapi-workflow-id
   
   # Google Gemini
   GOOGLE_API_KEY=your-google-gemini-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Create an Account**: Sign up with email and password or sign in if you already have an account
2. **Start an Interview**: Choose an interview type from the available options
3. **Complete the Interview**: Answer questions asked by the AI interviewer using your voice
4. **Review Feedback**: Get detailed feedback on your performance
5. **Track Progress**: Monitor your improvement over time through the dashboard

## Project Structure

```
interprepai/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication pages
│   │   ├── sign-in/      # Sign in page
│   │   └── sign-up/      # Sign up page
│   ├── (root)/           # Main application pages
│   │   ├── interview/    # Interview pages
│   │   │   └── [id]/     # Specific interview page
│   │   │       └── feedback/  # Interview feedback page
│   ├── api/              # API routes
├── components/           # React components
├── constants/            # Application constants
├── firebase/             # Firebase configuration
├── lib/                  # Utility functions
│   └── actions/          # Server actions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Vapi.ai](https://vapi.ai) for voice interaction capabilities
- [Firebase](https://firebase.google.com) for authentication and database services
- [Google Gemini](https://ai.google.dev/) for AI-powered feedback
- [Next.js](https://nextjs.org) for the React framework
- [TailwindCSS](https://tailwindcss.com) for styling