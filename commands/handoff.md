Generate a developer handoff document for a component.

If the user hasn't specified which component, ask them.

Create a thorough, precise handoff spec that a developer could use to build this component from scratch. Be exact — use real token names, real pixel values, real behavior descriptions.

---

## [Component Name] — Handoff Spec

**Overview**
What this component is and what problem it solves. Where it lives in the product.

---

**Visual Specs**

| Property | Value |
|---|---|
| Width / Height | |
| Padding | |
| Gap / spacing | |
| Border radius | (token name + px value) |
| Border | (width, style, color token) |
| Background | (token name) |
| Shadow | (token name or none) |

Typography:
- Label: font, size, weight, color token
- (add any other text elements)

---

**States**

For each state, describe exactly what changes visually:

| State | What changes |
|---|---|
| Default | |
| Hover | |
| Focus | |
| Active / pressed | |
| Disabled | |
| Loading | (if applicable) |
| Error | (if applicable) |

Transitions: describe any animations (duration, easing, what animates).

---

**Interactions**

Mouse / touch:
- Click / tap: what happens
- Long press: (if applicable)

Keyboard:
- Tab: focus behavior
- Enter / Space: action
- Escape: (if applicable)
- Arrow keys: (if applicable)

---

**Responsive behavior**

Describe how the component adapts at:
- Mobile (< 768px)
- Tablet (768px – 1024px)
- Desktop (> 1024px)

---

**Accessibility requirements**

- Role: (button, link, checkbox, etc.)
- Required ARIA attributes
- Screen reader announcement on interaction
- Focus visible style
- Minimum touch target size

---

**Open questions**

List anything that still needs a design decision or clarification.

---

Save as `[ComponentName].handoff.md` next to the component file.
Confirm the save location when done.
