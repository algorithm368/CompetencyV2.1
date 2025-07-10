# CompetencyDetailPage

A beautiful, responsive page for displaying detailed competency information from both SFIA and TPQI frameworks.

## Features

### 🎨 Beautiful Design
- **Gradient backgrounds** inspired by HomeHeroSection with teal theme
- **Smooth animations** using Framer Motion
- **Responsive design** that works on all screen sizes
- **Glassmorphism effects** with backdrop blur

### 🔧 Technical Features
- **Framework agnostic** - supports both SFIA and TPQI competencies
- **Smart caching** with configurable cache duration (5 minutes default)
- **Retry logic** with exponential backoff for failed requests
- **Error handling** with user-friendly messages and recommendations
- **Loading states** with beautiful spinners and progress indicators
- **Type safety** with full TypeScript support

### 🚀 Hooks Integration
- Uses `useSfiaJobDetail` and `useTpqiUnitDetail` specialized hooks
- Integrates `useCompetencyDetailError` for comprehensive error handling
- Automatic validation of competency codes before API calls
- Cache management and state reset functionality

## URL Structure

The page is accessible via the following URL pattern:
```
/competency/{source}/{id}
```

**Examples:**
- `/competency/sfia/PROG` - SFIA Programming competency
- `/competency/tpqi/ICT-LIGW-404B` - TPQI unit code details

## Route Configuration

The page is integrated into the main routing system in `AppRoutes.tsx`:

```tsx
<Route path="/competency/:source/:id" element={<CompetencyDetailPage />} />
```

## Navigation

SearchResults page has been updated to navigate to the new competency detail page:
- Previously: `/occupation/{framework}/{id}`
- Now: `/competency/{framework}/{id}`

## Data Structure

### SFIA Competencies
Shows:
- Competency name and code
- Overall description and notes
- Skill levels with detailed descriptions
- Skills associated with each level
- Total levels and skills count

### TPQI Competencies
Shows:
- Competency name and code
- Overall description and notes
- Skills, Knowledge, and Occupational areas
- Sector information
- Counts for each category

## Error Handling

### Validation
- Validates competency codes before API calls
- SFIA codes: 2-6 uppercase letters (e.g., PROG, DBAD)
- TPQI codes: 3-20 characters with letters, numbers, and hyphens

### Error States
- **Network errors** - Shows retry options with connection troubleshooting
- **Timeout errors** - Provides server status information
- **Not found errors** - Suggests code verification
- **Server errors** - Offers retry with exponential backoff

### User-Friendly Messages
- Clear error descriptions
- Actionable recommendations
- Retry functionality with visual feedback

## Performance

### Caching
- **5-minute cache** duration by default
- **Automatic cache invalidation** after expiration
- **Cache status indicators** showing last update time
- **Manual cache clearing** for debugging

### Optimization
- **Debounced validation** to prevent excessive API calls
- **Component memoization** for performance
- **Lazy loading** of data sections
- **Minimal re-renders** with optimized state management

## Styling

### Design System
- **Consistent color palette** with teal primary colors
- **Framework-specific colors** (blue for SFIA, green for TPQI)
- **Accessible contrast ratios** for all text elements
- **Smooth transitions** for all interactive elements

### Components
- **Glass cards** with backdrop blur effects
- **Gradient badges** for framework identification
- **Icon integration** with React Icons
- **Responsive grid layouts** for content organization

## Usage in Components

```tsx
// Navigate to a competency detail page
navigate(`/competency/sfia/PROG`);
navigate(`/competency/tpqi/ICT-LIGW-404B`);

// The page will automatically:
// 1. Validate the URL parameters
// 2. Choose the appropriate hook (SFIA or TPQI)
// 3. Fetch and display the competency data
// 4. Handle any errors gracefully
```

## Dependencies

- **React Router** for navigation and URL parameters
- **Framer Motion** for animations and transitions
- **React Icons** for consistent iconography
- **Tailwind CSS** for styling and responsive design
- **Custom hooks** for data fetching and error handling

## File Structure

```
src/pages/competencyDetail/
├── CompetencyDetailPage.tsx         # Main page component
├── hooks/
│   ├── useCompetencyDetail.ts       # Data fetching hooks
│   └── useCompetencyDetailError.ts  # Error handling hook
└── services/
    └── competencyDetailAPI.ts       # API service functions
```

## Future Enhancements

- **Bookmark functionality** for favorite competencies
- **Comparison mode** for side-by-side competency analysis
- **Print/export options** for competency reports
- **Related competencies** suggestions
- **Progress tracking** for skill development
