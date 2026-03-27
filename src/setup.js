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
  console.log(chalk.bold('Step 1/3') + ' — Claude Code')

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
  console.log(chalk.bold('Step 2/3') + ' — Installing design workflows')

  const { installed, skipped } = installSlashCommands()

  if (skipped.length > 0) {
    console.log(chalk.yellow(`  ${skipped.length} workflow(s) already exist — skipping to avoid overwriting`))
    console.log(chalk.dim('  (delete them from ~/.claude/commands/ and re-run to reset)'))
  }
  if (installed.length > 0) {
    console.log(chalk.green(`  ✓ Installed ${installed.length} design workflow(s)`))
  }
  console.log()

  // ── Step 3: API key reminder ─────────────────────────────────────────────
  console.log(chalk.bold('Step 3/3') + ' — API key')

  if (!claudeInstalled) {
    console.log('  You\'ll need an Anthropic API key to use Claude.')
    console.log('  Get one at: ' + chalk.cyan('https://console.anthropic.com'))
    console.log('  When you run ' + chalk.cyan('claude') + ' for the first time, it will ask for it.\n')
  } else {
    console.log(chalk.green('  ✓ Already configured (Claude Code handles this)\n'))
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  showNextSteps()
}

function isClaudeInstalled() {
  try {
    execSync('which claude', { stdio: 'ignore' })
    return true
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

function showNextSteps() {
  console.log('─'.repeat(50))
  console.log(chalk.bold('\nYou\'re all set!\n'))
  console.log('To start:')
  console.log('  1. Open Terminal in your project folder')
  console.log('  2. Type ' + chalk.cyan('design') + ' and press Enter\n')
  console.log('Inside Claude, use these workflows:')
  console.log('  ' + chalk.cyan('/figma') + ' [url]        Pull a Figma design and build it')
  console.log('  ' + chalk.cyan('/new-component') + '      Start a new component from scratch')
  console.log('  ' + chalk.cyan('/document') + '           Write docs for a component')
  console.log('  ' + chalk.cyan('/review') + '             Design quality and consistency check')
  console.log('  ' + chalk.cyan('/tokens') + '             Explain the design tokens in this project')
  console.log('  ' + chalk.cyan('/handoff') + '            Generate a developer handoff doc')
  console.log()
}
