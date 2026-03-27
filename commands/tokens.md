Help me understand the design tokens in this project.

Look through the project for design tokens — CSS variables, theme files, token definitions, or any named design values.

Organize them into a readable reference guide grouped by type:

---

**Colors**
For each color token:
- Name (what it's called in the code)
- Value (the actual hex/rgb/etc.)
- Purpose (plain English: "Used for primary buttons and links")
- Group by role: backgrounds, text, borders, brand, status (success/error/warning/info)

**Typography**
- Font families and what they're used for
- Type sizes and their intended use (heading 1, body, caption, etc.)
- Font weights available

**Spacing**
- The spacing scale (4px, 8px, 16px, etc.)
- What each size is typically used for (padding inside buttons, gap between sections, etc.)

**Shape**
- Border radius values and when to use each
- Border/stroke widths

**Shadows & elevation**
- Shadow tokens and the visual hierarchy they create

---

**Hardcoded values to fix**
After listing the tokens, scan the codebase for hardcoded values (raw hex colors, pixel values not using tokens, font sizes not referencing the scale).
List any you find with the file and a suggestion for which token to use instead.

---

Write this as a designer-friendly reference, not a code dump.
For colors, if you can describe them visually ("a light warm grey", "vivid blue"), do that alongside the hex value.
If the token naming is confusing or inconsistent, flag it.
