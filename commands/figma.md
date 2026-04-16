Help me turn a Figma design into working code.

---

## Prerequisites — Check Figma MCP

Before doing anything, call `mcp__claude_ai_Figma__whoami`. If it fails or returns an auth error, stop and tell the user:

> **Setup required before this command can run:**
>
> 1. Open the **Claude desktop app**
> 2. Go to **Settings → Integrations**
> 3. Find **Figma** and click **Enable**
> 4. **Quit and relaunch** Claude Code — the MCP won't load until you restart
> 5. Then re-run `/figma` with your Figma URL
>
> If you've already done this and it still fails, run `claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user` in your terminal, then restart.

Do not proceed until Figma MCP is confirmed working.

---

The user will paste a Figma URL. Here's what to do:

**Step 1 — Read the design**
Use the Figma MCP tools to understand what's being designed:
- Call `get_design_context` with the URL (use `forceCode: true`)
- Get each variant/state individually so you see the full picture
- Call `get_screenshot` to visually confirm what you're seeing

**Step 2 — Describe it before coding**
In plain language (no code), tell the user:
- What kind of component this is (button, card, nav, form field, etc.)
- What states or variants it has
- What the key interaction is

Ask for the component name if it's not obvious from the design.

**Step 3 — Understand the project**
Before writing anything, look at the current project:
- What framework/tech stack is being used?
- What existing components exist to follow as patterns?
- What design tokens or CSS variables are available?
- Never use hardcoded colors, sizes, or fonts — use project tokens

**Step 4 — Build it**
Implement the component following the project's existing patterns.
After building, tell the user:
- What files were created/changed
- How to find and use the component
- Any decisions you made that they might want to adjust

Keep all explanations in plain, friendly language. If you hit something unclear, ask before guessing.

---
If the user hasn't shared a Figma URL yet, ask them for it now.
