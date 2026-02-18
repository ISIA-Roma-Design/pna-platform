import json
from collections import defaultdict

def validate_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Generic coordinates (often city centers)
    generic_coords = defaultdict(list)
    for entry in data:
        lat = entry.get('lat')
        lng = entry.get('lng')
        if lat and lng:
            generic_coords[(lat, lng)].append(entry)
    
    print("--- Suspicious Generic Coordinates (shared by multiple institutions) ---")
    for (lat, lng), institutions in generic_coords.items():
        if len(institutions) > 1:
            print(f"Coords: {lat}, {lng} ({len(institutions)} institutions)")
            for inst in institutions:
                print(f"  - {inst.get('istituto')} ({inst.get('address')})")
    
    print("\n--- Missing Coordinates or Addresses ---")
    for entry in data:
        if not entry.get('lat') or not entry.get('lng') or not entry.get('address'):
            print(f"Missing data for: {entry.get('istituto')}")
            print(f"  lat: {entry.get('lat')}, lng: {entry.get('lng')}, address: {entry.get('address')}")

if __name__ == "__main__":
    validate_data('/Users/macbook/Documents/GitHub/isialab-pna-platform/data/pna-istituzioni-afam.json')
