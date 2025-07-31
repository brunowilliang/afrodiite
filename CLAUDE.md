# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a TanStack Start application using React for building a full-stack web
application. The project is built with modern tooling including Vite,
TypeScript, and Tailwind CSS.

## Development Commands

```bash
# Start development server on port 3000
bun dev

# Build for production (runs vite build and type checking)
bun build

# Start production server
bun start

# Type checking only
bun check-types
```

## Architecture and Structure

### Tech Stack

- **Framework**: TanStack Start (full-stack React framework)
- **Build Tool**: Vite
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Component Styling**: use-styled library for component variants
- **State Management**: TanStack Router for routing state
- **Code Quality**: Biome for linting and formatting (uses tabs)

### Key Directories

- `/src/components/` - Reusable UI components
  - `/core/` - Core design system components (Button, Card, Text, etc.)
- `/src/routes/` - File-based routing structure
  - `(auth)/` - Authentication routes
  - `(public)/` - Public routes
  - `dashboard/` - Dashboard routes
- `/src/lib/` - Utility functions (includes `cn` function for className merging)
- `/src/styles/` - Global styles
- `/src/utils/` - Application utilities

### Component Patterns

Components use the `use-styled` library for creating styled components with
variants:

```tsx
const ComponentRoot = useStyled("div", {
  base: { className: "base-classes" },
  variants: {
    variant: {
      primary: { className: "variant-classes" },
    },
  },
  defaultVariants: { variant: "primary" },
});
```

Components are often composed using `useSlot` for compound component patterns.

### Routing

The application uses TanStack Router with file-based routing. Routes are
automatically generated in `routeTree.gen.ts`. The router is configured with:

- View transitions enabled
- Smooth scroll restoration
- Intent-based preloading

### Code Style Guidelines

- **Formatting**: Biome with tab indentation
- **Quotes**: Single quotes for JavaScript/TypeScript
- **Imports**: Auto-organized by Biome
- **Path Aliases**: Use `@/*` for src imports
- **ClassNames**: Use the `cn` utility function from `@/lib/utils` for merging
  Tailwind classes
- **Sorted Classes**: Tailwind classes should be sorted in functions:
  `useStyled`, `clsx`, `cva`, `cn`

### Important Configuration Files

- **biome.json**: Linting and formatting rules
- **tsconfig.json**: TypeScript configuration with strict mode
- **vite.config.ts**: Vite configuration targeting Vercel deployment
- **tailwind.config.ts**: Tailwind CSS v4 configuration (if exists)

### Deployment

The application is configured for Vercel deployment (`target: 'vercel'` in vite
config).

## Working with this Codebase

1. Always check existing component patterns in `/src/components/core/` before
   creating new components
2. Use the established styling patterns with `use-styled`
3. Follow the file-based routing conventions in `/src/routes/`
4. Run type checking before committing changes
5. Ensure Biome formatting is applied (files use tabs, not spaces)
6. When working with Tailwind classes, use the `cn` utility for conditional
   classes
