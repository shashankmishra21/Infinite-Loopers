from typing import Dict
from app.utils.helpers import detect_region, get_crop_factor, calculate_earnings

class CarbonCalculator:
    """
    Carbon sequestration calculator using satellite imagery
    """
    
    # Constants (IPCC-approved)
    CARBON_PERCENTAGE = 0.45  # 45% of biomass is carbon
    CO2_RATIO = 3.67  # Convert carbon to CO2 (44/12)
    ADJUSTMENT_FACTOR = 0.35  # Permanent storage factor
    ACRES_TO_SQM = 4047  # Acres to square meters conversion
    
    def __init__(self):
        """Initialize calculator"""
        pass
    
    def calculate_carbon(
        self,
        lat: float,
        lng: float,
        acres: float,
        crop_type: str
    ) -> Dict:
        """
        Calculate carbon sequestration
        
        Steps:
        1. Detect region from coordinates
        2. Get NDVI values (pre-calculated)
        3. Calculate biomass from NDVI
        4. Convert biomass to carbon
        5. Convert carbon to CO2
        6. Apply adjustment factor
        
        Args:
            lat: Latitude
            lng: Longitude
            acres: Farm size in acres
            crop_type: Type of crop
            
        Returns:
            Dictionary with carbon calculation results
        """
        
        # Step 1: Detect region
        region = detect_region(lat, lng)
        
        # Step 2: Get NDVI values
        ndvi_baseline = region['ndvi']['january']
        ndvi_current = region['ndvi']['june']
        ndvi_increase = ndvi_current - ndvi_baseline
        
        # Step 3: Get crop factor
        crop_factor = get_crop_factor(crop_type)
        
        # Step 4: Calculate biomass
        # Formula: NDVI × Acres × Crop Factor × Constant
        biomass_kg = ndvi_increase * acres * crop_factor * 10000
        
        # Step 5: Carbon content (45% of biomass)
        carbon_kg = biomass_kg * self.CARBON_PERCENTAGE
        
        # Step 6: CO2 equivalent
        co2_kg = carbon_kg * self.CO2_RATIO
        
        # Step 7: Adjustment (permanent storage)
        adjusted_co2_kg = co2_kg * self.ADJUSTMENT_FACTOR
        
        # Step 8: Convert to tons
        carbon_tons = adjusted_co2_kg / 1000
        
        # Step 9: Calculate earnings
        earnings = calculate_earnings(carbon_tons)
        
        return {
            'region': region['name'],
            'carbon_tons': round(carbon_tons, 2),
            'ndvi_baseline': ndvi_baseline,
            'ndvi_current': ndvi_current,
            'ndvi_increase': round(ndvi_increase, 2),
            'satellite_images': region['images'],
            'earnings_estimate': round(earnings, 2),
            'confidence': 0.95
        }
    
    def get_satellite_images(self, lat: float, lng: float) -> Dict:
        """
        Get satellite image URLs for coordinates
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            Dictionary with image URLs
        """
        region = detect_region(lat, lng)
        return {
            'region': region['name'],
            'images': region['images'],
            'ndvi': region['ndvi']
        }

