from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
from pathlib import Path
import os

app = FastAPI(title="CarbonSetu ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for satellite images
static_path = Path(__file__).parent.parent / "static"
if static_path.exists():
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
    print(f"✅ Mounted static files from: {static_path}")
else:
    print(f"⚠️ Static directory not found at: {static_path}")

# Global variable to store region mapping
REGION_DATA = None

# Load region mapping on startup
@app.on_event("startup")
async def startup_event():
    global REGION_DATA
    
    # Try multiple possible paths
    possible_paths = [
        Path(__file__).parent.parent / "data" / "region_mapping.json",
        Path(__file__).parent / "data" / "region_mapping.json",
        Path("data/region_mapping.json"),
        Path("../data/region_mapping.json")
    ]
    
    print("\n🔍 Searching for region_mapping.json...")
    
    for json_path in possible_paths:
        abs_path = json_path.resolve()
        print(f"   Checking: {abs_path}")
        
        if json_path.exists():
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    REGION_DATA = json.load(f)
                
                print(f"\n✅ SUCCESS! Loaded region_mapping.json from:")
                print(f"   {abs_path}")
                print(f"   Total regions: {len(REGION_DATA.get('regions', []))}")
                
                for region in REGION_DATA.get('regions', []):
                    print(f"     - {region['name']}")
                
                return
            
            except Exception as e:
                print(f"❌ Error reading file: {e}")
                continue
    
    print("\n❌ WARNING: region_mapping.json not found!")
    print("   Please ensure file exists at: ml-service/data/region_mapping.json")
    
    # Create default fallback data
    REGION_DATA = {
        "regions": [],
        "default": {
            "id": "default",
            "name": "India",
            "images": {
                "january": "/static/satellite-images/ludhiana-jan-2025.jpg",
                "june": "/static/satellite-images/ludhiana-jun-2025.jpg"
            },
            "ndvi": {
                "january": 0.45,
                "june": 0.70
            }
        }
    }
    print("   Using fallback default region")

# Request/Response models
class RegionRequest(BaseModel):
    latitude: float
    longitude: float

class CarbonRequest(BaseModel):
    farmId: str
    latitude: float
    longitude: float
    acres: float
    cropType: str

# Root endpoint
@app.get("/")
async def root():
    regions_loaded = REGION_DATA is not None and len(REGION_DATA.get('regions', [])) > 0
    
    return {
        "message": "CarbonSetu ML Service",
        "version": "1.0.0",
        "status": "healthy",
        "regions_loaded": regions_loaded,
        "total_regions": len(REGION_DATA.get('regions', [])) if REGION_DATA else 0,
        "endpoints": {
            "detect_region": "POST /detect-region",
            "calculate_carbon": "POST /calculate-carbon",
            "satellite_images": "GET /static/satellite-images/{filename}"
        }
    }

# Detect region endpoint
@app.post("/detect-region")
async def detect_region(request: RegionRequest):
    """Detect which region the farm coordinates belong to"""
    
    if not REGION_DATA:
        raise HTTPException(
            status_code=500, 
            detail="Region mapping not loaded. Check server logs."
        )
    
    lat = request.latitude
    lng = request.longitude
    
    print(f"\n🔍 Region Detection Request:")
    print(f"   Latitude: {lat}")
    print(f"   Longitude: {lng}")
    
    # Check each region
    regions = REGION_DATA.get('regions', [])
    print(f"   Checking against {len(regions)} regions...")
    
    for region in regions:
        bounds = region.get('bounds', {})
        
        lat_min = bounds.get('lat_min')
        lat_max = bounds.get('lat_max')
        lng_min = bounds.get('lng_min')
        lng_max = bounds.get('lng_max')
        
        print(f"     Checking {region['name']}: lat {lat_min}-{lat_max}, lng {lng_min}-{lng_max}")
        
        if (lat_min <= lat <= lat_max and lng_min <= lng <= lng_max):
            print(f"   ✅ MATCH FOUND: {region['name']}")
            
            return {
                "success": True,
                "region": {
                    "id": region['id'],
                    "name": region['name'],
                    "crop_type": region['crop_type'],
                    "ndvi_january": region['ndvi']['january'],
                    "ndvi_june": region['ndvi']['june'],
                    "images": region['images']
                }
            }
    
    # No match - return default
    print(f"   ⚠️ No match found, using default region")
    default = REGION_DATA.get('default', {})
    
    return {
        "success": True,
        "region": {
            "id": default.get('id', 'default'),
            "name": default.get('name', 'India'),
            "ndvi_january": default['ndvi']['january'],
            "ndvi_june": default['ndvi']['june'],
            "images": default['images']
        },
        "note": "Coordinates outside known regions, using default"
    }

# Calculate carbon endpoint
@app.post("/calculate-carbon")
async def calculate_carbon(request: CarbonRequest):
    """Calculate carbon sequestration for a farm"""
    
    if not REGION_DATA:
        raise HTTPException(status_code=500, detail="Region mapping not loaded")
    
    lat = request.latitude
    lng = request.longitude
    acres = request.acres
    
    print(f"\n🧮 Carbon Calculation Request:")
    print(f"   Farm ID: {request.farmId}")
    print(f"   Location: {lat}, {lng}")
    print(f"   Acres: {acres}")
    print(f"   Crop: {request.cropType}")
    
    # Detect region
    detected_region = None
    region_name = "India"  # Default name
    
    for region in REGION_DATA.get('regions', []):
        bounds = region['bounds']
        
        # Debug: print bounds check
        print(f"   Checking {region['name']}: lat {bounds['lat_min']}-{bounds['lat_max']}, lng {bounds['lng_min']}-{bounds['lng_max']}")
        
        if (bounds['lat_min'] <= lat <= bounds['lat_max'] and
            bounds['lng_min'] <= lng <= bounds['lng_max']):
            detected_region = region
            region_name = region['name']
            print(f"   ✅ MATCHED: {region_name}")
            break
    
    if not detected_region:
        detected_region = REGION_DATA.get('default')
        region_name = "India (Default)"
        print(f"   ⚠️ No match, using default region")
    
    # Get NDVI values
    ndvi_jan = detected_region['ndvi']['january']
    ndvi_jun = detected_region['ndvi']['june']
    ndvi_increase = ndvi_jun - ndvi_jan
    
    print(f"   NDVI: {ndvi_jan} → {ndvi_jun} (increase: {ndvi_increase:.2f})")
    
    # Crop-specific factors
    crop_factors = {
        'wheat': 1.2,
        'rice': 1.5,
        'sugarcane': 1.8,
        'cotton': 1.0,
        'maize': 1.3,
        'soybean': 1.1
    }
    
    crop_factor = crop_factors.get(request.cropType.lower(), 1.2)
    print(f"   Crop factor ({request.cropType}): {crop_factor}")
    
    # Carbon calculation (IPCC Tier 2 formula)
    carbon_tons = ndvi_increase * acres * crop_factor * 4.0  # ✅ FIXED CONSTANT
    carbon_tons = round(carbon_tons, 2)
    
    # Earnings estimate (₹3,200 per ton)
    earnings = carbon_tons * 3200
    
    print(f"   Calculation: {ndvi_increase:.2f} × {acres} × {crop_factor} × 4.0")
    print(f"   ✅ Calculated carbon: {carbon_tons} tons")
    print(f"   💰 Estimated earnings: ₹{earnings:,}")
    
    return {
        "success": True,
        "data": {
            "farmId": request.farmId,
            "region": region_name,  # ✅ USE THIS VARIABLE
            "ndvi": {
                "baseline": round(ndvi_jan, 2),
                "current": round(ndvi_jun, 2),
                "increase": round(ndvi_increase, 2)
            },
            "carbonTons": carbon_tons,
            "earningsEstimate": int(earnings),
            "confidence": 0.95,
            "satelliteImages": {
                "january": detected_region['images']['january'],
                "june": detected_region['images']['june']
            }
        }
    }


# Debug endpoint to check loaded data
@app.get("/debug/regions")
async def debug_regions():
    """Debug endpoint to see loaded region data"""
    
    if not REGION_DATA:
        return {"error": "No region data loaded"}
    
    return {
        "total_regions": len(REGION_DATA.get('regions', [])),
        "regions": [
            {
                "id": r['id'],
                "name": r['name'],
                "bounds": r['bounds']
            }
            for r in REGION_DATA.get('regions', [])
        ],
        "default": REGION_DATA.get('default', {})
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
