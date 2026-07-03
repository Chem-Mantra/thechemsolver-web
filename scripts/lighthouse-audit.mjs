#!/usr/bin/env node
// Mobile Lighthouse audit against a locally running instance of the site.
// Usage: npm run audit:lighthouse [-- <url>] [-- --pages=/,/labs,/ap-chemistry]
//
// Requires a server already running at TARGET_URL (default
// http://localhost:3000) — start one with `npm run start` (production
// build, matches what ships) or `npm run dev`.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const reportsDir = path.join(rootDir, 'reports')

const args = process.argv.slice(2)
const baseUrl = process.env.TARGET_URL || args.find((a) => !a.startsWith('--')) || 'http://localhost:3000'
const pagesArg = args.find((a) => a.startsWith('--pages='))
const pages = pagesArg ? pagesArg.replace('--pages=', '').split(',') : ['/', '/labs', '/ap-chemistry']

// Mirrors Lighthouse's built-in "mobile" preset: Moto G Power-class CPU/network
// throttling and a phone-sized emulated viewport.
const MOBILE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 2.625, disabled: false },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4 * 0.9,
      uploadThroughputKbps: 675 * 0.9,
    },
  },
}

async function auditPage(chrome, pagePath) {
  const url = new URL(pagePath, baseUrl).toString()
  const result = await lighthouse(
    url,
    // Lighthouse 10+ dropped the standalone "pwa" category — installability/
    // manifest/service-worker checks live in tests/pwa-installability.spec.ts
    // instead (see npm run test:e2e).
    { port: chrome.port, output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] },
    MOBILE_CONFIG
  )

  const slug = pagePath === '/' ? 'home' : pagePath.replace(/^\//, '').replace(/\//g, '-')
  fs.mkdirSync(reportsDir, { recursive: true })
  fs.writeFileSync(path.join(reportsDir, `${slug}.html`), result.report[0])
  fs.writeFileSync(path.join(reportsDir, `${slug}.json`), result.report[1])

  const { categories } = result.lhr
  return {
    path: pagePath,
    scores: Object.fromEntries(Object.entries(categories).map(([key, cat]) => [key, Math.round(cat.score * 100)])),
  }
}

async function main() {
  console.log(`Auditing ${baseUrl} (mobile) — pages: ${pages.join(', ')}\n`)
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] })

  const results = []
  try {
    for (const p of pages) {
      process.stdout.write(`  ${p} ... `)
      const r = await auditPage(chrome, p)
      results.push(r)
      console.log(JSON.stringify(r.scores))
    }
  } finally {
    await chrome.kill()
  }

  console.log(`\nHTML/JSON reports written to ${path.relative(rootDir, reportsDir)}/`)
  console.table(
    Object.fromEntries(results.map((r) => [r.path, r.scores]))
  )

  const failing = results.filter((r) => Object.values(r.scores).some((s) => s < 80))
  if (failing.length) {
    console.log('\nPages scoring under 80 in at least one category:', failing.map((r) => r.path).join(', '))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
