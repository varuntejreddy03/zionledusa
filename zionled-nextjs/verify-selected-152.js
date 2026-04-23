const fs = require('fs')

const selected = JSON.parse(fs.readFileSync('data/selected_152_products.json', 'utf8'))
const exportData = JSON.parse(fs.readFileSync('data/export.json', 'utf8'))
const expProducts = exportData.products || []

function norm(s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '') }
function normSku(s) { return (s || '').replace(/[\s-]/g, '').toUpperCase() }

// Build lookup
const expByNorm = new Map()
const expBySku = new Map()
for (const p of expProducts) {
  expByNorm.set(norm(p.name), p)
  if (p.sku) expBySku.set(normSku(p.sku), p)
}

let matched = 0, unmatched = 0
const matchedList = []
const unmatchedList = []

for (const sp of selected) {
  let match = null, method = ''

  // 1. SKU match (normalize spaces/dashes)
  if (sp.sku) {
    // SKU field sometimes has junk text after it, take first part
    const skuClean = sp.sku.split(' Compare')[0].split(' |')[0].trim()
    const nSku = normSku(skuClean)
    if (expBySku.has(nSku)) {
      match = expBySku.get(nSku)
      method = 'sku'
    }
    // Try without trailing spaces in sku
    if (!match) {
      for (const [eSku, ep] of expBySku) {
        if (eSku.includes(nSku) || nSku.includes(eSku)) {
          match = ep
          method = 'sku-partial'
          break
        }
      }
    }
  }

  // 2. Normalized name
  if (!match) {
    const sn = norm(sp.name)
    if (expByNorm.has(sn)) {
      match = expByNorm.get(sn)
      method = 'exact name'
    }
  }

  // 3. Partial name
  if (!match) {
    const sn = norm(sp.name)
    for (const [en, ep] of expByNorm) {
      if (sn.includes(en) || en.includes(sn)) {
        match = ep
        method = 'partial name'
        break
      }
    }
  }

  // 4. Keyword match 40%+
  if (!match) {
    const sWords = sp.name.toLowerCase().split(/\W+/).filter(w => w.length > 2)
    let bestScore = 0, bestMatch = null
    for (const ep of expProducts) {
      const eWords = ep.name.toLowerCase().split(/\W+/).filter(w => w.length > 2)
      const common = sWords.filter(w => eWords.includes(w)).length
      const score = common / Math.max(sWords.length, 1)
      if (score > bestScore && score >= 0.4) {
        bestScore = score
        bestMatch = ep
      }
    }
    if (bestMatch) {
      match = bestMatch
      method = 'keyword ' + Math.round(bestScore * 100) + '%'
    }
  }

  if (match) {
    matched++
    matchedList.push({
      num: sp.number,
      selected: sp.name,
      export: match.name,
      method,
      hasImage: match.images && match.images.length > 0,
      category: sp.category
    })
  } else {
    unmatched++
    unmatchedList.push(sp)
  }
}

console.log('')
console.log('╔══════════════════════════════════════════════════════╗')
console.log('║  SELECTED 152 vs EXPORT.JSON (WEBSITE) MATCH REPORT ║')
console.log('╚══════════════════════════════════════════════════════╝')
console.log('')
console.log(`  Selected products:       ${selected.length}`)
console.log(`  Export.json (website):    ${expProducts.length}`)
console.log('')
console.log(`  ✅ On website:           ${matched} / ${selected.length}`)
console.log(`  ❌ NOT on website:       ${unmatched} / ${selected.length}`)

// Matched without images
const noImg = matchedList.filter(m => !m.hasImage)
if (noImg.length) {
  console.log(`  ⚠️  On website but NO image: ${noImg.length}`)
}

// Missing products
if (unmatchedList.length) {
  console.log('')
  console.log(`━━━ NOT ON WEBSITE (${unmatched} products) ━━━`)
  const byCat = {}
  for (const u of unmatchedList) {
    if (!byCat[u.category]) byCat[u.category] = []
    byCat[u.category].push(u)
  }
  for (const [cat, items] of Object.entries(byCat)) {
    console.log(`\n  📁 ${cat} (${items.length})`)
    items.forEach(i => {
      const sku = i.sku ? i.sku.split(' Compare')[0].split(' |')[0].trim() : 'no SKU'
      console.log(`    ❌ #${i.number} ${i.name}`)
      console.log(`       SKU: ${sku} | Page: ${i.source_page}`)
    })
  }
}

// No image list
if (noImg.length) {
  console.log('')
  console.log(`━━━ ON WEBSITE BUT NO IMAGE (${noImg.length}) ━━━`)
  noImg.forEach(m => console.log(`  ⚠️  #${m.num} ${m.selected}`))
}

// Summary
console.log('')
console.log('━━━ VERDICT ━━━')
if (unmatched === 0 && noImg.length === 0) {
  console.log(`  ✅ ALL ${selected.length} selected products are on the website with images!`)
} else {
  if (unmatched > 0) console.log(`  🔴 ${unmatched} products need to be ADDED to the website.`)
  if (noImg.length > 0) console.log(`  ⚠️  ${noImg.length} products are on the website but have NO image.`)
}
console.log('')
