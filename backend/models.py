from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union

class RequirementInput(BaseModel):
    user_count: str = Field(..., description="Expected number of users (e.g., 1K, 100K, 1M+)")
    traffic_pattern: str = Field(..., description="Steady, bursty, or real-time")
    workload_type: str = Field(..., description="CPU-bound, IO-bound, or mixed")
    ai_ml_usage: Optional[str] = Field("none", description="Training, inference, or none")
    latency_sensitivity: str = Field(..., description="Low, medium, or high")
    budget_constraint: str = Field(..., description="Low, medium, or high")
    reliability_needs: str = Field(..., description="Availability and reliability requirements")
    additional_context: Optional[str] = None

class ClarificationQuestion(BaseModel):
    field: str = ""
    question: str = ""
    why: str = ""

class ValidationResult(BaseModel):
    is_sufficient: bool = True
    clarifying_questions: List[ClarificationQuestion] = []

class DecisionStep(BaseModel):
    title: str = ""
    decision: str = ""
    justification: str = ""

class TechOption(BaseModel):
    name: str = ""
    pros: List[str] = []
    cons: List[str] = []
    trade_off_summary: str = ""
    comparative_analysis: str = ""

class CriticFeedback(BaseModel):
    point: str = ""
    severity: str = "Medium"
    recommendation: str = ""

class RiskFactor(BaseModel):
    category: str = ""
    score: int = 0
    justification: str = ""

class RiskProfile(BaseModel):
    overall_confidence_score: int = 0
    risks: List[RiskFactor] = []

class CostInsight(BaseModel):
    component: str = ""
    cost_band: str = "Medium"
    driver: str = ""

class WhatIfScenario(BaseModel):
    scenario: str = ""
    impact: str = ""
    valid_parts: Optional[List[str]] = []
    broken_parts: Optional[List[str]] = []
    recommendation: str = ""

class ArchitectureResponse(BaseModel):
    requirement_analysis: str = ""
    patterns: List[DecisionStep] = []
    system_design: List[DecisionStep] = []
    technology_mapping: List[TechOption] = []
    diagram_mermaid: str = "graph TD\n  A[Start] --> B[End]"
    cost_insights: List[CostInsight] = []
    scale_simulation: str = ""
    bottlenecks: List[str] = []
    failure_handling: str = ""
    risk_profile: Optional[RiskProfile] = None
    critic_review: Optional[List[CriticFeedback]] = None
    what_if_analysis: Optional[List[WhatIfScenario]] = None
    executive_summary: Optional[str] = None
    technical_summary: Optional[str] = None
    deployment_strategy: Optional[List[DecisionStep]] = None
    clarifying_questions: Optional[List[ClarificationQuestion]] = None

class FinalResponse(BaseModel):
    status: str = "success"
    data: Optional[Union[ValidationResult, ArchitectureResponse]] = None
