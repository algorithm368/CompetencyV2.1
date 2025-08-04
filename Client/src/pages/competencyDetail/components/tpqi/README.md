# TPQI Components

This directory contains the refactored TPQI (Thai Professional Qualification Institute) components with improved structure and reusability.

## Component Structure

### 1. **BaseTpqiSection.tsx**
- Base wrapper component for all TPQI sections
- Handles common styling, animations, and layout
- Accepts color scheme configuration for different section types

### 2. **TpqiItem.tsx**
- Reusable item component for Skills and Knowledge sections
- Includes URL input functionality for evidence submission
- Handles active/focus states and animations

### 3. **TpqiOccupationalItem.tsx**
- Specialized item component for Occupational Areas
- Grid-layout optimized with simpler interaction (no URL input)
- Handles hover/active states

### 4. **colorSchemes.ts**
- Centralized color scheme definitions
- Three schemes: skills (green), knowledge (purple), occupational (indigo)
- Consistent theming across all components

### 5. **TpqiSections.tsx**
- Main section components: TpqiSkills, TpqiKnowledge, TpqiOccupational
- Uses the base and item components with appropriate configurations
- Maintains original functionality while reducing code duplication

### 6. **TpqiSection.tsx**
- Container component that orchestrates all TPQI sections
- Handles data conversion from API format to component format
- Conditional rendering based on data availability

## Key Improvements

- **Reduced Code Duplication**: Shared logic extracted to reusable components
- **Better Separation of Concerns**: Each component has a single responsibility
- **Centralized Theming**: Color schemes in one place for easy maintenance
- **Enhanced Reusability**: Components can be easily reused or extended
- **Type Safety**: Strong TypeScript interfaces throughout
- **Maintainability**: Clear component hierarchy and responsibilities

## Usage

```tsx
import { TpqiSection } from './components/tpqi';

// Use the main container component
<TpqiSection competency={competencyData} />

// Or use individual sections
import { TpqiSkills, TpqiKnowledge, TpqiOccupational } from './components/tpqi';

<TpqiSkills skills={skillsData} overall={overallText} />
<TpqiKnowledge knowledge={knowledgeData} overall={overallText} />
<TpqiOccupational occupational={occupationalData} overall={overallText} />
```
