#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════╗
║   ZION LED USA — WordPress → Next.js Data Scraper       ║
║   Extracts: Products, Categories, Images, Pages, SEO    ║
╚══════════════════════════════════════════════════════════╝

Usage:
    pip install requests beautifulsoup4 Pillow tqdm rich

    # Basic run (scrapes everything)
    python zionled_scraper.py

    # With WooCommerce API keys (gets pricing, stock, full meta)
    python zionled_scraper.py --wc-key ck_xxx --wc-secret cs_xxx

Output Structure:
    data/
    ├── products/          ← One JSON per product
    ├── categories/        ← Category tree JSON
    ├── images/            ← Downloaded originals
    ├── images_optimized/  ← WebP converted (for Next.js)
    ├── pages/             ← Static page content
    └── export.json        ← Single combined file for Next.js
"""

import os, json, re, time, hashlib, argparse, html, urllib.parse
from pathlib import Path
from datetime import datetime

import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("[WARN] Pillow not installed — skipping WebP conversion. pip install Pillow")

try:
    from rich.console import Console
    from rich.table import Table
    console = Console()
    def log(msg, style=""):
        console.print(msg, style=style)
except ImportError:
    def log(msg, style=""):
        print(msg)

# ─────────────────────────────────────────────
#  CONFIG
# ─────────────────────────────────────────────
BASE_URL    = "https://zionledusa.com"
WP_API      = f"{BASE_URL}/wp-json/wp/v2"
WC_API      = f"{BASE_URL}/wp-json/wc/v3"
OUT_DIR     = Path("data")
IMG_DIR     = OUT_DIR / "images"
IMG_OPT_DIR = OUT_DIR / "images_optimized"
PROD_DIR    = OUT_DIR / "products"
CAT_DIR     = OUT_DIR / "categories"
PAGE_DIR    = OUT_DIR / "pages"

SESSION = requests.Session()
SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; ZionLED-Scraper/1.0)",
    "Accept": "application/json, text/html",
})

# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────
def safe_get(url, params=None, auth=None, retries=3):
    for attempt in range(retries):
        try:
            r = SESSION.get(url, params=params, auth=auth, timeout=20)
            r.raise_for_status()
            return r
        except requests.RequestException as e:
            log(f"[WARN] {url} attempt {attempt+1} failed: {e}", "yellow")
            time.sleep(2 ** attempt)
    return None

def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower().strip()).strip("-")

def strip_html(html_str):
    if not html_str:
        return ""
    soup = BeautifulSoup(html_str, "html.parser")
    return html.unescape(soup.get_text(separator=" ", strip=True))

def url_to_filename(url):
    parsed = urllib.parse.urlparse(url)
    name = os.path.basename(parsed.path)
    if not name or "." not in name:
        name = hashlib.md5(url.encode()).hexdigest() + ".jpg"
    return name

def make_dirs():
    for d in [OUT_DIR, IMG_DIR, IMG_OPT_DIR, PROD_DIR, CAT_DIR, PAGE_DIR]:
        d.mkdir(parents=True, exist_ok=True)

# ─────────────────────────────────────────────
#  IMAGE DOWNLOADER + OPTIMIZER
# ─────────────────────────────────────────────
_downloaded_images: dict[str, str] = {}

def download_image(url: str, subdir: str = "") -> dict:
    """Download an image, convert to WebP, return local path info."""
    if not url or url in _downloaded_images:
        return _downloaded_images.get(url, {})

    filename  = url_to_filename(url)
    dest_dir  = IMG_DIR / subdir if subdir else IMG_DIR
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest      = dest_dir / filename
    webp_name = Path(filename).stem + ".webp"
    webp_dest = IMG_OPT_DIR / (subdir or "") / webp_name
    (IMG_OPT_DIR / (subdir or "")).mkdir(parents=True, exist_ok=True)

    # Download original
    if not dest.exists():
        r = safe_get(url)
        if r:
            dest.write_bytes(r.content)
            log(f"  [IMG] {filename}", "dim")

    # Convert to WebP
    if HAS_PIL and dest.exists() and not webp_dest.exists():
        try:
            with Image.open(dest) as img:
                img = img.convert("RGBA") if img.mode in ("P", "RGBA") else img.convert("RGB")
                img.save(webp_dest, "WEBP", quality=85, method=6)
        except Exception as e:
            log(f"  [WARN] WebP convert failed for {filename}: {e}", "yellow")

    result = {
        "original": str(dest.relative_to(OUT_DIR)),
        "webp":     str(webp_dest.relative_to(OUT_DIR)) if webp_dest.exists() else None,
        "url":      url,
        "filename": filename,
    }
    _downloaded_images[url] = result
    return result

# ─────────────────────────────────────────────
#  WORDPRESS REST API — CATEGORIES
# ─────────────────────────────────────────────
def fetch_wp_categories() -> list[dict]:
    """Get all product categories from WP REST API."""
    log("\n[1/5] Fetching categories via WP REST API...", "bold cyan")
    cats = []

    # Try WooCommerce product categories first
    for endpoint in [
        f"{WC_API}/products/categories",
        f"{WP_API}/categories",
        f"{WP_API}/product_cat",
    ]:
        r = safe_get(endpoint, params={"per_page": 100})
        if r:
            try:
                data = r.json()
                if isinstance(data, list) and len(data) > 0:
                    log(f"  ✓ Got {len(data)} categories from {endpoint}", "green")
                    cats = data
                    break
            except Exception:
                pass

    # Fallback: scrape category pages from HTML
    if not cats:
        log("  Falling back to HTML scrape for categories...", "yellow")
        cats = _scrape_categories_html()

    # Normalize structure
    normalized = []
    for c in cats:
        image_info = {}
        img_url = (c.get("image") or {}).get("src") or c.get("image_url") or ""
        if img_url:
            image_info = download_image(img_url, "categories")

        norm = {
            "id":          c.get("id") or c.get("term_id"),
            "name":        strip_html(c.get("name", "")),
            "slug":        c.get("slug", ""),
            "parent":      c.get("parent", 0),
            "count":       c.get("count", 0),
            "description": strip_html(c.get("description", "")),
            "image":       image_info,
            "link":        c.get("link") or c.get("url") or f"{BASE_URL}/category/{c.get('slug', '')}",
        }
        normalized.append(norm)
        path = CAT_DIR / f"{norm['slug']}.json"
        path.write_text(json.dumps(norm, indent=2, ensure_ascii=False), encoding="utf-8")

    log(f"  ✓ {len(normalized)} categories saved", "green")
    return normalized

def _scrape_categories_html() -> list[dict]:
    """Scrape categories directly from the homepage HTML."""
    cats = []
    r = safe_get(BASE_URL)
    if not r:
        return cats
    soup = BeautifulSoup(r.text, "html.parser")
    # WooCommerce category blocks
    for block in soup.select(".product-category, .wc-block-product-category, [class*='cat-item']"):
        link = block.find("a")
        img  = block.find("img")
        name = block.get_text(strip=True)
        if not name:
            continue
        cats.append({
            "id":   None,
            "name": name,
            "slug": slug(name),
            "link": link["href"] if link else "",
            "image_url": img["src"] if img else "",
        })
    return cats

# ─────────────────────────────────────────────
#  WORDPRESS REST API — PRODUCTS
# ─────────────────────────────────────────────
def fetch_products(wc_auth=None) -> list[dict]:
    """Fetch all products. Uses WooCommerce API if keys provided, else scrapes."""
    log("\n[2/5] Fetching products...", "bold cyan")
    products = []

    if wc_auth:
        products = _fetch_products_wc_api(wc_auth)
    
    if not products:
        log("  Trying WordPress REST API...", "yellow")
        products = _fetch_products_wp_api()

    # WP REST API often misses WooCommerce products — always HTML crawl too
    log("  Running HTML crawl to capture all product pages...", "yellow")
    html_products = _scrape_products_html()
    existing_slugs = {p.get("slug") for p in products}
    for p in html_products:
        if p.get("slug") not in existing_slugs:
            products.append(p)
            existing_slugs.add(p.get("slug"))

    log(f"  ✓ {len(products)} products collected", "green")
    return products

def _fetch_products_wc_api(auth) -> list[dict]:
    """Fetch from WooCommerce REST API (requires API keys)."""
    products, page = [], 1
    log("  Using WooCommerce API...", "dim")
    while True:
        r = safe_get(f"{WC_API}/products", params={"per_page": 100, "page": page}, auth=auth)
        if not r:
            break
        batch = r.json()
        if not batch:
            break
        products.extend(batch)
        log(f"    Page {page}: {len(batch)} products", "dim")
        if len(batch) < 100:
            break
        page += 1
    return [_normalize_wc_product(p) for p in products]

def _normalize_wc_product(p: dict) -> dict:
    """Normalize WooCommerce API product to our schema."""
    images = []
    for img in p.get("images", []):
        info = download_image(img.get("src", ""), "products")
        images.append({**info, "alt": img.get("alt", ""), "name": img.get("name", "")})

    attributes = {}
    for attr in p.get("attributes", []):
        attributes[attr.get("name", "").lower()] = attr.get("options", [])

    return {
        "id":           p.get("id"),
        "name":         strip_html(p.get("name", "")),
        "slug":         p.get("slug", ""),
        "sku":          p.get("sku", ""),
        "url":          p.get("permalink", ""),
        "status":       p.get("status", "publish"),
        "description":  strip_html(p.get("description", "")),
        "short_desc":   strip_html(p.get("short_description", "")),
        "price":        p.get("price", ""),
        "regular_price":p.get("regular_price", ""),
        "sale_price":   p.get("sale_price", ""),
        "categories":   [{"id": c["id"], "name": c["name"], "slug": c["slug"]} for c in p.get("categories", [])],
        "tags":         [t["name"] for t in p.get("tags", [])],
        "images":       images,
        "attributes":   attributes,
        "meta_title":   p.get("yoast_head_json", {}).get("title", ""),
        "meta_desc":    p.get("yoast_head_json", {}).get("description", ""),
        "in_stock":     p.get("in_stock", True),
        "stock_qty":    p.get("stock_quantity"),
        "weight":       p.get("weight", ""),
        "dimensions":   p.get("dimensions", {}),
        "scraped_at":   datetime.utcnow().isoformat(),
    }

def _fetch_products_wp_api() -> list[dict]:
    """Fallback: use WP REST API to get 'product' post type."""
    products, page = [], 1
    while True:
        r = safe_get(f"{WP_API}/posts", params={
            "per_page": 100, "page": page,
            "type": "product", "_embed": "true"
        })
        if not r:
            break
        batch = r.json()
        if not isinstance(batch, list) or not batch:
            break
        products.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    normalized = []
    for p in products:
        embed = p.get("_embedded", {})
        images = []
        featured = embed.get("wp:featuredmedia", [{}])
        if featured:
            src = featured[0].get("source_url", "")
            if src:
                images.append(download_image(src, "products"))

        normalized.append({
            "id":          p.get("id"),
            "name":        strip_html(p.get("title", {}).get("rendered", "")),
            "slug":        p.get("slug", ""),
            "url":         p.get("link", ""),
            "description": strip_html(p.get("content", {}).get("rendered", "")),
            "short_desc":  strip_html(p.get("excerpt", {}).get("rendered", "")),
            "images":      images,
            "categories":  [{"name": t["name"], "slug": t["slug"]} for t in embed.get("wp:term", [[]])[0] if embed.get("wp:term")],
            "scraped_at":  datetime.utcnow().isoformat(),
        })
    return normalized

def _scrape_products_html() -> list[dict]:
    """Deep HTML scrape: discover all product URLs then scrape each one."""
    log("  Discovering product URLs...", "dim")
    product_urls = _discover_product_urls()
    log(f"  Found {len(product_urls)} product pages to scrape", "dim")

    products = []
    for url in tqdm(product_urls, desc="  Scraping products"):
        prod = _scrape_single_product(url)
        if prod:
            products.append(prod)
            time.sleep(0.4)  # be polite
    return products

def _discover_product_urls() -> list[str]:
    """Find all product URLs from sitemap or category pages."""
    urls = set()

    # Try XML sitemap first
    for sitemap_url in [
        f"{BASE_URL}/sitemap.xml",
        f"{BASE_URL}/sitemap_index.xml",
        f"{BASE_URL}/product-sitemap.xml",
        f"{BASE_URL}/wp-sitemap.xml",
    ]:
        r = safe_get(sitemap_url)
        if r and "xml" in r.headers.get("content-type", ""):
            soup = BeautifulSoup(r.text, "xml")
            # Handle sitemap index (links to sub-sitemaps)
            for loc in soup.find_all("loc"):
                href = loc.text.strip()
                if "product" in href and href.endswith(".xml"):
                    r2 = safe_get(href)
                    if r2:
                        soup2 = BeautifulSoup(r2.text, "xml")
                        for loc2 in soup2.find_all("loc"):
                            urls.add(loc2.text.strip())
                elif "/product/" in href or (BASE_URL in href and "product" in href):
                    urls.add(href)
            if urls:
                log(f"  Found {len(urls)} product URLs in sitemap", "dim")
                break

    # Crawl all known category/shop pages
    shop_pages = [
        f"{BASE_URL}/shop/",
        f"{BASE_URL}/indoor/",
        f"{BASE_URL}/outdoor/",
        f"{BASE_URL}/light-poles/",
        f"{BASE_URL}/",  # homepage may list products
        # Category sub-pages
        f"{BASE_URL}/product-category/indoor/",
        f"{BASE_URL}/product-category/outdoor/",
        f"{BASE_URL}/product-category/light-poles/",
        f"{BASE_URL}/product-category/ufo-highbay-lights/",
        f"{BASE_URL}/product-category/shoebox-lights/",
        f"{BASE_URL}/product-category/wallpack-lights/",
        f"{BASE_URL}/product-category/flood-lights/",
        f"{BASE_URL}/product-category/canopy-lights/",
        f"{BASE_URL}/product-category/troffer-lights/",
        f"{BASE_URL}/product-category/linear-highbay-lights/",
        f"{BASE_URL}/product-category/backlight-panel-lights/",
        f"{BASE_URL}/product-category/down-lights/",
        f"{BASE_URL}/product-category/vapor-tight-lights/",
        f"{BASE_URL}/product-category/led-bulbs/",
        f"{BASE_URL}/product-category/strip-lights/",
        f"{BASE_URL}/product-category/module-lights/",
    ]

    for page_url in shop_pages:
        r = safe_get(page_url)
        if not r:
            continue
        soup = BeautifulSoup(r.text, "html.parser")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            full = href if href.startswith("http") else BASE_URL + href
            # Match /product/ or ?product= style URLs
            if "/product/" in full and "zionledusa.com" in full:
                # Exclude add-to-cart, gallery, review anchor links
                if "add-to-cart" not in full and "#" not in full:
                    urls.add(full.rstrip("/") + "/")
        time.sleep(0.3)

    log(f"  Total product URLs discovered: {len(urls)}", "dim")
    return list(urls)

def _scrape_single_product(url: str) -> dict | None:
    """Scrape a single WooCommerce product page."""
    r = safe_get(url)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "html.parser")

    # Title
    title_el = soup.select_one(".product_title, h1.entry-title, h1")
    name = strip_html(str(title_el)) if title_el else ""

    # Description
    desc_el = soup.select_one(".woocommerce-product-details__short-description, .entry-summary .woocommerce-product-details__short-description")
    long_desc_el = soup.select_one(".woocommerce-Tabs-panel--description, #tab-description")
    description = strip_html(str(long_desc_el)) if long_desc_el else ""
    short_desc  = strip_html(str(desc_el)) if desc_el else ""

    # Images — main + gallery
    images = []
    for img_el in soup.select(".woocommerce-product-gallery__image img, .wp-post-image, figure.woocommerce-product-gallery__image img"):
        src = img_el.get("data-src") or img_el.get("data-large_image") or img_el.get("src", "")
        if src and "placeholder" not in src:
            info = download_image(src, "products")
            info["alt"] = img_el.get("alt", name)
            images.append(info)

    # Price
    price_el = soup.select_one(".price .woocommerce-Price-amount")
    price = price_el.get_text(strip=True) if price_el else ""

    # SKU
    sku_el = soup.select_one(".sku")
    sku = sku_el.get_text(strip=True) if sku_el else ""

    # Categories
    cat_els = soup.select(".posted_in a")
    categories = [{"name": a.get_text(strip=True), "slug": slug(a.get_text(strip=True))} for a in cat_els]

    # Attributes / specs table
    attributes = {}
    for row in soup.select(".shop_attributes tr, .woocommerce-product-attributes tr"):
        label_el = row.select_one("th, .label")
        value_el = row.select_one("td, .value")
        if label_el and value_el:
            key = label_el.get_text(strip=True).lower()
            val = value_el.get_text(strip=True)
            attributes[key] = val

    # SEO meta
    meta_desc_el = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta_desc_el["content"] if meta_desc_el else ""
    og_title_el = soup.find("meta", property="og:title")
    og_title = og_title_el["content"] if og_title_el else name

    return {
        "name":        name,
        "slug":        slug(name),
        "url":         url,
        "sku":         sku,
        "price":       price,
        "description": description,
        "short_desc":  short_desc,
        "images":      images,
        "categories":  categories,
        "attributes":  attributes,
        "meta_title":  og_title,
        "meta_desc":   meta_desc,
        "scraped_at":  datetime.utcnow().isoformat(),
    }

# ─────────────────────────────────────────────
#  STATIC PAGES
# ─────────────────────────────────────────────
def fetch_pages() -> list[dict]:
    """Fetch About Us, Contact, and any custom pages."""
    log("\n[3/5] Fetching static pages...", "bold cyan")
    pages = []
    page_num = 1
    while True:
        r = safe_get(f"{WP_API}/pages", params={"per_page": 100, "page": page_num, "_embed": "true"})
        if not r:
            break
        batch = r.json()
        if not isinstance(batch, list) or not batch:
            break
        for p in batch:
            content = strip_html(p.get("content", {}).get("rendered", ""))
            page_data = {
                "id":      p.get("id"),
                "title":   strip_html(p.get("title", {}).get("rendered", "")),
                "slug":    p.get("slug", ""),
                "url":     p.get("link", ""),
                "content": content,
                "template":p.get("template", ""),
                "status":  p.get("status", "publish"),
            }
            pages.append(page_data)
            (PAGE_DIR / f"{page_data['slug']}.json").write_text(
                json.dumps(page_data, indent=2, ensure_ascii=False), encoding="utf-8"
            )
        if len(batch) < 100:
            break
        page_num += 1

    log(f"  ✓ {len(pages)} pages saved", "green")
    return pages

# ─────────────────────────────────────────────
#  SITE META (Contact, Address, Social links)
# ─────────────────────────────────────────────
def fetch_site_meta() -> dict:
    """Scrape contact info, social links, and business details from homepage."""
    log("\n[4/5] Scraping site meta / contact info...", "bold cyan")
    meta = {
        "phone": "", "email": "", "address": "",
        "social": {}, "business_hours": "",
        "tagline": "", "logo_url": "",
    }

    r = safe_get(BASE_URL)
    if not r:
        return meta
    soup = BeautifulSoup(r.text, "html.parser")

    # Phone
    for el in soup.find_all(string=re.compile(r"\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")):
        meta["phone"] = el.strip()
        break

    # Email
    for el in soup.find_all("a", href=re.compile(r"mailto:")):
        meta["email"] = el["href"].replace("mailto:", "").strip()
        break

    # Address
    for el in soup.select("[class*='address'], address"):
        text = el.get_text(strip=True)
        if text:
            meta["address"] = text
            break
    # Footer fallback
    if not meta["address"]:
        footer = soup.select_one("footer")
        if footer:
            addr_match = re.search(r"\d+\s+\w+.*?(?:TX|Texas|Dallas).*?\d{5}", footer.get_text(), re.I | re.S)
            if addr_match:
                meta["address"] = addr_match.group().strip()

    # Social links
    for a in soup.find_all("a", href=True):
        href = a["href"]
        for platform in ["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok"]:
            if platform in href.lower() and platform not in meta["social"]:
                meta["social"][platform] = href

    # Logo
    logo = soup.select_one(".nav-logo img, .site-logo img, header img[class*='logo']")
    if logo:
        src = logo.get("src", "")
        if src:
            meta["logo_url"] = src
            download_image(src, "branding")

    # Tagline
    tagline_el = soup.select_one("meta[name='description']")
    if tagline_el:
        meta["tagline"] = tagline_el.get("content", "")

    log(f"  Phone: {meta['phone']}", "dim")
    log(f"  Email: {meta['email']}", "dim")
    log(f"  Social: {list(meta['social'].keys())}", "dim")
    return meta

# ─────────────────────────────────────────────
#  EXPORT COMBINED JSON
# ─────────────────────────────────────────────
def export_combined(categories, products, pages, meta):
    log("\n[5/5] Writing combined export.json...", "bold cyan")

    # Save individual product files
    for p in products:
        s = p.get("slug") or slug(p.get("name", "unknown"))
        (PROD_DIR / f"{s}.json").write_text(json.dumps(p, indent=2, ensure_ascii=False), encoding="utf-8")

    combined = {
        "generated_at": datetime.utcnow().isoformat(),
        "source":       BASE_URL,
        "site_meta":    meta,
        "categories":   categories,
        "products":     products,
        "pages":        pages,
        "stats": {
            "total_products":   len(products),
            "total_categories": len(categories),
            "total_pages":      len(pages),
            "total_images":     len(_downloaded_images),
        }
    }

    export_path = OUT_DIR / "export.json"
    export_path.write_text(json.dumps(combined, indent=2, ensure_ascii=False), encoding="utf-8")

    # Also write a lightweight products index for Next.js static generation
    index = [
        {
            "name":       p.get("name"),
            "slug":       p.get("slug"),
            "categories": p.get("categories", []),
            "thumb":      p.get("images", [{}])[0].get("webp") or p.get("images", [{}])[0].get("original"),
            "short_desc": p.get("short_desc", "")[:120],
        }
        for p in products
    ]
    (OUT_DIR / "products_index.json").write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    log(f"\n  ✅ Export complete!", "bold green")
    log(f"     Products   : {len(products)}", "green")
    log(f"     Categories : {len(categories)}", "green")
    log(f"     Pages      : {len(pages)}", "green")
    log(f"     Images     : {len(_downloaded_images)}", "green")
    log(f"     Output     : {OUT_DIR.resolve()}", "cyan")

# ─────────────────────────────────────────────
#  NEXT.JS HELPER — generate route manifest
# ─────────────────────────────────────────────
def generate_nextjs_routes(products, categories):
    """Generate a routes.json useful for Next.js getStaticPaths."""
    routes = {
        "products": [f"/products/{p['slug']}" for p in products if p.get("slug")],
        "categories": [f"/category/{c['slug']}" for c in categories if c.get("slug")],
    }
    (OUT_DIR / "routes.json").write_text(json.dumps(routes, indent=2), encoding="utf-8")
    log(f"  ✓ routes.json written ({len(routes['products'])} product routes)", "dim")

# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Scrape zionledusa.com for Next.js migration")
    parser.add_argument("--wc-key",    help="WooCommerce Consumer Key (ck_...)")
    parser.add_argument("--wc-secret", help="WooCommerce Consumer Secret (cs_...)")
    parser.add_argument("--skip-images", action="store_true", help="Skip image downloads")
    parser.add_argument("--products-only", action="store_true", help="Only scrape products")
    args = parser.parse_args()

    wc_auth = None
    if args.wc_key and args.wc_secret:
        wc_auth = (args.wc_key, args.wc_secret)
        log("✓ WooCommerce API keys provided — will get full product data", "bold green")

    make_dirs()
    log(f"\n🚀 Starting ZION LED scraper → {BASE_URL}", "bold white")
    log(f"   Output: {OUT_DIR.resolve()}\n", "dim")

    categories = fetch_wp_categories()
    products   = fetch_products(wc_auth)

    if not args.products_only:
        pages = fetch_pages()
        meta  = fetch_site_meta()
    else:
        pages, meta = [], {}

    export_combined(categories, products, pages, meta)
    generate_nextjs_routes(products, categories)

    log("\n🎉 All done! Next steps:", "bold yellow")
    log("   1. cp -r data/ your-nextjs-project/public/scraped/", "dim")
    log("   2. cp data/export.json your-nextjs-project/src/data/", "dim")
    log("   3. Use products_index.json for getStaticPaths()", "dim")
    log("   4. Use images_optimized/ with next/image for WebP", "dim")

if __name__ == "__main__":
    main()