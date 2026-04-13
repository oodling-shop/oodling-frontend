# Oodling Frontend

A premium Next.js 16 project with Tailwind CSS 4, built for performance, scalability, and stunning aesthetics.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Phosphor Icons](https://phosphoricons.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Motion](https://motion.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Project Structure

```text
oodling-frontend/
├── apis/            # API service layers and data fetching logic
├── app/             # Next.js App Router pages, layouts, and routes
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Reusable UI components
├── constants/       # Application-wide constants
├── docs/            # Documentation files
├── helpers/         # Helper functions and utilities
├── hooks/           # Custom React hooks
├── lib/             # Shared libraries and configurations
├── providers/       # Context providers (theme, auth, etc.)
├── public/          # Static public assets (favicons, manifest, etc.)
├── styles/          # Additional style sheets
├── templates/       # Page and email templates
├── tests/           # Test files and configurations
└── types/           # TypeScript interfaces and type definitions
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

The project uses a custom design system defined in `app/globals.css`. It includes:

-   **Premium Color Palette**: Tailored colors for light and dark modes with shadcn/ui tokens.
-   **Typography**: Space Grotesk (primary) and Inter (secondary) fonts.
-   **Glassmorphism**: Built-in utilities for frosted glass effects.
-   **Animations**: Micro-animations powered by Motion for smooth interactions.
-   **Responsive Design**: Mobile-first approach using Tailwind's utility classes.

## Features

-   [x] **Next.js 16 App Router**
-   [x] **Tailwind CSS 4 Integration**
-   [x] **TypeScript Ready**
-   [x] **Dark Mode Support** (shadcn/ui)
-   [x] **Radix UI + shadcn/ui Components**
-   [x] **Motion Animations**
-   [x] **Sonner Toast Notifications**
-   [x] **Responsive Layouts**
-   [x] **Custom Hooks**
-   [x] **Organized Flat Structure** (no `src/` folder)
```
