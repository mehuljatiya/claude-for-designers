import { execSync, spawnSync } from 'child_process'
import { existsSync, mkdirSync, copyFileSync, readdirSync, appendFileSync } from 'fs'
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

  // ── Node version check ───────────────────────────────────────────────────
  const nodeVersion = process.versions.node
  const major = parseInt(nodeVersion.split('.')[0], 10)
  if (major < 20) {
    console.log(chalk.yellow(`  Node.js v${nodeVersion} detected — version 20 or higher is required.\n`))
    await upgradeNode()
    // upgradeNode either re-execs (nvm path) or exits
    process.exit(1)
  }
  console.log(chalk.green(`  ✓ Node.js v${nodeVersion}\n`))

  // ── Step 1: Claude Code ──────────────────────────────────────────────────
  console.log(chalk.bold('Step 1/5') + ' — Claude Code')

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
      npmInstallGlobal('@anthropic-ai/claude-code')
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
  console.log(chalk.bold('Step 2/5') + ' — Installing slash commands')

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
  console.log(chalk.bold('Step 3/5') + ' — Figma ' + chalk.dim('(optional)'))
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

  // ── Step 4: Browser & Figma plugins ─────────────────────────────────────
  console.log(chalk.bold('Step 4/5') + ' — Browser tools')
  console.log(chalk.dim('  Enables /document-component to open a browser preview and push docs into Figma.\n'))

  installPlugin('chrome-devtools-mcp', 'chrome-devtools-plugins', 'Chrome DevTools')
  installPlugin('figma-friend', 'figma-friend-marketplace', 'Figma Friend')

  // ── Step 5: API key ──────────────────────────────────────────────────────
  console.log(chalk.bold('Step 5/5') + ' — API key')

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

function npmInstallGlobal(pkg) {
  try {
    // Pipe stderr so we can inspect it; stdout still streams to terminal
    execSync(`npm install -g ${pkg}`, { stdio: ['inherit', 'inherit', 'pipe'] })
  } catch (err) {
    const stderr = err.stderr?.toString() || ''
    if (!stderr.includes('EACCES') && !stderr.includes('permission denied')) throw err

    // Permission denied — fix npm prefix to user home and retry
    console.log(chalk.yellow('\n  Permission denied. Fixing npm global directory...\n'))
    const npmGlobal = join(homedir(), '.npm-global')

    try {
      mkdirSync(npmGlobal, { recursive: true })
      execSync(`npm config set prefix '${npmGlobal}'`, { stdio: 'pipe' })
      process.env.PATH = join(npmGlobal, 'bin') + ':' + (process.env.PATH || '')
    } catch {
      console.log(chalk.red('  Could not fix npm permissions automatically.'))
      console.log('  Try: ' + chalk.cyan('sudo npm install -g ' + pkg))
      throw new Error('permission-fix-failed')
    }

    // Persist to shell profile
    const shell = process.env.SHELL || ''
    const profileFile = shell.includes('zsh') ? '.zshrc' : '.bashrc'
    const profilePath = join(homedir(), profileFile)
    try {
      appendFileSync(profilePath, `\nexport PATH="$HOME/.npm-global/bin:$PATH"\n`)
      console.log(chalk.dim(`  Added PATH export to ~/${profileFile}`))
    } catch { /* non-critical */ }

    try {
      execSync(`npm install -g ${pkg}`, { stdio: 'inherit' })
    } catch {
      console.log(chalk.red('\n  Install still failed after fixing permissions.'))
      console.log('  Try opening a new terminal tab and re-running:')
      console.log('  ' + chalk.cyan('npx claude-for-designers@latest setup'))
      throw new Error('retry-failed')
    }
  }
}

async function upgradeNode() {
  const nvmScript = join(homedir(), '.nvm', 'nvm.sh')
  const nvmDirEnv = process.env.NVM_DIR ? join(process.env.NVM_DIR, 'nvm.sh') : null

  const nvmPath = nvmDirEnv && existsSync(nvmDirEnv) ? nvmDirEnv
    : existsSync(nvmScript) ? nvmScript
    : null

  if (nvmPath) {
    console.log(chalk.dim('  nvm detected.'))
    const go = await confirm({ message: 'Install Node.js 20 via nvm and continue setup?', default: true }).catch(() => false)
    if (go) {
      console.log(chalk.dim('\n  Installing Node.js 20 — this takes a minute...\n'))
      try {
        execSync(`. "${nvmPath}" && nvm install 20`, { shell: '/bin/bash', stdio: 'inherit' })
        const newNode = execSync(`. "${nvmPath}" && nvm which 20`, { shell: '/bin/bash', encoding: 'utf8', stdio: 'pipe' }).trim()
        console.log(chalk.green('\n  ✓ Node.js 20 installed'))
        console.log(chalk.dim('  Restarting setup with Node.js 20...\n'))
        const result = spawnSync(newNode, process.argv.slice(1), { stdio: 'inherit' })
        process.exit(result.status ?? 0)
      } catch {
        console.log(chalk.red('\n  Node.js upgrade failed.'))
        console.log('  Try manually: ' + chalk.cyan('nvm install 20') + ' then re-run setup.\n')
      }
    }
    return
  }

  try {
    execSync('which brew', { stdio: 'ignore' })
    console.log(chalk.dim('  Homebrew detected.'))
    const go = await confirm({ message: 'Install Node.js 20 via Homebrew?', default: true }).catch(() => false)
    if (go) {
      console.log(chalk.dim('\n  Installing Node.js 20 — this takes a minute...\n'))
      try {
        execSync('brew install node@20 && brew link --overwrite --force node@20', { shell: '/bin/bash', stdio: 'inherit' })
        console.log(chalk.green('\n  ✓ Node.js 20 installed'))
        console.log(chalk.yellow('\n  Open a new terminal tab, then re-run:'))
        console.log('  ' + chalk.cyan('npx claude-for-designers@latest setup\n'))
      } catch {
        console.log(chalk.red('\n  Homebrew install failed.'))
        console.log('  Try manually: ' + chalk.cyan('brew install node@20') + '\n')
      }
    }
    return
  } catch { /* no brew */ }

  console.log('  Download Node.js 20 LTS from: ' + chalk.cyan('https://nodejs.org'))
  console.log('  Install it like any Mac app, then re-run this command.\n')
}

function installPlugin(pluginName, marketplace, label) {
  try {
    const result = execSync('claude plugin list', { encoding: 'utf8', stdio: 'pipe' })
    if (result.toLowerCase().includes(pluginName.toLowerCase())) {
      console.log(chalk.green(`  ✓ ${label} already installed`))
      return
    }
  } catch { /* continue */ }

  try {
    execSync(`claude plugin install ${pluginName}@${marketplace} --scope user`, { stdio: 'pipe' })
    console.log(chalk.green(`  ✓ ${label} installed`))
  } catch {
    console.log(chalk.yellow(`  Could not install ${label} automatically.`))
    console.log('  Run this manually:')
    console.log('  ' + chalk.cyan(`claude plugin install ${pluginName}@${marketplace}`))
  }
  console.log()
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
  try {
    if (!existsSync(commandsDir)) {
      mkdirSync(commandsDir, { recursive: true })
    }
  } catch {
    console.log(chalk.red('  Could not create ~/.claude/commands/'))
    console.log(chalk.dim('  Check permissions on your home directory.'))
    return { installed: [], skipped: [] }
  }

  const sourceDir = join(__dirname, '..', 'commands')
  let files = []
  try {
    files = readdirSync(sourceDir).filter(f => f.endsWith('.md'))
  } catch {
    console.log(chalk.red('  Could not read commands from package — it may be corrupted.'))
    console.log(chalk.dim('  Try re-running: npx claude-for-designers@latest setup'))
    return { installed: [], skipped: [] }
  }

  const installed = []
  const skipped = []

  for (const file of files) {
    const dest = join(commandsDir, file)
    if (existsSync(dest)) {
      skipped.push(file)
    } else {
      try {
        copyFileSync(join(sourceDir, file), dest)
        installed.push(file)
      } catch {
        console.log(chalk.yellow(`  Could not copy ${file} — skipping`))
      }
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
