# Contributing to Civicship Portal

## Component Directory Structure

Civicship Portal follows a specific directory structure for its React components to ensure maintainability and clarity of responsibility. This guide explains the purpose of each directory and the types of components that should be placed in them.

### Directory Structure

Components are organized into the following directories:

#### `/src/components/layout`

**Purpose**: Contains components that define the overall structure of the application's UI.

**Examples**: Header, BottomBar

**Characteristics**:
- Page-level layout components
- App-wide structural components
- Components that are used consistently across the application for layout purposes

#### `/src/components/shared`

**Purpose**: Contains reusable UI components that have domain-specific knowledge but are used across multiple features.

**Examples**: EmptyState, ErrorState, LoadingIndicator, ParticipantsList

**Characteristics**:
- Medium-grained UI components
- Domain-aware components that are reused across multiple features
- Components that know about business domains but aren't tied to a specific feature

#### `/src/components/ui`

**Purpose**: Contains pure UI components that form the design system.

**Examples**: Button, Card, Input, Dialog, Select, Tabs, etc.

**Characteristics**:
- Smallest UI building blocks
- Pure presentation components with no domain knowledge
- Components that implement the design system

#### `/src/components/features`

**Purpose**: Contains domain-specific components organized by feature area.

**Examples**: `features/user/UserProfile`, `features/activity/ActivityDetails`

**Characteristics**:
- Medium to large-grained UI components
- Components specific to a single feature or domain
- Can use components from `shared` and `ui` directories
- Organized in subdirectories by feature/domain

#### `/src/components/providers`

**Purpose**: Contains React Context providers for application-wide state management.

**Examples**: ApolloProvider, LoadingProvider

**Characteristics**:
- Context providers for app-wide state
- Components that provide state through React Context API

### Component Placement Guidelines

When creating or modifying components, follow these guidelines to determine where to place them:

1. If the component is a pure UI element with no domain knowledge → `ui/`
2. If the component has domain knowledge but is used across features → `shared/`
3. If the component is specific to a single feature or domain → `features/{domain}/`
4. If the component defines the overall page layout → `layout/`
5. If the component provides state through React Context → `providers/`

### Import Guidelines

Follow these import guidelines to maintain a clear dependency structure:

1. Components in `features/` can import from:
   - `ui/`
   - `shared/`
   - Other components within the same feature directory

2. Components in `shared/` can import from:
   - `ui/`
   - Other components within `shared/`

3. Components in `layout/` can import from:
   - `ui/`
   - `shared/`

4. Components in `ui/` should only import:
   - Other components within `ui/`
   - No dependencies on `shared/`, `features/`, or `layout/`

5. Components in `providers/` can import from anywhere as needed

### Naming Conventions

- Directory names in `features/` should be singular (e.g., `user`, not `users`)
- Component file names should match the component name
- UI component names should describe what they are, not where they are used
