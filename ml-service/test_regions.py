import json
from pathlib import Path

# Load JSON
json_path = Path(__file__).parent / "data" / "region_mapping.json"
print(f"📂 Loading from: {json_path}")
print(f"   Exists: {json_path.exists()}")

if json_path.exists():
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    print(f"\n✅ JSON loaded successfully!")
    print(f"   Total regions: {len(data['regions'])}")
    
    # Test coordinates
    test_coords = [
        (30.9010, 75.8573, "Ludhiana"),
        (29.0728, 77.7085, "Meerut"),
        (19.8762, 75.3433, "Aurangabad"),
        (22.5645, 72.9289, "Anand"),
        (25.4182, 86.1334, "Begusarai")
    ]
    
    print("\n🔍 Testing coordinates:")
    for lat, lng, expected in test_coords:
        matched = False
        for region in data['regions']:
            bounds = region['bounds']
            if (bounds['lat_min'] <= lat <= bounds['lat_max'] and
                bounds['lng_min'] <= lng <= bounds['lng_max']):
                print(f"✅ {expected}: {region['name']} (Match!)")
                matched = True
                break
        
        if not matched:
            print(f"❌ {expected}: No match found!")
else:
    print("\n❌ File not found!")
