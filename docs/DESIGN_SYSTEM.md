# Educare+ Design System & Brand Identity

## 1. Brand Overview

**Plataforma**: Educare+  
**Missão**: Conectar famílias, educadores e profissionais para apoiar o desenvolvimento infantil com ferramentas baseadas em evidências científicas.  
**Tagline**: "Conectando Famílias, Educadores e Profissionais"

---

## 2. Color Palette

### Primary Colors

#### 2.1 Primary Blue (Marca Principal)
- **Função**: CTA (Call-To-Action), botões principais, links, elementos focados
- **Cor**: Royal Blue
- **Hex**: `#2563EB`
- **RGB**: `rgb(37, 99, 235)`
- **HSL**: `hsl(217, 91%, 53%)`
- **Tailwind**: `blue-600`
- **Uso**: Botões primários ("Começar Agora", "Enviar"), links principais, ícones ativos

#### 2.2 Brand Accent - Purple/Magenta
- **Função**: Destaque secundário, "Famílias", elementos premium
- **Cor**: Purple
- **Hex**: `#7C3AED`
- **RGB**: `rgb(124, 58, 237)`
- **HSL**: `hsl(258, 90%, 58%)`
- **Tailwind**: `violet-600`
- **Uso**: Texto em gradiente, badges destacadas, elementos de categoria

#### 2.3 Brand Accent - Green (Teal)
- **Função**: Destaque terciário, sucesso, "Profissionais", elementos positivos
- **Cor**: Teal/Green
- **Hex**: `#0D9488`
- **RGB**: `rgb(13, 148, 136)`
- **HSL**: `hsl(174, 92%, 32%)`
- **Tailwind**: `teal-600`
- **Uso**: Badges, elementos complementares, ícones de sucesso

#### 2.4 Neutral Black
- **Função**: Texto principal, headings, fundo escuro
- **Cor**: Near Black
- **Hex**: `#000000` / `#1A1A1A`
- **RGB**: `rgb(0, 0, 0)` / `rgb(26, 26, 26)`
- **HSL**: `hsl(0, 0%, 0%)` / `hsl(0, 0%, 10%)`
- **Tailwind**: `black` / `gray-950`
- **Uso**: Headlines, primary text, high-contrast elements

### Secondary Colors

#### 2.5 Light Blue Background
- **Função**: Background suave, cards, seções alternadas
- **Hex**: `#EFF6FF`
- **RGB**: `rgb(239, 246, 255)`
- **HSL**: `hsl(210, 100%, 97%)`
- **Tailwind**: `blue-50`
- **Uso**: Backgrounds de seções, cards secundários, hover states

#### 2.6 Light Gray
- **Função**: Borders, dividers, backgrounds leves
- **Hex**: `#F3F4F6`
- **RGB**: `rgb(243, 244, 246)`
- **HSL**: `hsl(210, 14%, 96%)`
- **Tailwind**: `gray-100`
- **Uso**: Separadores, backgrounds neutros, inputs desabilitados

#### 2.7 Destructive/Error Red
- **Função**: Erros, avisos, ações destrutivas
- **Hex**: `#DC2626`
- **RGB**: `rgb(220, 38, 38)`
- **HSL**: `hsl(0, 84%, 50%)`
- **Tailwind**: `red-600`
- **Uso**: Mensagens de erro, botões delete, estados críticos

#### 2.8 Success Green
- **Função**: Sucesso, confirmação, estados positivos
- **Hex**: `#16A34A`
- **RGB**: `rgb(22, 163, 74)`
- **HSL**: `hsl(142, 76%, 36%)`
- **Tailwind**: `green-600`
- **Uso**: Checkmarks, confirmação, status positivos

### Palette de Gráficos & Charts

| Chart | Hex | HSL | Tailwind |
|-------|-----|-----|----------|
| Chart 1 (Orange) | #FF7F50 | hsl(12, 100%, 63%) | orange-400 |
| Chart 2 (Teal) | #2BB8A0 | hsl(173, 58%, 42%) | teal-500 |
| Chart 3 (Dark Blue) | #1F2B47 | hsl(216, 38%, 20%) | slate-800 |
| Chart 4 (Yellow) | #FDB022 | hsl(43, 100%, 60%) | yellow-400 |
| Chart 5 (Orange-Red) | #FF8C42 | hsl(27, 100%, 60%) | orange-500 |

### Dark Mode Palette

#### Background Dark
- **Light**: `#FFFFFF`
- **Dark**: `#1C1C2E` (hsl(222, 47%, 11%))

#### Text Dark  
- **Light**: `#000000`
- **Dark**: `#F8FAFC` (hsl(210, 40%, 98%))

#### Primary Dark
- **Light**: `#2563EB` (blue-600)
- **Dark**: `#60A5FA` (blue-400)

---

## 3. Typography

### Font Family

**Primary Font**: `Inter`
- **Category**: Sans-serif
- **Weight**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Usage**: All text across the platform
- **Installation**: Already included in project via Tailwind

**Fallback Stack**:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
```

### Typography Scale

#### Headings

| Component | Size | Weight | Line Height | Tailwind Class | Usage |
|-----------|------|--------|-------------|----------------|-------|
| H1 | 48px | 700 (Bold) | 1.2 | `text-5xl font-bold` | Page titles, main hero |
| H2 | 36px | 700 (Bold) | 1.3 | `text-4xl font-bold` | Section titles |
| H3 | 28px | 700 (Bold) | 1.4 | `text-3xl font-bold` | Subsection titles |
| H4 | 24px | 600 (Semibold) | 1.4 | `text-2xl font-semibold` | Card titles |
| H5 | 20px | 600 (Semibold) | 1.5 | `text-xl font-semibold` | Small titles |
| H6 | 16px | 600 (Semibold) | 1.5 | `text-base font-semibold` | Form labels |

#### Body Text

| Component | Size | Weight | Line Height | Tailwind Class | Usage |
|-----------|------|--------|-------------|----------------|-------|
| Body Large | 18px | 400 (Regular) | 1.6 | `text-lg` | Large paragraphs, descriptions |
| Body Regular | 16px | 400 (Regular) | 1.6 | `text-base` | Default body text |
| Body Small | 14px | 400 (Regular) | 1.5 | `text-sm` | Secondary info, captions |
| Body Tiny | 12px | 400 (Regular) | 1.4 | `text-xs` | Helper text, timestamps |

#### Button Text

| Component | Size | Weight | Line Height | Tailwind Class | Usage |
|-----------|------|--------|-------------|----------------|-------|
| Button Large | 16px | 600 (Semibold) | 1.5 | `text-base font-semibold` | Primary CTA |
| Button Regular | 14px | 600 (Semibold) | 1.5 | `text-sm font-semibold` | Default button |
| Button Small | 12px | 600 (Semibold) | 1.4 | `text-xs font-semibold` | Compact button |

---

## 4. Component Colors

### Buttons

#### Primary Button
```css
Background: #2563EB (blue-600)
Text: #FFFFFF (white)
Hover: #1D4ED8 (blue-700)
Active: #1E40AF (blue-800)
Disabled: #D1D5DB (gray-300)
```

#### Secondary Button
```css
Background: #F3F4F6 (gray-100)
Text: #1F2937 (gray-800)
Border: #E5E7EB (gray-200)
Hover: #E5E7EB (gray-200)
```

#### Destructive Button
```css
Background: #DC2626 (red-600)
Text: #FFFFFF (white)
Hover: #991B1B (red-800)
```

### Badges & Tags

#### Category Badges
- **Baby**: Blue background (`#3B82F6`), white text
- **Mother**: Purple background (`#8B5CF6`), white text  
- **Professional**: Green background (`#10B981`), white text
- **General**: Gray background (`#6B7280`), white text

### Cards & Containers

#### Card Container
```css
Light Mode:
  Background: #FFFFFF (white)
  Border: #E5E7EB (gray-200)
  Shadow: 0 1px 2px rgba(0,0,0,0.05)

Dark Mode:
  Background: #1E293B (slate-800)
  Border: #334155 (slate-700)
  Shadow: 0 1px 2px rgba(0,0,0,0.2)
```

#### Input Fields
```css
Light Mode:
  Background: #FFFFFF (white)
  Border: #D1D5DB (gray-300)
  Focus: #2563EB (blue-600)
  Focus Border: 2px solid blue-600

Dark Mode:
  Background: #1F2937 (gray-800)
  Border: #4B5563 (gray-600)
  Focus: #60A5FA (blue-400)
```

---

## 5. Spacing System

Based on 0.5rem (8px) unit:

| Value | Size | CSS | Usage |
|-------|------|-----|-------|
| xs | 4px | 0.25rem | Micro spacing |
| sm | 8px | 0.5rem | Small gaps |
| md | 12px | 0.75rem | Default padding |
| lg | 16px | 1rem | Medium spacing |
| xl | 24px | 1.5rem | Large spacing |
| 2xl | 32px | 2rem | Extra large |
| 3xl | 48px | 3rem | Hero spacing |

**Applied in**: `p-2`, `p-3`, `p-4`, `m-2`, `gap-4`, etc.

---

## 6. Border Radius

| Value | Size | Tailwind | Usage |
|-------|------|----------|-------|
| None | 0px | `rounded-none` | Sharp corners |
| Small | 4px | `rounded-sm` | Input fields |
| Medium | 8px | `rounded-md` | Cards, buttons |
| Large | 12px | `rounded-lg` | Large sections |
| Full | 9999px | `rounded-full` | Avatars, pills |

**Default**: 8px (`--radius: 0.5rem`)

---

## 7. Shadows

| Type | CSS | Usage |
|------|-----|-------|
| None | none | Flat design |
| Small | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| Medium | `0 4px 6px rgba(0,0,0,0.1)` | Standard cards |
| Large | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| XL | `0 20px 25px rgba(0,0,0,0.1)` | Hero sections |

---

## 8. Iconography

### Icon Guidelines
- **Style**: Outlined or filled (consistent within sections)
- **Size Palette**:
  - Extra Small: 16px (xs)
  - Small: 20px (sm)
  - Medium: 24px (md) - default
  - Large: 32px (lg)
  - Extra Large: 40px (xl)

### Icon Colors
- **Primary**: Match primary text color
- **Secondary**: Match secondary text color
- **Accent**: Use brand accent colors for active/hover states
- **Disabled**: Use muted foreground

### Icon Library
- **Primary**: Lucide React (`lucide-react`)
- **Size**: Default `h-4 w-4` (16px), scale as needed

---

## 9. Form Elements

### Input Styles
```css
Height: 40px (py-2)
Padding: 12px 16px (px-4 py-2)
Border: 1px solid gray-300
Border Radius: 8px
Font Size: 16px
Line Height: 1.5
Focus: Blue-600 border, shadow outline

Light Mode:
  Background: #FFFFFF
  Border: #D1D5DB
  Focus Border: #2563EB

Dark Mode:
  Background: #1F2937
  Border: #4B5563
  Focus Border: #60A5FA
```

### Label Styles
```css
Font Weight: 500 (Medium)
Font Size: 14px
Color: Gray-700 / Gray-300 (dark)
Margin Bottom: 8px
```

### Error States
```css
Border Color: #DC2626 (red-600)
Text Color: #DC2626 (red-600)
Background: #FEE2E2 (red-50)
Icon Color: #DC2626
```

### Success States
```css
Border Color: #16A34A (green-600)
Text Color: #16A34A (green-600)
Background: #ECFDF5 (green-50)
Icon Color: #16A34A
```

---

## 10. Navigation & Layout

### Header/Navbar
- **Height**: 64px
- **Background**: White (light) / Slate-900 (dark)
- **Border Bottom**: 1px solid gray-200 (light) / gray-800 (dark)
- **Padding**: 0 24px
- **Logo**: 120px max width

### Sidebar (when applicable)
- **Width**: 256px (expanded) / 64px (collapsed)
- **Background**: Gray-50 (light) / Slate-950 (dark)
- **Border Right**: 1px solid gray-200
- **Text Color**: Gray-700 (light) / Gray-300 (dark)

---

## 11. Responsive Breakpoints

| Breakpoint | Width | Device | Tailwind |
|-----------|-------|--------|----------|
| Mobile | 320px - 640px | Phone | `sm` |
| Tablet | 641px - 1024px | iPad | `md` to `lg` |
| Desktop | 1025px - 1440px | Desktop | `xl` |
| Wide | 1441px+ | Large screens | `2xl` |

---

## 12. Animations & Transitions

### Standard Transitions
```css
Default: 150ms ease-in-out
Hover: 200ms ease-out
Modal: 300ms ease-out
Drawer: 250ms ease-in-out

Apply: transition-colors, transition-opacity, transition-all
```

### Keyframe Animations
- **Accordion**: Open/close 200ms ease-out
- **Fade In**: 300ms from opacity 0 to 1
- **Slide In**: 250ms from transform -4px to 0

---

## 13. Accessibility Standards

### Contrast Ratios (WCAG AA)
- **Primary Text on White**: 4.5:1 minimum
- **Secondary Text on White**: 3:1 minimum
- **UI Components**: 3:1 minimum

### Font Sizes
- **Minimum readable**: 12px (with 1.5 line-height)
- **Body text**: 16px default (1.6 line-height)
- **Headings**: Scale properly (see Typography section)

### Focus States
- **Visible focus indicator**: 2px solid blue-600 outline
- **Focus color**: High contrast with background
- **Never remove outline**: Use `ring` instead

### Color Usage
- **Never rely on color alone** for information
- Use icons, text, or patterns in addition to color

---

## 14. Content Guidelines

### Tone & Voice
- **Professional but approachable**
- **Clear and direct** language
- **Supportive and encouraging**
- **Evidence-based and credible**
- **Inclusive language** (gender-neutral when possible)

### Writing Standards
- Use **Portuguese (Brazilian)**
- Capitalize proper nouns
- Use **"você"** for 2nd person (more informal, friendly)
- Use **oxford comma** in lists
- Avoid ALL CAPS (except acronyms)

---

## 15. Usage Guide for Content Creators

### How to Apply This Design System

#### 1. Color Usage

**Primary Actions**:
```jsx
<button className="bg-blue-600 text-white hover:bg-blue-700">
  Começar Agora
</button>
```

**Category Distinctions**:
```jsx
// Baby content - Blue
<Badge className="bg-blue-100 text-blue-700">Para Bebês</Badge>

// Mother content - Purple
<Badge className="bg-violet-100 text-violet-700">Para Mães</Badge>

// Professional content - Green
<Badge className="bg-teal-100 text-teal-700">Para Profissionais</Badge>
```

#### 2. Typography

**Headings**:
```jsx
<h1 className="text-5xl font-bold text-black">Page Title</h1>
<h2 className="text-4xl font-bold text-gray-900">Section Title</h2>
<h3 className="text-3xl font-bold text-gray-800">Subsection</h3>
```

**Body**:
```jsx
<p className="text-base text-gray-700 leading-relaxed">
  Regular paragraph text
</p>
<p className="text-sm text-gray-600">Secondary information</p>
```

#### 3. Forms

```jsx
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    Nome do Bebê
  </label>
  <input
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
    placeholder="Digite aqui..."
  />
</div>
```

#### 4. Cards

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="mt-2 text-gray-600">Card description</p>
</div>
```

#### 5. Spacing

```jsx
// Use Tailwind spacing utilities
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Or explicit padding
<div className="p-6 gap-4">Content</div>
```

---

## 16. Quick Reference

### Most Common Tailwind Classes

```css
/* Colors */
text-blue-600, bg-blue-50, border-gray-300
text-violet-600, bg-violet-50
text-teal-600, bg-teal-50

/* Typography */
text-5xl, text-4xl, text-3xl, text-2xl, text-base, text-sm, text-xs
font-bold, font-semibold, font-medium, font-regular
leading-tight, leading-normal, leading-relaxed

/* Spacing */
p-6, px-4, py-2, gap-4, space-y-2
m-0, mx-auto, my-4

/* Borders */
border, border-gray-200, rounded-lg
divide-y, divide-gray-200

/* Shadows */
shadow-sm, shadow-md, shadow-lg

/* Responsive */
sm:text-lg, md:grid-cols-2, lg:text-xl
```

---

## 17. Brand Assets Location

- **Logos**: `/public/assets/logos/`
- **Icons**: Lucide React library (`lucide-react`)
- **Images**: `/public/assets/images/`
- **Stylesheets**: `/src/index.css`
- **Tailwind Config**: `tailwind.config.ts`
- **CSS Variables**: `:root {}` in `src/index.css`

---

## 18. Maintenance & Updates

**Last Updated**: December 2025
**Version**: 1.0

### Future Considerations
- Monitor accessibility compliance quarterly
- Update brand colors if rebranding occurs
- Extend component library as needed
- Maintain Tailwind utilities consistency

---

## 19. Support & Questions

For design system questions or updates:
1. Check this document first
2. Review existing components in `/src/components/`
3. Reference `tailwind.config.ts` for Tailwind configuration
4. Update this document when making design changes

---

**End of Design System Document**
