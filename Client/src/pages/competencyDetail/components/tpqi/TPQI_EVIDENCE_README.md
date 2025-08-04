# TPQI Evidence Submission System

This document describes how to use the TPQI (Thai Professional Qualification Institute) evidence submission system.

## 🎯 Overview

The TPQI evidence system allows users to submit evidence for their skills and knowledge competencies. It follows the same architecture pattern as the SFIA evidence system for consistency and maintainability.

## 📁 File Structure

```
components/tpqi/
├── TpqiSection.tsx                    # Main section wrapper
├── TpqiSkillKnowledgeItems.tsx       # Skills & knowledge items container
├── TpqiEvidenceItem.tsx              # Individual evidence submission component
├── TpqiDemo.tsx                      # Demo component with mock data
└── TpqiEvidenceTest.tsx              # Test component for debugging

hooks/
├── useTpqiEvidenceSender.ts          # Evidence submission logic
└── useTpqiEvidenceFetcher.ts         # Evidence fetching logic

services/
├── postTpqiEvidenceAPI.ts            # Evidence submission API
└── getTpqiEvidenceAPI.ts             # Evidence fetching API

types/
└── tpqi.ts                           # TPQI type definitions

utils/
└── tpqiUtils.ts                      # TPQI utility functions
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { TpqiSection } from '@/pages/competencyDetail/components/tpqi';
import { TpqiUnit } from '@/pages/competencyDetail/types/tpqi';

const MyComponent = () => {
  const tpqiUnits: TpqiUnit[] = [
    {
      id: 1,
      unit_code: "ICT001",
      unit_name: "IT Fundamentals",
      skills: [
        {
          id: 1,
          skill_name: "Hardware Setup",
          skill_description: "Computer hardware assembly"
        }
      ],
      knowledge: [
        {
          id: 1,
          knowledge_name: "OS Concepts",
          knowledge_description: "Operating system fundamentals"
        }
      ]
    }
  ];

  return (
    <TpqiSection 
      units={tpqiUnits}
      unitCode="ICT_DEMO"
    />
  );
};
```

### Using the Hook Directly

```tsx
import { useTpqiEvidenceSender } from '@/pages/competencyDetail/hooks/useTpqiEvidenceSender';

const EvidenceForm = () => {
  const {
    evidenceState,
    handleUrlChange,
    handleSubmit,
    handleRemove,
    getEvidenceState,
    canSubmitEvidence,
  } = useTpqiEvidenceSender();

  const skillEvidence = { type: 'skill', id: 1 };
  const skillState = getEvidenceState(skillEvidence);

  return (
    <div>
      <input
        value={skillState.url}
        onChange={(e) => handleUrlChange(skillEvidence, e.target.value)}
        placeholder="Enter evidence URL"
      />
      <button 
        onClick={() => handleSubmit(skillEvidence)}
        disabled={!canSubmitEvidence(skillEvidence)}
      >
        {skillState.loading ? 'Submitting...' : 'Submit'}
      </button>
      {skillState.error && <p className="error">{skillState.error}</p>}
    </div>
  );
};
```

## 🔧 API Integration

### Evidence Submission

The system submits evidence to `POST /tpqi/evidence` with:

```typescript
{
  skillId?: number;          // For skill evidence
  knowledgeId?: number;      // For knowledge evidence  
  evidenceUrl?: string;      // Evidence URL
}
```

### Evidence Fetching

Fetches existing evidence from `GET /tpqi/evidence/{unitCode}` returning:

```typescript
{
  skills?: { 
    [skillId: number]: { 
      evidenceUrl: string; 
      approvalStatus: string 
    } 
  };
  knowledge?: { 
    [knowledgeId: number]: { 
      evidenceUrl: string; 
      approvalStatus: string 
    } 
  };
}
```

## 🎨 State Management

Each evidence item has independent state:

```typescript
{
  urls: { "skill-1": "https://...", "knowledge-2": "https://..." }
  submitted: { "skill-1": true, "knowledge-2": false }
  loading: { "skill-1": false, "knowledge-2": true }
  errors: { "skill-1": "", "knowledge-2": "Error message" }
  approvalStatus: { "skill-1": "APPROVED", "knowledge-2": "PENDING" }
}
```

## ✅ Validation

Client-side validation includes:
- URL format validation (http/https)
- Required field validation
- Authentication check

Server-side validation includes:
- URL accessibility check
- Data integrity validation
- User authorization

## 🧪 Testing

Use the test components for development:

```tsx
// Test individual evidence submission
import { TpqiEvidenceTest } from '@/pages/competencyDetail/components/tpqi';

// Demo with mock data
import { TpqiDemo } from '@/pages/competencyDetail/components/tpqi';
```

## 🔄 Status Flow

1. **Not Submitted** → User enters URL
2. **Validating** → Client-side validation
3. **Submitting** → API call in progress
4. **Submitted** → Evidence sent successfully
5. **Approved/Rejected/Pending** → Admin review status

## 🛠️ Customization

### Custom Evidence Item

```tsx
import { TpqiEvidenceItem } from '@/pages/competencyDetail/components/tpqi';

<TpqiEvidenceItem
  evidence={{ type: 'skill', id: 1 }}
  item={{ 
    id: 1, 
    name: "Custom Skill",
    description: "Custom description" 
  }}
  url={currentUrl}
  approvalStatus="NOT_APPROVED"
  submitted={false}
  loading={false}
  error=""
  onUrlChange={(value) => handleChange(value)}
  onRemove={() => handleRemove()}
  onSubmit={() => handleSubmit()}
/>
```

### Custom Validation

```tsx
import { TpqiEvidenceService } from '@/pages/competencyDetail/services/postTpqiEvidenceAPI';

const evidenceService = new TpqiEvidenceService();

// Validate URL
const validation = evidenceService.validateEvidenceUrl(url);
if (!validation.isValid) {
  console.error(validation.error);
}

// Validate full request
const requestValidation = evidenceService.validateEvidenceRequest({
  skillId: 1,
  evidenceUrl: "https://example.com"
});
```

## 🚨 Error Handling

Common error scenarios:
- Invalid URL format
- Network connectivity issues
- Authentication failures
- Server validation errors
- Evidence already exists (409)

## 📝 Notes

- The system maintains consistency with SFIA evidence structure
- All evidence URLs are validated for accessibility on the server
- State is managed independently per evidence item
- Authentication is required for all evidence operations
- Evidence can be updated before final submission approval
