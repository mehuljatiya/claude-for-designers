#!/usr/bin/env node
import { execSync } from 'child_process'
import chalk from 'chalk'

console.log('\n' + chalk.bold('Claude for Designers') + ' ✦')
console.log(chalk.dim('Available workflows — type any of these inside Claude:\n'))
console.log('  ' + chalk.cyan('/figma') + ' [url]        Pull a Figma design and build it')
console.log('  ' + chalk.cyan('/new-component') + '      Start a new component from scratch')
console.log('  ' + chalk.cyan('/document') + '           Write docs for a component')
console.log('  ' + chalk.cyan('/review') + '             Design quality and consistency check')
console.log('  ' + chalk.cyan('/tokens') + '             Explain the design tokens in this project')
console.log('  ' + chalk.cyan('/handoff') + '            Generate a developer handoff doc')
console.log()

try {
  execSync('claude', { stdio: 'inherit' })
} catch {
  // claude exited normally or user pressed Ctrl+C
}
