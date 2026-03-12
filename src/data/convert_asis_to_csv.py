import json
import csv

input_path = '/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-processo.json'
output_path = '/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-processo.csv'

# Load JSON
with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Prepare CSV rows
rows = []
for item in data:
    rows.append({
        'step': item.get('step'),
        'fase': item.get('fase'),
        'attore': item.get('attore'),
        'descrizione': item.get('descrizione')
    })

# Write CSV
fieldnames = ['step', 'fase', 'attore', 'descrizione']

with open(output_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Successfully converted to {output_path}")
