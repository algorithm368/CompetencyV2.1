# SearchResults Module

A well-organized search results module for the Competency application with lazy loading and state management.

## 📁 File Structure

```
SearchResults/
├── index.ts                          # Main module export
├── SearchResultsPage.tsx             # Main page component
├── components/                       # UI Components
│   ├── index.ts                      # Components barrel export
│   ├── SearchContent.tsx             # Content orchestrator
│   ├── SearchHeader.tsx              # Search input header
│   ├── SearchResultsWithLazyLoad.tsx # Lazy loading container
│   ├── states/                       # State-specific components
│   │   ├── index.ts                  # States barrel export
│   │   ├── SearchLoadingState.tsx    # Loading state UI
│   │   ├── SearchErrorState.tsx      # Error state UI
│   │   ├── SearchWelcomeState.tsx    # Welcome/initial state UI
│   │   ├── SearchEmptyState.tsx      # Empty results state UI
│   │   └── SearchSuccessState.tsx    # Success state wrapper
│   └── ui/                           # Reusable UI components
│       ├── index.ts                  # UI barrel export
│       ├── ResultsList.tsx           # Results list display
│       └── SkeletonLoader.tsx        # Loading skeleton
├── hooks/                            # Custom hooks
│   ├── useCompetencyResults.ts       # Main search logic
│   └── useLazyLoading.ts             # Lazy loading logic
├── services/                         # API services
│   └── searchCompetencyAPI.ts        # Search API functions
└── types/                            # TypeScript types
    └── CompetencyTypes.ts            # Competency-related types
```

## 🚀 Features

- **Lazy Loading**: Efficient loading of search results
- **State Management**: Clean state transitions with animations
- **Modular Architecture**: Well-organized components and hooks
- **Type Safety**: Full TypeScript support
- **Clean Imports**: Barrel exports for better developer experience

## 📦 Removed Files

The following unused files were removed to improve the codebase:

- `BackgroundDecor.tsx` - Not imported anywhere
- `Pagination.tsx` - Not used (using lazy loading instead)
- `ResultsCard.tsx` - Not imported (only used by unused ResultsGrid)
- `ResultsGrid.tsx` - Not imported anywhere
- `useCareerResults.ts` - Not imported anywhere
- `useVirtualization.ts` - Not imported anywhere
- `careerTypes.ts` - Only used by unused useCareerResults
- `utils/` folder - Empty directory

## 💡 Usage

```tsx
// Import the main page component
import SearchResultsPage from '@Pages/SearchResults';

// Or import specific components
import { SearchContent, SearchHeader } from '@Pages/SearchResults/components';

// Import hooks
import { useLazyCompetencyResults } from '@Pages/SearchResults/hooks/useCompetencyResults';
```

## 🏗️ Architecture Benefits

1. **Better Organization**: Components are grouped by purpose (states, ui)
2. **Cleaner Imports**: Barrel exports reduce import complexity
3. **Maintainability**: Clear separation of concerns
4. **Scalability**: Easy to add new components in appropriate folders
5. **Developer Experience**: Intuitive file structure and naming
