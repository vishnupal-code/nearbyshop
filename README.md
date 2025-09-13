# NearbyShop

A monorepo for the NearbyShop project built with Next.js 14, TypeScript, and Firebase.

## Project Structure

```
nearbyshop/
├── packages/
│   └── shared/           # Shared TypeScript types and utilities
├── apps/
│   └── web/             # Next.js 14 application
├── package.json         # Root package.json with npm workspaces
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nearbyshop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp apps/web/env.example apps/web/.env.local

# Edit the .env.local file with your Firebase configuration
```

4. Build the shared package:
```bash
npm run build --workspace=packages/shared
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Firebase Configuration

The project is configured to use Firebase for authentication and database. Make sure to:

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Generate a service account key for Firebase Admin SDK
4. Update the environment variables in `.env.local`

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase Admin SDK, Firebase Client SDK
- **Monorepo**: npm workspaces
- **Linting**: ESLint