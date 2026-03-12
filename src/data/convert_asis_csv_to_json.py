import csv
import json
import os

csv_path = '/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-flussi-asis - pna-processo-asis EXPORT.csv'
json_path = '/Users/macbook/Documents/GitHub/isialab-pna-platform/src/data/pna-processo-asis.json'

result = {
    "system_name": "PNA_ASIS_System",
    "journeys": {}
}

try:
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            journey_id = row['journey']
            if journey_id not in result['journeys']:
                result['journeys'][journey_id] = []
            
            # Create step object
            step = {
                "step_id": int(row['step_id']) if row['step_id'].isdigit() else row['step_id'],
                "phase": row['phase'],
                "actor": row['actor'],
                "action": row['action'],
                "type": row['type']
            }
            
            result['journeys'][journey_id].append(step)

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=4, ensure_ascii=False)

    print(f"Successfully converted CSV to {json_path}")

except Exception as e:
    print(f"Error during conversion: {e}")
