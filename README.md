# Shuttleport Frontend

Next.js application for the Shuttleport transfer booking platform.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── features/              # Feature modules
│   ├── booking/          # Booking feature
│   ├── maps/             # Maps & location feature
│   ├── vehicles/         # Vehicle selection feature
│   └── payment/          # Payment feature
├── shared/               # Shared across features
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── types/           # Global TypeScript types
│   ├── constants/       # Application constants
│   └── services/        # API clients
├── styles/              # Global styles
└── config/             # Application configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Architecture

### Feature-Based Organization

Each feature is self-contained with its own:
- **components**: React components specific to the feature
- **hooks**: Custom hooks for the feature
- **services**: API calls and business logic
- **types**: TypeScript definitions
- **utils**: Helper functions

### Shared Module

Common code used across features:
- **components**: Reusable UI components
- **lib**: Utility functions (date, price formatting)
- **services**: API client
- **constants**: Application-wide constants

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
