# Claude for Designers

The fastest way for designers to start using Claude Code in the terminal — no technical experience required.

Get a full AI-powered design workflow running in 2 minutes.

---

## What you get

**One setup command** that installs everything:
- Claude Code (Anthropic's AI terminal tool)
- 6 pre-built design workflows as slash commands

**A `design` launcher** that starts Claude with a quick-reference cheat sheet.

**6 design slash commands** you can use inside any project:

| Command | What it does |
|---|---|
| `/figma [url]` | Pull a Figma design and build it as code |
| `/new-component` | Create a new component step by step |
| `/document` | Write docs for any component |
| `/review` | Check a component for quality, states, and accessibility |
| `/tokens` | Understand and audit your design tokens |
| `/handoff` | Generate a developer handoff spec |

---

## Setup

You'll need [Node.js 20+](https://nodejs.org) installed. That's it.

```bash
npx claude-for-designers setup
```

This will:
1. Check if Claude Code is installed — offer to install it if not
2. Install the 6 design workflows to `~/.claude/commands/`
3. Walk you through getting an API key (first time only)

---

## Usage

Open Terminal in your project folder and type:

```bash
design
```

Claude opens with a cheat sheet of all available commands.

Once inside Claude, just type a slash command:

```
/figma https://figma.com/design/...
```

```
/review
```

```
/new-component
```

---

## Requirements

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com) (free to start)
- For `/figma`: a [Figma personal access token](https://www.figma.com/settings) + the [Figma MCP server](https://www.figma.com/plugin-docs/mcp/) configured

---

## Updating commands

To get the latest versions of the slash commands:

```bash
# Delete existing commands from ~/.claude/commands/
# then re-run:
npx claude-for-designers setup
```

---

## License

MIT
