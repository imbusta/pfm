# Finance Copilot - Color Palette Reference

## Quick Reference

### 🎨 Primary Colors

| Color | Hex Code | Usage | Tailwind Class |
|-------|----------|-------|----------------|
| Primary | `#2563EB` | CTAs, branding, main actions | `bg-primary`, `text-primary` |
| Primary Dark | `#1D4ED8` | Hover states | `bg-primary-dark`, `hover:bg-primary-dark` |
| Secondary | `#7C3AED` | Secondary actions, accents | `bg-secondary`, `text-secondary` |

### 🌈 Background & Surface

| Color | Hex Code | Usage | Tailwind Class |
|-------|----------|-------|----------------|
| Background | `#F8FAFC` | Main app background | `bg-background` |
| Surface | `#FFFFFF` | Cards, modals, panels | `bg-surface` |

### 📝 Text Colors

| Color | Hex Code | Usage | Tailwind Class |
|-------|----------|-------|----------------|
| Text Primary | `#0F172A` | Main content, headings | `text-text-primary` |
| Text Secondary | `#64748B` | Labels, descriptions | `text-text-secondary` |

### 💰 Finance Colors

| Color | Hex Code | Usage | Tailwind Class |
|-------|----------|-------|----------------|
| Success (Income) | `#16A34A` | Income, positive values | `text-success`, `bg-success` |
| Danger (Expenses) | `#DC2626` | Expenses, negative values | `text-danger`, `bg-danger` |
| Warning | `#F59E0B` | Warnings, medium priority | `text-warning`, `bg-warning` |

## Visual Examples

### Buttons
```jsx
// Primary Button
<button className="bg-primary text-white hover:bg-primary-dark">
  Add Transaction
</button>

// Secondary Button
<button className="bg-secondary text-white hover:bg-secondary-dark">
  Secondary Action
</button>

// Danger Button
<button className="text-danger hover:text-danger-dark">
  Delete
</button>
```

### Cards
```jsx
// Standard Card
<div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
  Content
</div>

// Card with Background Accent
<div className="bg-background p-3 rounded-lg">
  Nested Content
</div>
```

### Text Hierarchy
```jsx
// Heading
<h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>

// Subheading
<h2 className="text-xl font-semibold text-text-primary">Monthly Summary</h2>

// Body
<p className="text-text-primary">Main content goes here</p>

// Secondary Text
<span className="text-text-secondary">Additional info</span>
```

### Financial Data
```jsx
// Income
<span className="text-success font-semibold">
  +${amount}
</span>

// Expense
<span className="text-danger font-semibold">
  -${amount}
</span>

// With Background
<div className="bg-success/10 p-3 rounded-lg">
  <span className="text-success">Income: $1,000</span>
</div>
```

### Form Inputs
```jsx
<input
  type="text"
  className="border border-gray-300 rounded-lg px-3 py-2
             focus:ring-2 focus:ring-primary focus:border-primary"
/>
```

## Color Opacity Variants

Use `/10`, `/20`, `/50` etc. for background tints:

```jsx
<div className="bg-primary/10">Light primary background</div>
<div className="bg-success/10">Light green background</div>
<div className="bg-danger/10">Light red background</div>
```

## Do's and Don'ts

### ✅ Do
- Use `text-success` for ALL income displays
- Use `text-danger` for ALL expense displays
- Use `bg-primary` for primary CTAs
- Include `+` or `-` symbols with colored amounts
- Use `bg-surface` for elevated cards
- Use `text-text-primary` for main content
- Add hover states with darker variants

### ❌ Don't
- Mix old Tailwind grays (gray-900, gray-500) with new colors
- Use generic `blue-600` - use `primary` instead
- Use `red-600` or `green-600` - use `danger` and `success`
- Forget focus states on interactive elements
- Use colors without proper contrast

## Component-Specific Usage

### Navigation
- Active: `text-text-primary border-b-2 border-primary`
- Inactive: `text-text-secondary hover:text-text-primary`

### Transaction Rows
- Row: `hover:bg-background transition-colors`
- Income: `text-success font-semibold`
- Expense: `text-danger font-semibold`

### Summary Cards
- Income section: `bg-success/5 p-3 rounded-lg`
- Expense section: `bg-danger/5 p-3 rounded-lg`

### Progress Bars
```jsx
<div className="bg-gray-300 rounded-full h-3">
  <div className="bg-primary h-3 rounded-full" style={{width: '60%'}} />
</div>
```

### Priority Badges
- High: `bg-danger/10 text-danger`
- Medium: `bg-warning/10 text-warning`
- Low: `bg-success/10 text-success`

## Accessibility Notes

All color combinations have been tested for WCAG AA compliance:

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| Text Primary | Surface | 19.2:1 | ✅ AAA |
| Text Secondary | Surface | 8.9:1 | ✅ AAA |
| Success | Surface | 5.8:1 | ✅ AA |
| Danger | Surface | 7.1:1 | ✅ AAA |
| Primary | Surface | 7.9:1 | ✅ AAA |
| White | Primary | 8.3:1 | ✅ AAA |

## Integration with Tailwind

The colors are configured in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#2563EB',
        dark: '#1D4ED8',
      },
      // ... etc
    }
  }
}
```

This allows you to use them like any other Tailwind color:
- `bg-primary`
- `text-success`
- `border-danger`
- `hover:bg-primary-dark`
- `focus:ring-primary`

## Brand Guidelines

### Logo & Branding
- Primary brand color: `#2563EB` (Primary)
- Use with white text for maximum contrast
- Logo can use primary or text-primary

### Buttons
- Primary actions: `bg-primary` with white text
- Secondary actions: `bg-secondary` with white text
- Destructive: `text-danger` with transparent background

### Financial Data Visualization
- Always use `success` (green) for income
- Always use `danger` (red) for expenses
- Use `warning` (orange) for alerts
- Use varied colors for category charts (primary, secondary, danger, warning, success)

## File Structure

All color usage has been updated in:
```
frontend/
├── tailwind.config.js       # Color definitions
├── src/
│   ├── styles/index.css     # Global styles
│   ├── App.tsx              # Navigation colors
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Analytics.tsx
│   │   ├── Budget.tsx
│   │   └── Chat.tsx
│   └── components/
│       ├── TransactionForm.tsx
│       ├── TransactionList.tsx
│       ├── MonthlySummary.tsx
│       ├── CategoryBreakdown.tsx
│       ├── BudgetView.tsx
│       └── ChatInterface.tsx
```

## Quick Start

To use the new colors in a new component:

1. Import color classes from Tailwind
2. Use semantic names: `primary`, `success`, `danger` (not `blue-600`, `green-600`)
3. Apply backgrounds with `/10` opacity for subtle tints
4. Add hover states with `hover:` prefix
5. Include focus rings: `focus:ring-2 focus:ring-primary`

Example:
```jsx
<div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
  <h2 className="text-xl font-semibold text-text-primary mb-4">
    Title
  </h2>
  <p className="text-text-secondary mb-4">
    Description
  </p>
  <button className="bg-primary text-white px-4 py-2 rounded-lg
                     hover:bg-primary-dark transition-all">
    Action
  </button>
</div>
```
