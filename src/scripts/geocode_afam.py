import json
import urllib.request
import urllib.parse
import time
import os

# Nominatim usage policy:
# 1. User-Agent is required
# 2. Maximum 1 request per second
# 3. No heavy usage

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?format=json&limit=1&q="

FILE_PATH = "/Users/macbook/Documents/GitHub/isialab-pna-platform/data/pna-istituzioni-afam.json"
BACKUP_PATH = FILE_PATH + ".bak"

def geocode(query):
    try:
        url = NOMINATIM_URL + urllib.parse.quote(query)
        req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                return data[0]['lat'], data[0]['lon']
    except Exception as e:
        print(f"Error geocoding {query}: {e}")
    return None, None

def main():
    if not os.path.exists(FILE_PATH):
        print(f"File {FILE_PATH} not found.")
        return

    with open(FILE_PATH, 'r') as f:
        data = json.load(f)

    # Backup
    with open(BACKUP_PATH, 'w') as f:
        json.dump(data, f, indent=4)

    total = len(data)
    print(f"Starting geocoding of {total} institutions...")

    for i, item in enumerate(data):
        # RESUME logic: if lat looks like a proper float (one dot), skip
        lat_val = str(item.get('lat', ''))
        if '.' in lat_val and lat_val.count('.') == 1:
            # print(f"[{i+1}/{total}] Skipping {item.get('id')} - already geocoded.")
            continue

        # Build query list in order of priority
        queries = []
        # ... rest of logic ...
        address_raw = item.get('address', '').strip()
        city = item.get('citta', '').strip()
        institute = item.get('istituto', '').strip()
        
        def clean_q(q):
            import re
            q = re.sub(r',\s*,', ',', q)
            q = re.sub(r'\s+', ' ', q)
            return q.strip(', ')

        address = clean_q(address_raw) if address_raw else ""
        
        if address:
            queries.append(address)
            parts = address.split(',')
            if len(parts) >= 2:
                street = parts[0].strip()
                queries.append(f"{street}, {city}, Italia")
        
        if institute and city:
            queries.append(f"{institute}, {city}, Italia")
            
        if city:
            queries.append(f"{city}, Italia")

        unique_queries = [q for q in queries if q]
        
        success = False
        for q in unique_queries:
            try:
                print(f"[{i+1}/{total}] Searching: {q}")
                lat, lng = geocode(q)
                if lat and lng:
                    item['lat'] = lat
                    item['lng'] = lng
                    success = True
                    print(f"  Found: {lat}, {lng}")
                    break
                time.sleep(1.5)
            except Exception as e:
                print(f"  Error processing query {q}: {e}")
                time.sleep(5) # Back off

        if not success:
            print(f"  FAILED to geocode {item.get('id')}")
        
        if (i + 1) % 5 == 0:
            with open(FILE_PATH, 'w') as f:
                json.dump(data, f, indent=4)

    # Final save
    with open(FILE_PATH, 'w') as f:
        json.dump(data, f, indent=4)
    print("Geocoding complete.")

if __name__ == "__main__":
    main()
