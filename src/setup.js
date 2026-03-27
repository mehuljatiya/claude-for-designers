import { execSync } from 'child_process'
import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function runSetup() {
  console.log()
  console.log(chalk.bold('Claude for Designers') + ' ✦')
  console.log("Let's get you set up. This takes about 2 minutes.\n")

  // ── Step 1: Claude Code ──────────────────────────────────────────────────
  console.log(chalk.bold('Step 1/4') + ' — Claude Code')

  const claudeInstalled = isClaudeInstalled()

  if (claudeInstalled) {
    console.log(chalk.green('  ✓ Claude Code is already installed\n'))
  } else {
    console.log(chalk.yellow('  Claude Code is not installed.'))

    const shouldInstall = await confirm({
      message: 'Install it now? (requires npm)',
      default: true,
    }).catch(() => false)

    if (!shouldInstall) {
      console.log()
      console.log('No problem. Install it yourself when ready:')
      console.log('  ' + chalk.cyan('npm install -g @anthropic-ai/claude-code'))
      console.log('\nThen re-run: ' + chalk.cyan('npx claude-for-designers setup'))
      process.exit(0)
    }

    console.log(chalk.dim('  Installing...'))
    try {
      execSync('npm install -g @anthropic-ai/claude-code', { stdio: 'inherit' })
      console.log(chalk.green('  ✓ Claude Code installed\n'))
    } catch {
      console.log()
      console.log(chalk.red('  Installation failed.'))
      console.log('  Try running this manually:')
      console.log('  ' + chalk.cyan('npm install -g @anthropic-ai/claude-code'))
      process.exit(1)
    }
  }

  // ── Step 2: Slash commands ───────────────────────────────────────────────
  console.log(chalk.bold('Step 2/4') + ' — Installing design workflows')

  const { installed, skipped } = installSlashCommands()

  if (skipped.length > 0) {
    console.log(chalk.yellow(`  ${skipped.length} workflow(s) already exist — skipping to avoid overwriting`))
    console.log(chalk.dim('  (delete them from ~/.claude/commands/ and re-run to reset)'))
  }
  if (installed.length > 0) {
    console.log(chalk.green(`  ✓ Installed ${installed.length} design workflow(s)`))
  }
  console.log()

  // ── Step 3: Figma MCP ────────────────────────────────────────────────────
  console.log(chalk.bold('Step 3/4') + ' — Figma ' + chalk.dim('(optional)'))
  console.log(chalk.dim('  Lets Claude read your Figma designs directly — no copy-pasting needed.\n'))

  const wantsFigma = await confirm({
    message: 'Connect Figma?',
    default: true,
  }).catch(() => false)

  let figmaConnected = false

  if (wantsFigma) {
    const alreadyConfigured = isFigmaMcpConfigured()

    if (alreadyConfigured) {
      console.log(chalk.green('  ✓ Figma is already configured\n'))
      figmaConnected = true
    } else {
      try {
        execSync(
          'claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user',
          { stdio: 'pipe' }
        )
        console.log(chalk.green('  ✓ Figma MCP configured'))
        console.log(chalk.dim('  One more step: inside Claude, type /mcp → select figma → Authenticate'))
        console.log(chalk.dim('  This connects your Figma account via OAuth (you\'ll only do this once)\n'))
        figmaConnected = true
      } catch {
        console.log(chalk.yellow('  Could not auto-configure Figma.'))
        console.log('  Run this manually after setup:')
        console.log('  ' + chalk.cyan('claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user'))
        console.log()
      }
    }
  } else {
    console.log(chalk.dim('  Skipped. You can always add it later:\n'))
    console.log(chalk.dim('  claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user\n'))
  }

  // ── Step 4: API key ──────────────────────────────────────────────────────
  console.log(chalk.bold('Step 4/4') + ' — API key')

  if (!claudeInstalled) {
    console.log('  You\'ll need a free Anthropic API key.')
    console.log('  Get one at: ' + chalk.cyan('https://console.anthropic.com'))
    console.log('  Claude will ask for it when you first run ' + chalk.cyan('claude') + '.\n')
  } else {
    console.log(chalk.green('  ✓ Already configured\n'))
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  showNextSteps(figmaConnected)
}

function isClaudeInstalled() {
  try {
    execSync('which claude', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function isFigmaMcpConfigured() {
  try {
    const result = execSync('claude mcp list', { encoding: 'utf8', stdio: 'pipe' })
    return result.toLowerCase().includes('figma')
  } catch {
    return false
  }
}

function installSlashCommands() {
  const commandsDir = join(homedir(), '.claude', 'commands')
  if (!existsSync(commandsDir)) {
    mkdirSync(commandsDir, { recursive: true })
  }

  const sourceDir = join(__dirname, '..', 'commands')
  const files = readdirSync(sourceDir).filter(f => f.endsWith('.md'))

  const installed = []
  const skipped = []

  for (const file of files) {
    const dest = join(commandsDir, file)
    if (existsSync(dest)) {
      skipped.push(file)
    } else {
      copyFileSync(join(sourceDir, file), dest)
      installed.push(file)
    }
  }

  return { installed, skipped }
}

function showNextSteps(figmaConnected) {
  console.log('─'.repeat(50))
  console.log(chalk.bold('\nYou\'re all set!\n'))
  console.log('To start:')
  console.log('  1. Open Terminal in your project folder')
  console.log('  2. Type ' + chalk.cyan('design') + ' and press Enter')

  if (figmaConnected) {
    console.log('  3. Inside Claude, type ' + chalk.cyan('/mcp') + ' → figma → Authenticate')
    console.log('     (one-time step to connect your Figma account)\n')
  } else {
    console.log()
  }

  console.log('Available design workflows (type inside Claude):')
  console.log('  ' + chalk.cyan('/figma') + ' [url]        Pull a Figma design and build it')
  console.log('  ' + chalk.cyan('/new-component') + '      Start a new component from scratch')
  console.log('  ' + chalk.cyan('/document') + '           Write docs for a component')
  console.log('  ' + chalk.cyan('/review') + '             Design quality and consistency check')
  console.log('  ' + chalk.cyan('/tokens') + '             Explain the design tokens in this project')
  console.log('  ' + chalk.cyan('/handoff') + '            Generate a developer handoff doc')
  console.log()
}
