from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models.schemas import (
    CarbonCalculationRequest,
    CarbonCalculationResponse
)
from app.carbon_calculator import CarbonCalculator
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="CarbonSetu ML Service",
    description="Satellite-based carbon calculation API",
    version="1.0.0"
)

# CORS middleware (allow frontend to call)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: specific domains only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (satellite images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize calculator
calculator = CarbonCalculator()

# Root endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "CarbonSetu ML Service",
        "status": "running",
        "version": "1.0.0"
    }

# Calculate carbon endpoint
@app.post("/calculate-carbon", response_model=CarbonCalculationResponse)
async def calculate_carbon(request: CarbonCalculationRequest):
    """
    Calculate carbon sequestration for a farm
    
    This endpoint:
    1. Receives farm details (location, size, crop)
    2. Detects region from coordinates
    3. Fetches pre-downloaded satellite images
    4. Calculates NDVI-based carbon sequestration
    5. Returns carbon tons + earnings estimate
    """
    try:
        # Call calculator
        result = calculator.calculate_carbon(
            lat=request.lat,
            lng=request.lng,
            acres=request.acres,
            crop_type=request.crop_type
        )
        
        # Add farm_id to response
        result['farm_id'] = request.farm_id
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Calculation failed: {str(e)}"
        )

# Get satellite images endpoint
@app.get("/satellite-images/{lat}/{lng}")
async def get_satellite_images(lat: float, lng: float):
    """
    Get satellite image URLs for coordinates
    
    Args:
        lat: Latitude
        lng: Longitude
        
    Returns:
        Image URLs and NDVI values
    """
    try:
        result = calculator.get_satellite_images(lat, lng)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image fetch failed: {str(e)}"
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Check if service is healthy"""
    return {
        "status": "healthy",
        "calculator": "ready",
        "images": "loaded"
    }

# Run server
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload on code changes
    )
