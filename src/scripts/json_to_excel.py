import pandas as pd
import json
import os

def json_to_excel(json_path, excel_path):
    print(f"Reading JSON from {json_path}...")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        df = pd.DataFrame(data)
        
        print(f"Writing Excel to {excel_path}...")
        df.to_excel(excel_path, index=False)
        print("Done!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_file = os.path.join(base_dir, 'data', 'pna-istituzioni-afam.json')
    excel_file = os.path.join(base_dir, 'data', 'pna-istituzioni-afam.xlsx')
    
    json_to_excel(json_file, excel_file)
