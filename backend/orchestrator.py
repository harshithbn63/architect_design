import os
import json
import asyncio
from openai import OpenAI
from typing import Dict, Any, List
from models import (
    RequirementInput, 
    ArchitectureResponse, 
    ValidationResult, 
    FinalResponse,
    CriticFeedback,
    RiskProfile,
    WhatIfScenario,
    CostInsight
)
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Use faster model for speed
FAST_MODEL = "gpt-4o-mini"

# Modular Prompts
VALIDATION_PROMPT = """
You are a Staff Requirement Validator.
Your goal is to be helpful and permissive. 
Only set is_sufficient=false if the requirements are completely empty or total gibberish.
If the requirements are slightly vague, set is_sufficient=true and let the Architect fill in the gaps with industry-standard best practices.

Output MUST be JSON:
{
    "is_sufficient": boolean,
    "clarifying_questions": [
        {"field": "string", "question": "string", "why": "string"}
    ]
}
Note: If is_sufficient is true, clarifying_questions should be an empty list [].
"""

ARCHITECT_PROMPT = """
You are a World-Class Staff Software Architect.
Your goal is to design a high-fidelity, production-grade architecture.

NON-NEGOTIABLE RIGOR:
1. NO AI FLUFF: Avoid generic corporate-speak, vague buzzwords, or filler content.
2. NO HALLUCINATIONS: Suggest only actual, existing tools and patterns.
3. MANDATORY SYSTEM EXHAUSTION: You MUST provide a complete technology mapping for EVERY SINGLE node, service, and component present in your 'diagram_mermaid'. If it's in the diagram, it MUST be in the 'technology_mapping'. NO EXCEPTIONS.
4. TRIPLE-COMPETITOR RIGOR: For EVERY entry in 'technology_mapping', you MUST explicitly explain 'Why Not X and Y'.
5. DEPLOYMENT PLATFORM: You MUST include a specific deployment strategy.

CORE DIRECTIVE: Explain the "WHY" behind every major decision. Be decisive. No "it depends."

Output MUST be JSON matching this structure:
{
    "requirement_analysis": "Concise analysis of user constraints",
    "patterns": [{"title": "Strategy", "decision": "Choice", "justification": "Why"}],
    "system_design": [{"title": "Layer", "decision": "Detail", "justification": "Why"}],
    "technology_mapping": [
        {
            "name": "Tool", 
            "pros": ["string"], 
            "cons": ["string"], 
            "trade_off_summary": "Direct logic", 
            "comparative_analysis": "Why not alternatives"
        }
    ],
    "deployment_strategy": [{"title": "Platform", "decision": "e.g. AWS", "justification": "Why"}],
    "diagram_mermaid": "graph TD\\nA[Node1] --> B[Node2]\\nB --> C[Node3]",
    "cost_insights": [{"component": "string", "cost_band": "Low|Medium|High", "driver": "string"}],
    "scale_simulation": "Scale plan",
    "bottlenecks": ["string"],
    "failure_handling": "string",
    "executive_summary": "Founder-friendly summary",
    "technical_summary": "Engineer-focused summary",
    "what_if_analysis": [{"scenario": "string", "impact": "string", "recommendation": "string"}]
}
"""

class ArchitectureOrchestrator:
    @staticmethod
    def _call_openai(system_prompt: str, user_content: str) -> Dict[str, Any]:
        """Synchronous OpenAI call wrapper"""
        response = client.chat.completions.create(
            model=FAST_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)

    @staticmethod
    async def validate_requirements(requirements: RequirementInput) -> ValidationResult:
        req_text = json.dumps(requirements.dict(), indent=2)
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(
            None, 
            ArchitectureOrchestrator._call_openai, 
            VALIDATION_PROMPT, 
            f"Requirements:\n{req_text}"
        )
        return ValidationResult(**data)

    @staticmethod
    async def get_architecture_design(requirements: RequirementInput) -> Dict[str, Any]:
        req_text = json.dumps(requirements.dict(), indent=2)
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None,
            ArchitectureOrchestrator._call_openai,
            ARCHITECT_PROMPT,
            f"Requirements:\n{req_text}"
        )

    @staticmethod
    async def get_architecture_recommendation(requirements: RequirementInput) -> FinalResponse:
        # Parallel execution: Validation + Architecture Design
        print("1. Running Validation & Design in parallel...")
        validation_task = ArchitectureOrchestrator.validate_requirements(requirements)
        design_task = ArchitectureOrchestrator.get_architecture_design(requirements)
        
        validation, design_data = await asyncio.gather(validation_task, design_task)
        
        print("2. Finalizing response...")
        final_design = {**design_data}
        
        # Add questions if validation failed
        if not validation.is_sufficient:
            final_design["clarifying_questions"] = validation.clarifying_questions
        
        # Ensure required fields have defaults
        final_design.setdefault("critic_review", [])
        final_design.setdefault("risk_profile", None)
        final_design.setdefault("what_if_analysis", final_design.get("what_if_analysis", []))
        final_design.setdefault("executive_summary", final_design.get("executive_summary", "Architecture synthesized."))
        final_design.setdefault("technical_summary", final_design.get("technical_summary", "See technology mapping for details."))
        
        # Final Pydantic Validation
        try:
            arch_response = ArchitectureResponse(**final_design)
            return FinalResponse(status="success", data=arch_response)
        except Exception as ve:
            print(f"VALIDATION ERROR: {ve}")
            # Return a fallback response on error
            return FinalResponse(
                status="error",
                data=ArchitectureResponse(
                    requirement_analysis="Error processing requirements.",
                    patterns=[],
                    system_design=[],
                    technology_mapping=[],
                    deployment_strategy=[],
                    diagram_mermaid="graph TD\n  A[Error] --> B[Please Retry]",
                    cost_insights=[],
                    scale_simulation="N/A",
                    bottlenecks=[],
                    failure_handling="N/A",
                    executive_summary=f"Error: {str(ve)}",
                    technical_summary="Validation failed. Please refine your requirements."
                )
            )
