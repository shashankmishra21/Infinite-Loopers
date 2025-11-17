import json
from typing import Dict, Optional

def load_region_mapping() -> Dict:
    """Load region mapping from JSON file"""
    with open('data/region_mapping.json', 'r') as f:
        return json.load(f)

def detect_region(lat: float, lng: float) -> Optional[Dict]:
    """
    Detect which region the coordinates belong to
    
    Args:
        lat: Latitude
        lng: Longitude
        
    Returns:
        Region data if found, None otherwise
    """
    mapping = load_region_mapping()
    
    for region in mapping['regions']:
        bounds = region['bounds']
        
        # Check if coordinates fall within bounds
        if (bounds['lat_min'] <= lat <= bounds['lat_max'] and
            bounds['lng_min'] <= lng <= bounds['lng_max']):
            return region
    
    # Return default if no region matched
    return mapping['default']

def get_crop_factor(crop_type: str) -> float:
    """
    Get carbon factor for crop type
    
    Args:
        crop_type: Type of crop
        
    Returns:
        Carbon factor (multiplier)
    """
    crop_factors = {
        'wheat': 1.2,
        'rice': 1.5,
        'sugarcane': 1.8,
        'cotton': 1.0,
        'maize': 1.3,
        'pulses': 1.1,
        'vegetables': 0.9,
        'mixed': 1.2
    }
    
    return crop_factors.get(crop_type.lower(), 1.0)

def calculate_earnings(carbon_tons: float, price_per_ton: float = 3200) -> float:
    """
    Calculate farmer earnings
    
    Args:
        carbon_tons: CO2 sequestered in tons
        price_per_ton: Market price per ton (default ₹3200)
        
    Returns:
        Total earnings in rupees
    """
    return carbon_tons * price_per_ton
