# Source Code Structure

This directory contains the source code for the Civicship Portal application.

## Directory Structure

- `app/`: Next.js App Router structure
  - `components/`: UI components
  - `[feature]/`: Feature-specific pages
- `contexts/`: React context providers
- `gql/`: GraphQL related files
- `graphql/`: GraphQL queries and mutations
- `hooks/`: Custom React hooks
  - `core/`: Core hooks used across features
  - `features/`: Feature-specific hooks
- `lib/`: Utilities and configuration
- `types/`: TypeScript type definitions
- `utils/`: Utility functions

## Coding Conventions

- Pages (`app/[feature]/page.tsx`) are responsible only for layout and initiating state hooks
- Data fetching and logic processing are in custom hooks (`hooks/features/[feature]/`)
- Data transformation and conditional logic are in utilities (`utils/`)
- Display structure is in presentation components (`app/components/features/[feature]/`)
