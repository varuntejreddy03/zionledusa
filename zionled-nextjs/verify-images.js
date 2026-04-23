const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const PUBLIC = path.join(ROOT, 'public')
const SRC = path.join(ROOT, 'src')

// ── 1. Load export.json ──
const DATA_PATHS = [
  path.join(ROOT, 'data', 'export.json'),
  path.join(ROOT, '..', 'data', 'export.json'),
]
const dataPath = DATA_PATHS.find(p => fs.existsSync(p))
if (!dataPath) { console.error('export.json not found'); process.exit(1) }
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const products = data.products || []

// ── 2. Replicate getProductImageSrc exactly ──
function getProductImageSrc(image) {
  if (!image) return null
  const candidate = image.webp ?? image.original ?? image.url
  if (!candidate) return null
  if (/^https?:\/\//.test(candidate)) return candidate
  const normalized = candidate
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/^images_optimized\//, '')
    .replace(/^images\//, '')
  return '/assets/' + normalized.split('/').map(s => encodeURIComponent(s)).join('/')
}

// ── 3. Validate file header ──
const SIGS = {
  '.png':  [0x89, 0x50, 0x4e, 0x47],
  '.webp': [0x52, 0x49, 0x46, 0x46], // RIFF
  '.jpg':  [0xff, 0xd8],
  '.jpeg': [0xff, 0xd8],
}
function isValidImage(filePath) {
  try {
    const buf = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const sig = SIGS[ext]
    if (!sig) return buf.length > 0
    if (buf.length < sig.length) return false
    return sig.every((b, i) => buf[i] === b)
  } catch { return false }
}

// ── 4. Scan source for hardcoded image paths ──
function findHardcodedPaths() {
  const paths = []
  const pattern = /["'`](\/[^"'`\s]+\.(?:png|webp|jpg|jpeg|svg|mp4))/g
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory() && !entry.name.startsWith('.')) walk(full)
      else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8')
        let m
        while ((m = pattern.exec(content)) !== null) {
          paths.push({ file: path.relative(ROOT, full), line: content.slice(0, m.index).split('\n').length, src: m[1] })
        }
      }
    }
  }
  walk(SRC)
  return paths
}

// ── 5. Scan public/ folders ──
function scanPublicFolder(subdir) {
  const dir = path.join(PUBLIC, subdir)
  if (!fs.existsSync(dir)) return { exists: false, files: 0, sizeMB: 0, corrupt: 0, corruptList: [] }
  const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile())
  let totalSize = 0, corrupt = 0, corruptList = []
  for (const f of files) {
    const fp = path.join(dir, f)
    totalSize += fs.statSync(fp).size
    if (/\.(png|webp|jpg|jpeg)$/i.test(f) && !isValidImage(fp)) {
      corrupt++
      corruptList.push(f)
    }
  }
  return { exists: true, files: files.length, sizeMB: (totalSize / 1048576).toFixed(1), corrupt, corruptList }
}

// ═══════════════════════════════════════
//  RUN ALL CHECKS
// ═══════════════════════════════════════

console.log('\n╔══════════════════════════════════════════╗')
console.log('║     FULL IMAGE VERIFICATION REPORT       ║')
console.log('╚══════════════════════════════════════════╝\n')

// ── A. Product images from export.json ──
console.log('━━━ A. PRODUCT IMAGES (export.json) ━━━\n')
let total = 0, found = 0, missing = 0, remote = 0, noImage = 0, corrupt = 0
const missingList = [], corruptList = []

for (const product of products) {
  if (!product.images || product.images.length === 0) { noImage++; continue }
  for (const image of product.images) {
    total++
    const src = getProductImageSrc(image)
    if (!src) { missing++; missingList.push({ product: product.name, reason: 'null src' }); continue }
    if (/^https?:\/\//.test(src)) { remote++; continue }
    const filePath = path.join(PUBLIC, decodeURIComponent(src))
    if (!fs.existsSync(filePath)) {
      missing++
      missingList.push({ product: product.name, src, filePath })
    } else if (!isValidImage(filePath)) {
      corrupt++
      corruptList.push({ product: product.name, src, filePath })
    } else {
      found++
    }
  }
}

console.log(`  Products total:          ${products.length}`)
console.log(`  Products w/o images:     ${noImage}`)
console.log(`  Image refs total:        ${total}`)
console.log(`  ✅ Found & valid:        ${found}`)
console.log(`  🌐 Remote URLs:          ${remote}`)
console.log(`  ❌ Missing on disk:      ${missing}`)
console.log(`  ⚠️  Corrupt header:       ${corrupt}`)

if (missingList.length) {
  console.log(`\n  Missing files:`)
  missingList.slice(0, 10).forEach(m => console.log(`    - ${m.product}: ${m.src || m.reason}`))
  if (missingList.length > 10) console.log(`    ... and ${missingList.length - 10} more`)
}
if (corruptList.length) {
  console.log(`\n  Corrupt files:`)
  corruptList.slice(0, 10).forEach(c => console.log(`    - ${c.product}: ${c.src}`))
}

// ── B. Hardcoded image paths in source ──
console.log('\n━━━ B. HARDCODED IMAGE PATHS (src/) ━━━\n')
const hardcoded = findHardcodedPaths()
let hcFound = 0, hcMissing = 0
const hcMissingList = []

for (const h of hardcoded) {
  const filePath = path.join(PUBLIC, decodeURIComponent(h.src))
  if (fs.existsSync(filePath)) {
    hcFound++
  } else {
    hcMissing++
    hcMissingList.push(h)
  }
}

console.log(`  Hardcoded refs found:    ${hardcoded.length}`)
console.log(`  ✅ File exists:          ${hcFound}`)
console.log(`  ❌ File missing:         ${hcMissing}`)

if (hcMissingList.length) {
  console.log(`\n  Missing:`)
  hcMissingList.forEach(h => console.log(`    - ${h.file}:${h.line} → ${h.src}`))
}

// ── C. Public folder scan ──
console.log('\n━━━ C. PUBLIC FOLDER SCAN ━━━\n')
const folders = ['assets/products', 'assets/branding', 'assets/hero', '05', '06', '07', '08', '09', '10', '11', '12', 'scraped']
let totalPublicMB = 0

console.log(`  ${'Folder'.padEnd(20)} ${'Files'.padStart(6)} ${'Size'.padStart(8)} ${'Corrupt'.padStart(8)}  Status`)
console.log(`  ${'─'.repeat(20)} ${'─'.repeat(6)} ${'─'.repeat(8)} ${'─'.repeat(8)}  ${'─'.repeat(12)}`)

for (const folder of folders) {
  const info = scanPublicFolder(folder)
  if (!info.exists) {
    console.log(`  ${folder.padEnd(20)} ${'—'.padStart(6)} ${'—'.padStart(8)} ${'—'.padStart(8)}  not found`)
    continue
  }
  totalPublicMB += parseFloat(info.sizeMB)
  const status = info.corrupt > 0 ? '⚠️  HAS ISSUES' : info.files > 0 ? '✅ OK' : '📁 empty'
  console.log(`  ${folder.padEnd(20)} ${String(info.files).padStart(6)} ${(info.sizeMB + ' MB').padStart(8)} ${String(info.corrupt).padStart(8)}  ${status}`)
  if (info.corruptList.length) {
    info.corruptList.slice(0, 3).forEach(f => console.log(`    ↳ corrupt: ${f}`))
    if (info.corruptList.length > 3) console.log(`    ↳ ... and ${info.corruptList.length - 3} more`)
  }
}

console.log(`\n  Total public images: ${totalPublicMB.toFixed(1)} MB`)

// ── D. Summary ──
const allGood = missing === 0 && corrupt === 0 && hcMissing === 0
console.log('\n━━━ SUMMARY ━━━\n')
if (allGood) {
  console.log('  🎉 ALL IMAGES VERIFIED — no issues found!')
} else {
  const issues = missing + corrupt + hcMissing
  console.log(`  🔴 ${issues} issue(s) found. Fix the items listed above.`)
}
console.log('')
