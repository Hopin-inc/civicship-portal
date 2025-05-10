# App Directory Structure

This directory follows the Next.js App Router structure.

## Directory Structure

- `components/`: UI components
  - `features/`: Feature-specific components
  - `layout/`: Layout components
  - `providers/`: Context providers
  - `shared/`: Shared components
  - `ui/`: Base UI components
- `[feature]/`: Feature-specific pages
  - `page.tsx`: Main page component
  - `container.tsx`: Container component (optional)

## Container Pattern

For complex pages with significant state management, we use a container pattern:

- `page.tsx`: Responsible for layout and rendering the container
- `container.tsx`: Manages state and renders presentation components

This pattern helps separate concerns and makes the code more maintainable.

### When to Use Container Pattern

- When a page has complex state management
- When a page has multiple related state variables
- When a page has multiple event handlers
- When a page renders multiple complex components

### Example

```tsx
// page.tsx
import SearchContainer from './container';

export default function SearchPage() {
  return <SearchContainer />;
}

// container.tsx
export default function SearchContainer() {
  // State management
  const { state, handlers } = useSearch();
  
  return (
    <div>
      <SearchHeader />
      <SearchForm onSubmit={handlers.handleSubmit} />
      {/* Other components */}
    </div>
  );
}
```
