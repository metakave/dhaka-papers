import re
import uuid
import datetime

# Configuration
CATEGORY_ID = "68c2d585-6101-49e0-81eb-668b191a0c0a" # Placeholder, will update with real ID
AUTHOR_ID = "92694371-33df-498c-8519-9430c492167d"   # Placeholder, will update with real ID

DEFAULT_IMAGE = "https://images.prothomalo.com/prothomalo-bangla/2023-11/1c313a00-3330-4e00-8000-000000000000/placeholder.jpg"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

input_file = "/Users/musfiqurtuhin/Documents/WorkSpace/political_violence_tracker/backups/prod_backup_20260203_014537.sql"
output_file = "/Users/musfiqurtuhin/Downloads/news_portal/migrated_news.sql"

print(f"Reading from {input_file}...")

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the COPY RawNewsArticle block
match = re.search(r'COPY public\."RawNewsArticle" \(id, url, title, content, "publishedAt", "scrapedAt", "isProcessed", source\) FROM stdin;(.*?)\\\.', content, re.DOTALL)

if not match:
    print("Could not find RawNewsArticle data block.")
    exit(1)

data_block = match.group(1).strip()
lines = data_block.split('\n')

print(f"Found {len(lines)} articles. Processing...")

output_lines = []
# news table: id, author_id, category_id, title, slug, content, thumbnail, status, views_count, published_at, created_at, updated_at
output_lines.append("COPY news (id, author_id, category_id, title, slug, content, thumbnail, status, views_count, published_at, created_at, updated_at) FROM stdin;")

for line in lines:
    parts = line.split('\t')
    if len(parts) < 8:
        continue
    
    # RawNewsArticle columns: id, url, title, content, publishedAt, scrapedAt, isProcessed, source
    # parts[0]: id
    # parts[1]: url
    # parts[2]: title
    # parts[3]: content
    # parts[4]: publishedAt
    # parts[5]: scrapedAt
    
    id_uuid = str(uuid.uuid4())
    title = parts[2]
    content_raw = parts[3].replace('\\n', '\n').replace('\\t', '\t')
    # Clean content for COPY (escape tabs)
    content_escaped = content_raw.replace('\t', '    ').replace('\n', '\\n')
    
    # Slug from title (or URL if needed)
    slug_val = slugify(title)
    if not slug_val:
        slug_val = f"article-{parts[0]}"
    
    # Add unique suffix to slug to avoid collisions
    slug_val = f"{slug_val}-{id_uuid[:8]}"
    
    published_at = parts[4]
    
    # Format line for news table
    # id, author_id, category_id, title, slug, content, thumbnail, status, views_count, published_at, created_at, updated_at
    row = f"{id_uuid}\t{AUTHOR_ID}\t{CATEGORY_ID}\t{title}\t{slug_val}\t{content_escaped}\t{DEFAULT_IMAGE}\tpublished\t0\t{published_at}\t{published_at}\t{published_at}"
    output_lines.append(row)

output_lines.append("\\.")

with open(output_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"Successfully wrote {len(output_lines)-2} rows to {output_file}")
