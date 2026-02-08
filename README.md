# Nayzak Frontend

A premium Next.js 15 project structure with Tailwind CSS 4, built for performance, scalability, and stunning aesthetics.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/) (Recommended)
- **Components**: Custom premium UI components

## Project Structure

```text
src/
├── assets/          # Static assets like images, fonts, and icons
├── components/      # Reusable UI components
├── context/         # React Context providers for state management
├── hooks/           # Custom React hooks
├── lib/             # Shared libraries and configurations
├── services/        # API services and data fetching logic
├── types/           # TypeScript interfaces and types
├── utils/           # Helper functions and utilities
└── app/             # App router pages and layouts
```

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## Design System

The project uses a custom design system defined in `src/app/globals.css`. It includes:

-   **Premium Color Palette**: Tailored HSL colors for light and dark modes.
-   **Glassmorphism**: Built-in utilities for frosted glass effects.
-   **Animations**: Subtle micro-animations for better engagement.
-   **Responsiveness**: Mobile-first approach using Tailwind's grid and flex systems.

## Features

-   [x] **Next.js 15 App Router**
-   [x] **Tailwind CSS 4 Integration**
-   [x] **TypeScript Ready**
-   [x] **Dark Mode Support**
-   [x] **Glassmorphic UI Components**
-   [x] **Responsive Layouts**
-   [x] **Custom Hooks (useScroll)**
-   [x] **Standardized Folder Structure**
```
