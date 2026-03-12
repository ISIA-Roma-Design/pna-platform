import json
import csv

# Load JSON
with open('/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-processo-new.json', 'r') as f:
    data = json.load(f)

journeys = data.get('journeys', {})

# Prepare CSV rows
rows = []
for journey_name, steps in journeys.items():
    for step in steps:
        rows.append({
            'journey': journey_name,
            'step_id': step.get('step_id'),
            'phase': step.get('phase'),
            'actor': step.get('actor'),
            'action': step.get('action'),
            'type': step.get('type')
        })

# Write CSV
fieldnames = ['journey', 'step_id', 'phase', 'actor', 'action', 'type']
output_path = '/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-processo-new.csv'

with open(output_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Successfully converted to {output_path}")
