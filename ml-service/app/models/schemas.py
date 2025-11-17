from pydantic import BaseModel, Field
from typing import Optional

class FarmLocation(BaseModel):
    """Farm location coordinates"""
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")

class CarbonCalculationRequest(BaseModel):
    """Request body for carbon calculation"""
    farm_id: str
    lat: float
    lng: float
    acres: float = Field(..., gt=0, description="Farm size in acres")
    crop_type: str = Field(..., description="Type of crop")
    
    class Config:
        json_schema_extra = {
            "example": {
                "farm_id": "farm123",
                "lat": 30.7333,
                "lng": 76.7794,
                "acres": 3.5,
                "crop_type": "wheat"
            }
        }

class SatelliteImage(BaseModel):
    """Satellite image URLs"""
    january: str
    june: str

class NDVIValues(BaseModel):
    """NDVI values for different months"""
    january: float
    june: float

class CarbonCalculationResponse(BaseModel):
    """Response for carbon calculation"""
    farm_id: str
    region: str
    carbon_tons: float
    ndvi_baseline: float
    ndvi_current: float
    ndvi_increase: float
    satellite_images: SatelliteImage
    earnings_estimate: float
    confidence: float = Field(default=0.95, description="Accuracy confidence")
    
    class Config:
        json_schema_extra = {
            "example": {
                "farm_id": "farm123",
                "region": "Punjab",
                "carbon_tons": 4.2,
                "ndvi_baseline": 0.42,
                "ndvi_current": 0.73,
                "ndvi_increase": 0.31,
                "satellite_images": {
                    "january": "/static/satellite-images/punjab-jan-2025.jpg",
                    "june": "/static/satellite-images/punjab-jun-2025.jpg"
                },
                "earnings_estimate": 13440.0,
                "confidence": 0.95
            }
        }
