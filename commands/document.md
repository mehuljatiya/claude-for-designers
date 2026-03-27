Write clear, useful documentation for a component.

If the user hasn't specified which component, ask them which one they want to document.

Find the component in the project and write documentation that includes:

---

**1. What it is**
One clear sentence. What does it do and when would you reach for it?

**2. When to use it**
2–3 specific, realistic use cases.
Also note: when *not* to use it (what to use instead).

**3. Options and configuration**
List every way to configure this component. For each option:
- What it's called (in plain language, not just the prop name)
- What it does visually
- What values are available
- What the default is

Write this for a designer, not a developer. Say "Sets the button to its danger/red style" not "type: 'destructive'".

**4. Visual states**
Describe what changes visually for each state:
- Default
- Hover
- Active / pressed
- Focused (keyboard)
- Disabled
- Loading (if applicable)
- Error (if applicable)

**5. Usage examples**
2–3 realistic examples with a sentence of context for each. When would you actually use this?

**6. Accessibility**
- Can it be used with keyboard only? How?
- What does a screen reader announce?
- Any important color contrast or touch target notes?

---

Save the documentation as `[ComponentName].docs.md` in the same folder as the component.
After saving, confirm the file path and offer a one-line summary of what was documented.
