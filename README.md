# SpendWise Frontend

Mobile-first React application for personal finance management. Built with React, Redux Toolkit, and Tailwind CSS v4.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Testing**: Vitest with React Testing Library and fast-check (PBT)

## Prerequisites

- Node.js 20.19+ or 22.12+

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (add to package.json) |

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/             # Redux store and hooks
│   │   ├── store.ts
│   │   └── hooks.ts
│   ├── components/      # Reusable components
│   │   ├── common/      # Buttons, inputs, modals
│   │   ├── charts/      # Chart components
│   │   ├── layout/      # Navigation, headers
│   │   └── features/    # Feature-specific components
│   ├── features/        # Redux slices and API
│   │   ├── api/         # RTK Query base API
│   │   ├── auth/        # Auth slice and API
│   │   ├── ui/          # UI slice (toasts, theme)
│   │   ├── accounts/    # Bank accounts API
│   │   ├── transactions/# Transactions API
│   │   ├── insights/    # Insights API
│   │   └── ai/          # AI features API
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── test/            # Test setup and generators
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind CSS
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Design System

The app uses a custom theme with:

- **Primary**: Deep Teal (#009688) - Trust and growth
- **Secondary**: Warm Gold (#FFC107) - Premium accent
- **Semantic**: Success (green), Warning (amber), Error (red)
- **Transaction Colors**: Debit (red), Credit (green)

## Features

- User authentication with JWT
- Bank account linking via Mono
- Transaction tracking and categorization
- Spending insights and charts
- AI-powered financial advice
- Offline support with caching
- Mobile-first responsive design

## License

ISC
