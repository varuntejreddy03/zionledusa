# Ledsion Product Scraper

Scrapes full product details from ledsion.com for all 152 products.

## Setup

```bash
cd scraper
pip install -r requirements.txt
```

## Run

```bash
python scrape_products.py
```

## Features

- Extracts: title, SKU, stock, description, key features, applications, package size, weight, images
- Saves progress after every product (resume-safe)
- Handles errors gracefully — skips failed products
- 1.5s delay between requests
- Outputs both JSON and CSV

## Output

- `ledsion_products_enriched.json` — full data with all original + scraped fields
- `ledsion_products_enriched.csv` — flat CSV for spreadsheet use

## Resume

If the script is interrupted, just run it again. It skips already-scraped products.
