# Educare+ Color Swatches & Quick Reference

## Copy-Paste Color Values

### Primary Brand Colors

```
BRAND BLUE
Hex: #2563EB
RGB: rgb(37, 99, 235)
Tailwind: bg-blue-600

BRAND PURPLE
Hex: #7C3AED
RGB: rgb(124, 58, 237)
Tailwind: bg-violet-600

BRAND GREEN (TEAL)
Hex: #0D9488
RGB: rgb(13, 148, 136)
Tailwind: bg-teal-600

BRAND BLACK
Hex: #1A1A1A
RGB: rgb(26, 26, 26)
Tailwind: bg-gray-950
```

---

## Quick Component Templates

### Primary Button
```jsx
<button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
  Começar Agora
</button>
```

### Baby Category Badge
```jsx
<span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
  Para Bebês
</span>
```

### Mother Category Badge
```jsx
<span className="inline-block bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
  Para Mães
</span>
```

### Professional Category Badge
```jsx
<span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
  Para Profissionais
</span>
```

### Card Container
```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="text-gray-600 mt-2">Card content goes here</p>
</div>
```

### Form Input
```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
  placeholder="Digite aqui..."
/>
```

### Form Label
```jsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  Label Text
</label>
```

### Error State
```jsx
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
  Erro: Algo deu errado
</div>
```

### Success State
```jsx
<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
  ✓ Sucesso! Ação concluída
</div>
```

### Section Heading
```jsx
<h2 className="text-4xl font-bold text-gray-900 mb-6">
  Section Title
</h2>
```

### Subheading
```jsx
<h3 className="text-2xl font-semibold text-gray-800 mb-4">
  Subheading
</h3>
```

### Body Text
```jsx
<p className="text-base text-gray-700 leading-relaxed">
  Regular paragraph text
</p>
```

### Secondary Text
```jsx
<p className="text-sm text-gray-600">
  Secondary information or description
</p>
```

---

## Spacing Quick Reference

| Class | Size | Usage |
|-------|------|-------|
| `p-2` | 8px | Extra padding |
| `p-3` | 12px | Small padding |
| `p-4` | 16px | Default padding |
| `p-6` | 24px | Large padding |
| `gap-2` | 8px | Small gap between items |
| `gap-4` | 16px | Default gap |
| `gap-6` | 24px | Large gap |
| `mb-2` | 8px | Small margin bottom |
| `mb-4` | 16px | Default margin |
| `space-y-2` | 8px | Small vertical spacing |
| `space-y-4` | 16px | Default vertical |

---

## Dark Mode Equivalents

When adding dark mode support:

```jsx
// Text
text-gray-900 -> dark:text-gray-100

// Backgrounds
bg-white -> dark:bg-slate-900
bg-gray-50 -> dark:bg-slate-800

// Borders
border-gray-200 -> dark:border-gray-700

// Cards
bg-white border-gray-200 -> dark:bg-slate-800 dark:border-slate-700
```

---

## Most Used Tailwind Classes Cheatsheet

### Colors (use these 80% of the time)
```
Text: text-gray-900, text-gray-700, text-gray-600, text-blue-600
Background: bg-white, bg-blue-50, bg-gray-50, bg-gray-100
Border: border-gray-200, border-blue-600
```

### Typography
```
text-xs, text-sm, text-base, text-lg, text-2xl, text-4xl
font-medium, font-semibold, font-bold
leading-tight, leading-normal, leading-relaxed
```

### Layout
```
flex, grid, grid-cols-2, grid-cols-3
w-full, h-full, h-screen
mx-auto, justify-center, items-center
```

### Spacing
```
p-4, px-4, py-2, gap-4, space-y-2
mb-4, mt-2, ml-6, mr-2
```

### Borders & Radius
```
border, border-gray-200, rounded-lg, rounded-full
shadow-sm, shadow-md, hover:shadow-lg
```

### States
```
hover:bg-blue-700, focus:ring-2, disabled:opacity-50
transition-colors, duration-200
```

---

## Icon Sizes

All icons from `lucide-react`:

```jsx
// Extra Small - 16px
<Icon className="h-4 w-4" />

// Small - 20px
<Icon className="h-5 w-5" />

// Medium - 24px (default)
<Icon className="h-6 w-6" />

// Large - 32px
<Icon className="h-8 w-8" />

// Extra Large - 40px
<Icon className="h-10 w-10" />
```

---

## Responsive Design Quick Reference

```jsx
// Mobile first approach
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<div className="hidden md:block">
  Only visible on tablet and up
</div>

<div className="md:hidden">
  Hidden on tablet and up
</div>
```

**Breakpoints**:
- `sm`: 640px (rarely used for Educare+)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra wide)

---

## Accessible Color Combinations

Always check WCAG AA contrast (4.5:1 minimum for text):

✅ **Good Combinations:**
- Text: `#000000` on `#FFFFFF` ✓
- Text: `#FFFFFF` on `#2563EB` ✓
- Text: `#000000` on `#EFF6FF` ✓

❌ **Avoid:**
- Light text on light backgrounds
- Low contrast color combinations
- Relying on color alone for meaning (use icons/text too)

---

## Do's & Don'ts

### ✅ DO:
- Use primary blue for main CTAs
- Use categories colors for different user types
- Follow the spacing scale (4px, 8px, 12px, 16px, 24px...)
- Use `text-base` (16px) for body text minimum
- Check contrast ratios with browser dev tools
- Apply `transition-colors` for hover effects

### ❌ DON'T:
- Use custom colors not in this system
- Mix different spacing values arbitrarily
- Use tiny fonts below 12px
- Forget dark mode colors
- Add shadows without purpose
- Use color to convey meaning alone

---

## Common Patterns

### Empty State
```jsx
<div className="text-center py-12">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Nenhum dado disponível
  </h3>
  <p className="text-gray-600">
    Comece adicionando seu primeiro item
  </p>
</div>
```

### Loading State
```jsx
<div className="flex items-center justify-center py-8">
  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
</div>
```

### Alert Box
```jsx
<div className="bg-blue-50 border-l-4 border-blue-600 p-4">
  <p className="text-blue-700 font-medium">
    Informação importante
  </p>
</div>
```

### Stats Card
```jsx
<div className="bg-white p-6 rounded-lg border border-gray-200">
  <p className="text-gray-600 text-sm">Label</p>
  <p className="text-3xl font-bold text-gray-900 mt-2">
    123
  </p>
</div>
```

---

## Version & Last Updated

**Design System Version**: 1.0  
**Last Updated**: December 2025  

For full details, see: `docs/DESIGN_SYSTEM.md`
