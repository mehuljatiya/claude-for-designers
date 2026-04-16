---
description: Generates a detailed component documentation markdown file from a Figma design system URL, renders it as HTML for browser review, then offers to push the documentation to a Figma FigJam board. Use when the user shares a Figma link to a component documentation page and asks for docs, a .md file, or a written reference.
---

# Document Component

You are generating developer-ready component documentation from a Figma design system page, rendering it for browser review, and optionally publishing it back into Figma.

---

## Step 0 — Prerequisites Check

Before doing anything else, verify the required tools are available and ask for all permissions upfront.

### Check Figma MCP

Call `mcp__claude_ai_Figma__whoami`. If it fails or returns an auth error:

> **Setup required before this skill can run:**
>
> 1. Open the **Claude desktop app**
> 2. Go to **Settings → Integrations** (or Extensions)
> 3. Find **Figma** and click **Enable**
> 4. **Quit and relaunch** Claude Code — the MCP won't load until you restart
> 5. Then re-run `/document-component` with your Figma URL
>
> If you've already done this and it still fails, run `claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user` in your terminal, then restart.

Stop here — do not proceed until Figma MCP is confirmed working.

### Ask for all permissions upfront

Before running any tools, tell the user exactly what you'll need to do:

> "To generate this documentation I'll need to:
> - Read your Figma file (Figma MCP)
> - Create files in the current directory (markdown + HTML)
> - Open the HTML file in your browser
> - Optionally open Figma in Chrome to push the docs (Chrome DevTools MCP)
>
> Approve each tool call as it comes up, or run `/less-permission-prompts` to reduce future prompts."

Do NOT ask one by one as you go — front-load this so the user knows what's coming.

---

## Step 1 — Parse the Figma URL

Extract `fileKey` and `nodeId` from the URL:
- `figma.com/design/:fileKey/:name?node-id=:int-:int` → nodeId = `int:int` (replace `-` with `:`)
- If no URL is provided, ask for one before proceeding.

---

## Step 2 — Fetch the Design Context

Call `get_design_context` on the top-level node. If the result is too large:
1. Read the saved output file
2. Extract all top-level section frame IDs using: `<frame id="..." name="Container" x="32" ...>`
3. Call `get_design_context` on each section ID **in parallel**

Read design component documentation for similar components from the internet from the companies which has good design system available publically like UBER, RAZORPAY, AIRBNB, ATLASSIAN etc. and then decide on the sections for each component by cross referencing it to the figma component whose link was received.

Typical sections in a standard design system doc page:
- Introduction + Anatomy
- Variations
- Props & Tokens including max width, min width, min height and max height wherever available. Do not make up your own limits unless defined in the component properties. 
- Usage Guidelines based on standard guidelines for each component , most components are generic except a few so documentation and usage should be similar for all like in other documentations. 
- Platform


Parse React/Tailwind code for design token values (color hex, spacing, radius, typography).
Use screenshots to visually verify all variants are captured. Do not make any mistake while reading and creating the components documentation using same components as in figma file. The sample to be used in each section should be copied from the figma component itself along with verification and correct mention of tokens used in the exact format in figma. Do not hallucinate when you refer other design system documentation, add only those things that are a part of the provided Figma file. 

---

## Step 3 — Write the Markdown File

Save as `[component-name].md` in the current directory. Follow this exact structure — no placeholders:

```markdown
# [Component Name] — [Design System Name]

> **Source:** [Design System / Documentation](figma-url) · [company].com

---

## Introduction

[One paragraph: what it is, what it does, types/sizes/variants/special modes.]

---

## Anatomy

[Describe each structural part.]

| Part | Description |
|---|---|
| **[part]** | [description] |

```
[ ASCII structure diagram ]
```

---

## Variations

### [Category — e.g. Type]

[One-line description of what this variation controls.]

| Variant | Visual Style | When to use |
|---|---|---|
| **[Name]** | [appearance] | [context] |

---

### [Category — e.g. Size]

| Size | Height | Font Size | Use case |
|---|---|---|---|
| **Large** | [px] | [px] | [use case] |
| **Medium** | [px] | [px] | [use case] |
| **Small** | [px] | [px] | [use case] |

---

### States

Only document states that exist in the Figma file. Do not add states that are not defined.

| State | Description |
|---|---|
| **Default** | Resting state |
| **Hover** | Pointer over element |
| **Focus** | Keyboard / programmatic focus |
| **Pressed** | Actively clicked or tapped |
| **Loading** | Async action in progress |
| **Error** | Validation or system error |
| **Read-only** | Visible but not editable |
| **Disabled** | Non-interactive |

---

## Props & Tokens

### Props

| Prop Name | Required | Type | Default | Description |
|---|---|---|---|---|
| `[prop]` | ✱ / — | `[type]` | `[default]` | [description] |

> ✱ = required

---

### Design Tokens — [Variant]

| Property | Token Name | Value |
|---|---|---|
| [property] | `--[token]` | `[value]` |

---

### Size Tokens

| Size | Height | H. Padding | V. Padding | Min Width |
|---|---|---|---|---|
| Large | `[px]` | `--[token]` ([px]) | `[px]` | `[px]` |
| Medium | `[px]` | `--[token]` ([px]) | `[px]` | `[px]` |
| Small | `[px]` | `--[token]` ([px]) | `[px]` | `[px]` |

---

### Typography

| Type | Style Token | Family | Size | Weight | Line Height |
|---|---|---|---|---|---|
| [type] | `[token]` | `var(--[family])` — [name] | `var(--[size])` — [px] | `var(--[weight])` — [value] | [px] |

---

## Usage Guidelines

### When to use

- [bullet]
- [bullet]

---

### When not to use

- [bullet]
- [bullet]

---

### [Topic]

[One-line rule.]

**✓ Do**
> [Guidance with example.]

**✕ Don't**
> [What to avoid and why.]

---

### Disabled State

- [rule]
- [rule]

---

## Accessibility

### Keyboard Interactions

| Key | Action |
|---|---|
| `Tab` | [description] |
| `Enter` / `Space` | [description] |
| `Esc` | [description] |

---

### ARIA

| Attribute | Value | Notes |
|---|---|---|
| `role` | `[role]` | [when/why] |
| `aria-label` | `[value]` | [when required] |
| `aria-disabled` | `true/false` | [behavior] |

---

### Focus behavior

[Describe focus ring appearance, focus trap behavior if any, and focus restoration after interactions.]

---

### Screen reader

[Describe what is announced on interaction — state changes, error messages, dynamic content.]

---

## Platform

### Desktop
> [Context]
- [rule]

### Tablet
> [Context]
- [rule]

### Mobile
> [Context]
- [rule]

---

## Related Components

| Component | Relationship |
|---|---|
| **[Name]** | [When to use it instead / alongside] |
```

---

## Step 4 — Generate the HTML Preview File

After writing the `.md` file, generate a self-contained `[component-name].html` file in the same directory. The HTML must be production-quality: no external dependencies, fully inline CSS, opens directly in any browser.

### HTML requirements

- Font: system-ui or Inter via Google Fonts CDN (single `<link>` tag is fine)
- Color scheme: white background, `#1b1b1b` text, `#2563eb` accent
- Sticky left sidebar navigation that links to each `##` section
- Render all markdown tables as styled `<table>` elements
- Render `✓ Do` blocks in a green-tinted card (`#f0faf4` bg, `#34a853` border)
- Render `✕ Don't` blocks in a red-tinted card (`#fff4f4` bg, `#ea4335` border)
- Render inline code and code blocks with a monospace font and `#f5f5f5` background
- Render design token names in `<code>` tags with the hex value shown as a small color swatch inline
- Include a fixed header bar with the component name, the design system name (inferred from the Figma file), and a **"Push to Figma →"** button (id=`push-to-figma`, styled in `#1b1b1b` with white text)
- The Push to Figma button shows a `window.alert('Ready to push to Figma. Run /document-component push in Claude Code.')` on click
- Section headings (`##`) get an anchor `id` for sidebar nav deep-linking
- Responsive: sidebar collapses to a top nav on narrow viewports

### HTML template structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Component Name] — [Design System Name]</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    /* Reset, layout, sidebar, typography, tables, do/don't cards, code, color swatches, responsive */
  </style>
</head>
<body>
  <header><!-- component name + "Push to Figma →" button --></header>
  <div class="layout">
    <nav class="sidebar"><!-- section links --></nav>
    <main><!-- all documentation sections --></main>
  </div>
  <script>
    document.getElementById('push-to-figma').onclick = () =>
      alert('Ready to push to Figma.\nRun /document-component with the "push" argument in Claude Code.');
  </script>
</body>
</html>
```

After writing the HTML file, open it in the default browser:
```bash
open [component-name].html
```

---

## Step 5 — Ask to Push to Figma

After the browser opens, ask the user:

> "Documentation is ready and open in your browser. Would you like to push it to Figma as a Figma design file on a browser?"

If the user says **yes** (or passes `push` as an argument), proceed to Step 6.
If the user says **no**, stop here.

---

## Step 6 — Push Documentation to Figma Design File

Use the Chrome DevTools MCP tools to open Figma in the browser and create the documentation as a new page in the design file.

### Process

1. Use `new_page` or `navigate_page` to open the Figma file URL (`figma.com/design/:fileKey/...`) in the browser — navigate directly to the same page the component link points to
2. Wait for Figma to fully load using `wait_for`
3. Use `evaluate_script` to run Figma plugin scripts or interact with the Figma canvas via the browser
4. If the user has a Figma plugin installed in the browser (e.g. via the Figma desktop app or browser extension), use `click`, `type_text`, and `evaluate_script` to drive it
5. Place the documentation on the **same page** as the shared component — do not create a new page
6. Build the documentation layout on canvas using the following structure:

### Layout on canvas

Lay out sections top-to-bottom with clear visual separation. Each section is a labelled frame:

1. **Title frame** — Component name + design system name, large bold text
2. **Introduction** — Text block
3. **Anatomy** — Labeled parts with ASCII or text diagram
4. **Variations** — One frame per variation category; each variant as a labeled row
5. **States** — Row of labeled boxes (only states that exist in Figma)
6. **Props & Tokens** — Table frames: Props table, Design Tokens per variant, Size Tokens, Typography
7. **Usage Guidelines** — When to use / When not to use bullets; ✓ Do and ✕ Don't pairs in green/red frames
8. **Accessibility** — Keyboard table, ARIA table, focus + screen reader notes
9. **Platform** — Three columns: Desktop | Tablet | Mobile
10. **Related Components** — Table of related components

### Fallback

If Figma cannot be driven via Chrome DevTools (e.g. plugin not available, canvas not accessible via script):
- Tell the user what was attempted and why it failed
- Offer to provide the documentation as a copyable text block they can paste manually into Figma

---

## Quality Checklist

Before finishing, verify:

- [ ] `.md` file has no placeholder text
- [ ] Every prop has type, default, and description
- [ ] All design token names start with `--` and have hex/px values
- [ ] Each usage guideline has both a ✓ Do and ✕ Don't
- [ ] "When not to use" section is present
- [ ] States table only includes states defined in Figma — no invented states
- [ ] Accessibility section present for interactive components (keyboard table, ARIA table, focus + screen reader notes)
- [ ] Related Components section present
- [ ] Platform covers Desktop, Tablet, Mobile
- [ ] `.html` file opens correctly in the browser
- [ ] HTML sidebar links to all `##` sections
- [ ] Do/Don't cards render in correct green/red colors
- [ ] "Push to Figma →" button is visible in the header
- [ ] Figma design file page (if pushed) contains all sections in correct order

---

## Notes

- Adapt section names to match whatever the Figma doc uses — not all components have every section
- Accessibility section is required for all interactive components (buttons, inputs, modals, etc.); omit only for purely decorative or static components
- Related Components: include only components that exist in the same design system — do not invent component names
- Additional sections (Changelog, Figma usage notes) go after Related Components in both MD and HTML
- Extract hex values from Tailwind classes: `bg-[#hex]`, `text-[#hex]`, `border-[#hex]`
- Token pattern varies by design system — infer from the Figma file (e.g. `--sds-*`, `--ds-*`, `--color-*`); do not assume a fixed prefix
- If the node is a component (not a doc page), fetch individual variant states in parallel to extract tokens
- The HTML file is the primary review artifact — make it polished enough to share with a design team
