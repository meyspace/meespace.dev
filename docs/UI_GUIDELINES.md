# UI Design Guidelines

Best practices for maintaining consistent UI across the meespace.dev portfolio.

## Color Palette

### Primary Colors
| Name | Value | Usage |
|------|-------|-------|
| `primary` | `#d0e6dc` | Buttons, accents, highlights |
| `primary-dark` | `#b0c9be` | Hover states |
| `accent-purple` | `#e6e6fa` | Secondary accents |

### Text Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `text-main` | `#121715` | `#ffffff` |
| `text-muted` | `#658174` | `#a3b5ae` |

### Background Colors
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `background-light` | `#F5F5F7` | - |
| `background-dark` | - | `#161c19` |
| Card bg | `white` | `#1e1e1e` |

---

## Components

### Buttons

**Always use `bg-primary text-text-main` for primary buttons** - this ensures visibility in both light and dark modes.

```tsx
// ✅ Correct - visible in all themes
<button className="bg-primary hover:bg-primary-dark text-text-main">
  Click Me
</button>

// ❌ Wrong - invisible in some themes
<button className="bg-sage-green text-white">
  Click Me
</button>
```

**Use shared Button component:**
```tsx
import { Button } from "@/components/shared/Button";

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Ghost Button</Button>
```

### Cards

**Always use `rounded-xl`** for cards, not `rounded-card`.

```tsx
// ✅ Correct
<div className="bg-white dark:bg-[#1f2623] rounded-xl border border-gray-100 dark:border-gray-700/50">

// ❌ Wrong
<div className="... rounded-card">
```

**Use shared Card component:**
```tsx
import { Card } from "@/components/shared/Card";

<Card variant="default" padding="md">
  Card content
</Card>
```

### BentoCard (Landing Page)

**Use `BentoCard` component for all landing page grid cards:**

```tsx
import { BentoCard } from "@/components/public/BentoCard";

<BentoCard className="col-span-1 md:col-span-2 p-6">
  Card content
</BentoCard>
```

**BentoCard styling rules:**
- Background: `bg-white dark:bg-[#1f2623]` - consistent in both modes
- Border: `border-gray-100 dark:border-gray-700/50`
- **No hover effects** on cards (no lift, no shadow) - keeps layout stable
- Cards are static containers; interaction is on elements inside

**To override BentoCard background (e.g., CTA card):**
```tsx
// ✅ Correct - use !important to override base styles
<BentoCard className="!bg-primary/20 dark:!bg-primary/10">

// ❌ Wrong - will be overridden by base styles
<BentoCard className="bg-primary/20">
```

### Hover Effects Rule

**Only add hover effects to interactive elements:**

| Element | Hover Effect | Example |
|---------|--------------|---------|
| **Buttons** | ✅ Shadow, opacity, scale | `hover:opacity-90`, `hover:shadow-md` |
| **Links** | ✅ Color change, underline | `hover:text-primary-dark` |
| **Cards that redirect** | ✅ Subtle shadow | `hover:shadow-md cursor-pointer` |
| **Static cards** | ❌ No effect | BentoCard default |

```tsx
// ✅ Clickable card (links to another page)
<Link href="/projects/123">
  <BentoCard className="cursor-pointer hover:shadow-md transition-shadow">
    ...
  </BentoCard>
</Link>

// ✅ Static card (no link) - no hover needed
<BentoCard className="p-6">
  ...
</BentoCard>
```

### Badges

Use the Badge component for status indicators:

```tsx
import { Badge } from "@/components/shared/Badge";

<Badge variant="success" dot>Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="neutral">Archived</Badge>
```

### Tag Pills (Landing Page)

For project/blog tags on landing page:

```tsx
// Tag pill style
<span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 font-medium">
  TAG_NAME
</span>
```

---

## Layout Rules

### Admin Panel
- Navbar: `sticky top-0 z-50`
- Content padding: `px-8`
- Max width: `max-w-[1400px] mx-auto`
- Card spacing: `gap-6`

### Page Headers
Title and actions must align with card content below:
```tsx
<div className="max-w-[1400px] mx-auto px-8">
  <PageHeader title="..." actions={...} />
</div>

<div className="max-w-[1400px] mx-auto px-8">
  <Card>...</Card>
</div>
```

---

## Dark Mode

Always provide dark variants for colors:

```tsx
// ✅ Correct
<div className="bg-white dark:bg-[#1f2623] text-text-main dark:text-white">

// ❌ Wrong - missing dark variant
<div className="bg-white text-black">
```

### Dark Mode Color Hierarchy

| Element | Light Mode | Dark Mode | Notes |
|---------|------------|-----------|-------|
| **Page Background** | `#F5F5F7` | `#161c19` | `var(--background)` |
| **Card Background** | `#ffffff` | `#1f2623` | Slightly lighter than page |
| **Card Border** | `gray-100` | `gray-700/50` | Semi-transparent in dark |
| **Text Main** | `#121715` | `#ffffff` | |
| **Text Muted** | `#658174` | `#a3b5ae` | |

### CSS Variables (globals.css)

```css
:root {
  --card-bg: #ffffff;
  --card-border: #f3f4f6;
}

.dark {
  --card-bg: #1f2623;
  --card-border: rgba(55, 65, 81, 0.5);
}
```

### ❌ Don't use inconsistent dark card colors

```tsx
// ❌ Wrong - different dark bg values
<div className="dark:bg-[#1e1e1e]">    // Card 1
<div className="dark:bg-[#2a2a2a]">    // Card 2
<div className="dark:bg-gray-900">      // Card 3

// ✅ Correct - all cards use same dark bg
<div className="dark:bg-[#1f2623]">    // Card 1
<div className="dark:bg-[#1f2623]">    // Card 2
<div className="dark:bg-[#1f2623]">    // Card 3
```

---

## Shared Components Location

All reusable components are in `src/components/shared/`:

| Component | Purpose |
|-----------|---------|
| `Button` | Primary/secondary/ghost buttons |
| `Card` | Consistent card with rounded-xl |
| `PageHeader` | Page title and description |
| `Badge` | Status badges with variants |
| `Icon` | Material Symbols wrapper |

---

## Spacing Patterns

### Use `flex gap` instead of `space-y`

When pages contain modals or fixed overlays, **always use `flex flex-col gap-6`** instead of `space-y-6`.

```tsx
// ✅ Correct - gap doesn't interfere with fixed modals
<div className="flex flex-col gap-6">
  <Header />
  <Content />
</div>

// ❌ Wrong - space-y creates margin that breaks modal backdrops
<div className="space-y-6">
  <Header />
  <Content />
</div>
```

**Why?** `space-y-*` uses `margin-block-end` which affects the positioning of `position: fixed` elements like modal backdrops, creating visible gaps.

### Content Wrapper Pattern

All admin pages must use consistent content wrapper:

```tsx
// Standard content wrapper
<div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
  {/* Content */}
</div>
```

Key classes:
- `max-w-[1400px]` - Maximum width
- `w-full` - Ensures full width for justify-between
- `mx-auto` - Center alignment
- `px-8` - Horizontal padding
- `pb-8` - Bottom padding

---

## Modal & Overlay Z-Index

Use this z-index hierarchy for proper stacking:

| Element | Z-Index | Purpose |
|---------|---------|---------|
| Sticky Navbar | `z-40` | Admin header |
| Modal Backdrop | `z-[60]` | Dark overlay behind modal |
| Modal Content | `z-[70]` | Modal dialog |

```tsx
// Modal backdrop - must be higher than navbar
<div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]" />

// Modal content - higher than backdrop
<div className="fixed inset-0 flex items-center justify-center z-[70]">
  <div className="bg-white rounded-xl ...">
    {/* Modal content */}
  </div>
</div>
```

---

## Common Pitfalls

### ❌ Don't use `bg-sage-green text-white`

This color combination has poor contrast in both light and dark modes.

```tsx
// ❌ Wrong - invisible button
<button className="bg-sage-green text-white">Save</button>

// ✅ Correct - visible in all modes
<button className="bg-primary hover:bg-primary-dark text-text-main">Save</button>
```

### ❌ Don't use `rounded-card`

Use `rounded-xl` for consistent card corners.

### ❌ Don't forget `w-full` for justify-between

`justify-between` requires the container to have full width:

```tsx
// ❌ Wrong - justify-between may not work
<div className="max-w-[1400px] mx-auto">
  <div className="flex justify-between">...</div>
</div>

// ✅ Correct - w-full ensures full width
<div className="max-w-[1400px] w-full mx-auto">
  <div className="flex justify-between w-full">...</div>
</div>
```

### ❌ Don't use margin-based spacing with fixed overlays

Modal backdrops with `position: fixed` are affected by parent margins. Use gap instead.

---

*Last updated: January 2026*
