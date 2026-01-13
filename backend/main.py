from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import RequirementInput, FinalResponse
from orchestrator import ArchitectureOrchestrator
import uvicorn

app = FastAPI(title="AI Architecture Decision Intelligence System")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze", response_model=FinalResponse)
async def analyze_architecture(requirements: RequirementInput):
    try:
        recommendation = await ArchitectureOrchestrator.get_architecture_recommendation(requirements)
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
