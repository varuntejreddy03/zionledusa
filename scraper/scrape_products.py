"""
Ledsion Product Scraper
Extracts full product details from ledsion.com product pages.
Input: ledsion_green_number_products_152.json
Output: ledsion_products_enriched.json, ledsion_products_enriched.csv
"""

import json
import csv
import time
import re
import os
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ─── Config ───────────────────────────────────────────────────────────────────
INPUT_FILE = Path(__file__).parent.parent / "zionled-nextjs" / "data" / "ledsion_green_number_products_152.json"
OUTPUT_JSON = Path(__file__).parent / "ledsion_products_enriched.json"
OUTPUT_CSV = Path(__file__).parent / "ledsion_products_enriched.csv"
DELAY = 1.5  # seconds between requests
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


# ─── Load Products ────────────────────────────────────────────────────────────
def load_products() -> list[dict]:
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ─── Fetch Page ───────────────────────────────────────────────────────────────
def fetch_page(url: str, retries: int = 3) -> BeautifulSoup | None:
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            if resp.status_code == 200:
                return BeautifulSoup(resp.text, "html.parser")
            if resp.status_code == 429:
                wait = (attempt + 1) * 5
                print(f"    Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue
            print(f"    HTTP {resp.status_code}")
            return None
        except requests.RequestException as e:
            print(f"    Request error (attempt {attempt+1}): {e}")
            time.sleep(2)
    return None


# ─── Parse Product Page ───────────────────────────────────────────────────────
def parse_product_page(soup: BeautifulSoup, url: str) -> dict:
    result = {
        "product_title": None,
        "sku": None,
        "stock_status": None,
        "stock_quantity": None,
        "description": None,
        "key_features": [],
        "suitable_applications": [],
        "package_size": None,
        "weight": None,
        "product_link": url,
        "image_urls": [],
    }

    # ── Title ──
    title_el = soup.select_one("h1.product__title, h1")
    if title_el:
        result["product_title"] = title_el.get_text(strip=True)

    # ── SKU ──
    # Try from JSON-LD first (most reliable)
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            ld = json.loads(script.string)
            if isinstance(ld, dict):
                if ld.get("@type") == "Product" and ld.get("sku"):
                    result["sku"] = ld["sku"]
                    break
                offers = ld.get("offers", {})
                if isinstance(offers, list):
                    offers = offers[0] if offers else {}
                if isinstance(offers, dict) and offers.get("sku"):
                    result["sku"] = offers["sku"]
                    break
        except (json.JSONDecodeError, TypeError):
            continue
    # Fallback: extract from title (after | symbol)
    if not result["sku"] and title_el:
        title_text = title_el.get_text(strip=True)
        if "|" in title_text:
            result["sku"] = title_text.split("|")[-1].strip()
    # Fallback: look for SKU in page text
    if not result["sku"]:
        for el in soup.select(".product__sku, [class*='sku']"):
            text = el.get_text(strip=True)
            match = re.search(r"SKU:\s*(.+)", text, re.IGNORECASE)
            if match and "ledsion" not in match.group(1).lower():
                result["sku"] = match.group(1).strip()
                break

    # ── Stock ──
    stock_el = soup.select_one("[class*='stock'], [class*='inventory'], .product__inventory")
    if stock_el:
        stock_text = stock_el.get_text(strip=True)
        result["stock_status"] = stock_text
        qty_match = re.search(r"(\d+)\s*in\s*stock", stock_text, re.IGNORECASE)
        if qty_match:
            result["stock_quantity"] = int(qty_match.group(1))
    # Try from variant JSON
    if not result["stock_quantity"]:
        for script in soup.select("script"):
            if script.string and "inventory_quantity" in (script.string or ""):
                qty_match = re.search(r'"inventory_quantity"\s*:\s*(\d+)', script.string)
                if qty_match:
                    result["stock_quantity"] = int(qty_match.group(1))
                    result["stock_status"] = f"{result['stock_quantity']} in stock"
                    break

    # ── Description & Features ──
    desc_sections = soup.select(
        ".product__description, .product-description, "
        "[class*='description'], .rte, .product__content"
    )

    full_text = ""
    for section in desc_sections:
        full_text += section.get_text("\n", strip=True) + "\n"

    # Also check tab content / accordion
    tabs = soup.select(".tab-content, .accordion__content, [class*='tab-panel']")
    for tab in tabs:
        full_text += tab.get_text("\n", strip=True) + "\n"

    if full_text.strip():
        result["description"] = _extract_description(full_text)
        result["key_features"] = _extract_list_section(full_text, "key features", "features")
        result["suitable_applications"] = _extract_list_section(full_text, "suitable application")
        result["package_size"] = _extract_field(full_text, "package size")
        result["weight"] = _extract_field(full_text, "weight")
        # Clean: remove "Suitable Applications" from key_features if it leaked in
        result["key_features"] = [f for f in result["key_features"] if "suitable application" not in f.lower()]

    # If no structured features found, try list items
    if not result["key_features"]:
        for section in desc_sections:
            lists = section.select("ul")
            for ul in lists:
                items = [li.get_text(strip=True) for li in ul.select("li") if li.get_text(strip=True)]
                if len(items) >= 3:
                    result["key_features"] = items
                    break
            if result["key_features"]:
                break

    # ── Images ──
    result["image_urls"] = _extract_images(soup)

    return result


# ─── Helper: Extract description paragraph ────────────────────────────────────
def _extract_description(text: str) -> str:
    lines = text.split("\n")
    desc_lines = []
    skip_keywords = [
        "key features", "suitable application", "package size", "weight:",
        "specifications", "ledsion", "toll free", "email:", "phone:",
        "info@ledsion", "dallas", "manufacturer of led", "spec sheet",
    ]
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        lower = stripped.lower()
        if any(kw in lower for kw in skip_keywords):
            if desc_lines:
                break
            continue
        if len(stripped) < 10 and ":" in stripped:
            continue
        desc_lines.append(stripped)
        if len(desc_lines) >= 5:
            break

    return " ".join(desc_lines) if desc_lines else ""


# ─── Helper: Extract list section ─────────────────────────────────────────────
def _extract_list_section(text: str, *keywords: str) -> list[str]:
    lines = text.split("\n")
    items = []
    capture = False
    stop_keywords = [
        "package size", "weight:", "specifications", "note:",
        "ledsion", "toll free", "email:", "phone:", "dallas",
        "info@ledsion", "manufacturer", "spec sheet",
        "suitable applications", "suitable application",
    ]
    for line in lines:
        stripped = line.strip()
        lower = stripped.lower()
        if any(kw in lower for kw in keywords) and not capture:
            capture = True
            after = re.split(r":\s*", stripped, maxsplit=1)
            if len(after) > 1 and after[1]:
                items.append(after[1])
            continue
        if capture:
            if any(kw in lower for kw in stop_keywords):
                break
            if not items and not stripped:
                continue
            if stripped and not stripped.endswith(":"):
                cleaned = re.sub(r"^[\u2022\u25cf\u2713\u2714\-\*]\s*", "", stripped)
                if cleaned and len(cleaned) > 3:
                    items.append(cleaned)
            if len(items) >= 15:
                break
    return items


# ─── Helper: Extract single field ─────────────────────────────────────────────
def _extract_field(text: str, *keywords: str) -> str | None:
    for line in text.split("\n"):
        stripped = line.strip()
        lower = stripped.lower()
        if any(kw in lower for kw in keywords):
            parts = re.split(r":\s*", stripped, maxsplit=1)
            if len(parts) > 1 and parts[1] and len(parts[1]) > 1:
                return parts[1].strip()
    return None


# ─── Helper: Extract images ───────────────────────────────────────────────────
def _extract_images(soup: BeautifulSoup) -> list[str]:
    urls = set()

    # Shopify product images from media/gallery
    for img in soup.select("[class*='product'] img, .product-media img, .product__media img"):
        src = img.get("src") or img.get("data-src") or img.get("srcset", "").split(",")[0].split(" ")[0]
        if src and "cdn.shopify.com" in src:
            # Get highest quality
            clean = re.sub(r"_\d+x\d*\.", ".", src)
            clean = re.sub(r"\?.*$", "", clean)
            if clean.startswith("//"):
                clean = "https:" + clean
            urls.add(clean)

    # From JSON-LD
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            ld = json.loads(script.string)
            if isinstance(ld, dict):
                images = ld.get("image", [])
                if isinstance(images, str):
                    images = [images]
                for img_url in images:
                    if isinstance(img_url, str) and "cdn.shopify.com" in img_url:
                        urls.add(img_url.split("?")[0])
        except (json.JSONDecodeError, TypeError):
            continue

    # From srcset patterns
    for tag in soup.select("img[srcset]"):
        srcset = tag.get("srcset", "")
        for part in srcset.split(","):
            url = part.strip().split(" ")[0]
            if "cdn.shopify.com" in url and "/products/" in url or "/files/" in url:
                clean = re.sub(r"_\d+x\d*\.", ".", url)
                clean = re.sub(r"\?.*$", "", clean)
                if clean.startswith("//"):
                    clean = "https:" + clean
                urls.add(clean)

    return sorted(urls)[:10]  # Max 10 images per product


# ─── Save Outputs ─────────────────────────────────────────────────────────────
def save_outputs(products: list[dict]):
    # JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    # CSV
    if not products:
        return
    # Flatten for CSV
    csv_fields = [
        "Green No", "Product Name", "SKU / Model", "Product Link",
        "product_title", "sku", "stock_status", "stock_quantity",
        "description", "key_features", "suitable_applications",
        "package_size", "weight", "image_urls", "error",
    ]
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore")
        writer.writeheader()
        for p in products:
            row = {**p}
            # Convert lists to strings for CSV
            if isinstance(row.get("key_features"), list):
                row["key_features"] = " | ".join(row["key_features"])
            if isinstance(row.get("suitable_applications"), list):
                row["suitable_applications"] = " | ".join(row["suitable_applications"])
            if isinstance(row.get("image_urls"), list):
                row["image_urls"] = " | ".join(row["image_urls"])
            writer.writerow(row)


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  LEDSION PRODUCT SCRAPER")
    print("=" * 60)
    print(f"\nInput: {INPUT_FILE}")
    print(f"Output: {OUTPUT_JSON}")
    print(f"        {OUTPUT_CSV}")
    print()

    products = load_products()
    total = len(products)
    print(f"Loaded {total} products\n")

    # Resume support: load existing progress
    enriched = []
    if OUTPUT_JSON.exists():
        try:
            with open(OUTPUT_JSON, "r", encoding="utf-8") as f:
                enriched = json.load(f)
            print(f"Resuming from {len(enriched)} already scraped\n")
        except (json.JSONDecodeError, IOError):
            enriched = []

    scraped_links = {p.get("Product Link") for p in enriched if p.get("product_title")}

    for i, product in enumerate(products):
        url = product.get("Product Link", "")
        name = product.get("Product Name", "Unknown")

        # Skip already scraped
        if url in scraped_links:
            continue

        print(f"Scraping {i+1}/{total}: {name[:60]}...")

        if not url or not url.startswith("http"):
            product["error"] = "Invalid URL"
            enriched.append(product)
            save_outputs(enriched)
            continue

        soup = fetch_page(url)
        if not soup:
            product["error"] = "Failed to fetch page"
            enriched.append(product)
            save_outputs(enriched)
            time.sleep(DELAY)
            continue

        try:
            details = parse_product_page(soup, url)
            product.update(details)
            product["error"] = None
            print(f"    ✅ {details.get('product_title', '')[:50]} | {len(details.get('image_urls', []))} imgs")
        except Exception as e:
            product["error"] = str(e)
            print(f"    ❌ Error: {e}")

        enriched.append(product)
        save_outputs(enriched)
        time.sleep(DELAY)

    # Final save
    save_outputs(enriched)

    # Summary
    success = sum(1 for p in enriched if not p.get("error"))
    failed = sum(1 for p in enriched if p.get("error"))
    print(f"\n{'=' * 60}")
    print(f"  DONE: {success} success, {failed} failed, {total} total")
    print(f"  Output: {OUTPUT_JSON}")
    print(f"          {OUTPUT_CSV}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
