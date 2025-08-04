# Competency Detail Hooks

This directory contains well-organized React hooks for managing competency details, evidence, and related functionality.

## 📁 Directory Structure

```
hooks/
├── 📁 competency/           # Core competency data management
│   ├── useCompetencyDetail.ts      # Main competency hook (supports both SFIA & TPQI)
│   ├── useSfiaSkillDetail.ts       # SFIA-specific skill details
│   ├── useTpqiUnitDetail.ts        # TPQI-specific unit details
│   ├── useCompetencyActions.ts     # Competency-related actions
│   ├── useCompetencyDetailError.ts # Error handling for competency
│   └── index.ts                    # Barrel export for competency hooks
├── 📁 evidence/             # Evidence fetching and submission
│   ├── useSfiaEvidenceFetcher.ts   # Fetch SFIA evidence data
│   ├── useTpqiEvidenceFetcher.ts   # Fetch TPQI evidence data
│   ├── useSfiaEvidenceSender.ts    # Submit SFIA evidence
│   ├── useTpqiEvidenceSender.ts    # Submit TPQI evidence
│   └── index.ts                    # Barrel export for evidence hooks
├── 📁 ui/                   # UI-specific hooks
│   ├── useAnimationVariants.ts     # Animation configurations
│   └── index.ts                    # Barrel export for UI hooks
├── 📁 utils/                # Utility/helper hooks
│   ├── useCompetencyCache.ts       # Caching functionality
│   ├── useRetryLogic.ts           # Retry mechanisms
│   └── index.ts                    # Barrel export for utility hooks
├── 📄 types.ts              # Shared TypeScript interfaces and types
└── 📄 index.ts              # Main barrel export (imports all hooks)
```

## 🎯 Usage Examples

### Import individual hooks:
```typescript
import { useCompetencyDetail } from '@/pages/competencyDetail/hooks/competency';
import { useTpqiEvidenceFetcher } from '@/pages/competencyDetail/hooks/evidence';
```

### Import from categories:
```typescript
import { useCompetencyDetail, useSfiaSkillDetail } from '@/pages/competencyDetail/hooks/competency';
import { useTpqiEvidenceFetcher, useSfiaEvidenceSender } from '@/pages/competencyDetail/hooks/evidence';
```

### Import everything (barrel export):
```typescript
import { 
  useCompetencyDetail, 
  useTpqiEvidenceFetcher,
  useAnimationVariants,
  useCompetencyCache
} from '@/pages/competencyDetail/hooks';
```

## 🏗️ Hook Categories

### 📊 Competency Hooks
- **Primary data fetching** for SFIA skills and TPQI units
- **Caching and retry logic** built-in
- **Multi-source support** (can fetch from both SFIA and TPQI)

### 🔍 Evidence Hooks
- **Separate fetcher and sender** hooks for clear separation of concerns
- **Type-safe evidence management** with proper TypeScript interfaces
- **Approval status tracking** for evidence submissions

### 🎨 UI Hooks
- **Animation configurations** for consistent UI experience
- **Reusable UI state management**

### ⚙️ Utility Hooks
- **Caching mechanisms** to reduce API calls
- **Retry logic** for robust error handling
- **Shared utilities** across different hook categories

## 📝 Naming Conventions

### Hook Names
- `use[Domain][Action]` - e.g., `useTpqiEvidence`, `useSfiaEvidenceSubmit`
- Be specific about what the hook does
- Use consistent naming across similar hooks

### File Names
- Match the hook name exactly: `useTpqiEvidenceFetcher.ts`
- Use camelCase consistently
- Group related hooks in appropriate folders

### Interface Names
- `Use[HookName]Result` for return types
- `[Domain][Feature]State` for state interfaces  
- `[Domain][Feature]Options` for configuration

## 🔧 Maintenance Guidelines

### Adding New Hooks
1. **Choose the correct category** (competency/evidence/ui/utils)
2. **Follow naming conventions** established above
3. **Add to appropriate index.ts** for barrel exports
4. **Include proper TypeScript types** in types.ts if shared
5. **Add JSDoc comments** for better developer experience

### Modifying Existing Hooks
1. **Check dependencies** - see what other hooks/components use it
2. **Update types** in types.ts if interfaces change
3. **Test imports** to ensure barrel exports still work
4. **Update documentation** if behavior changes

### Moving/Renaming Hooks
1. **Update all import paths** in dependent files
2. **Update barrel exports** in index.ts files
3. **Search globally** for old import statements
4. **Test thoroughly** to ensure no broken imports

## 🧪 Testing Strategy
- **Unit tests** for individual hook logic
- **Integration tests** for hook interactions
- **Mock API responses** for evidence and competency data
- **Test error scenarios** and retry mechanisms

## 🚀 Performance Considerations
- **Memoization** is used appropriately in hooks
- **Caching** reduces redundant API calls
- **Lazy loading** for large data sets
- **Debouncing** for user input-driven hooks

---

Last updated: August 2025
Maintained by: Development Team
