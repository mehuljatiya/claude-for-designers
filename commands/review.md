Review this component or design for quality.

If the user hasn't said what to review, ask which component or file they're working on.

Look at the component carefully and evaluate each area below. Be specific — don't just say "looks good", point to exact things.

---

**Consistency**
- Are design tokens and CSS variables used, or are there hardcoded values (colors, spacing, font sizes)?
- Does the visual style match other components in this project?
- Is naming consistent with the rest of the codebase?

**Completeness — states**
Check that all of these are handled (visually and functionally):
- [ ] Default
- [ ] Hover
- [ ] Focus (keyboard)
- [ ] Active / pressed
- [ ] Disabled
- [ ] Loading (if the component triggers async actions)
- [ ] Error / validation
- [ ] Empty state (if the component can have no content)

**Responsiveness**
- Does it work on mobile screen sizes?
- Is text readable and tappable (minimum 44px touch targets)?
- Does it reflow or adapt, or does it break?

**Accessibility**
- Can it be navigated by keyboard alone?
- Is color contrast sufficient for text and icons?
- Are interactive elements labeled for screen readers?
- Does it work with browser zoom up to 200%?

**Edge cases**
- What happens with very long or very short text?
- What if an image fails to load?
- What if there's no data / empty content?

---

Format the review using these ratings for each finding:
✓ **Good** — working as expected, worth calling out
⚠ **Needs attention** — works but could be better; explain why it matters
✗ **Missing** — not handled; explain the impact and how to fix it

End with a short "Priority fixes" list (max 3 items) if there are any ✗ findings.
Write for a designer — plain language, no code jargon unless necessary.
