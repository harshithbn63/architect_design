from http.server import BaseHTTPRequestHandler
import json
import os
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

FAST_MODEL = "gpt-4o-mini"

ARCHITECT_PROMPT = """
You are a World-Class Staff Software Architect.
Design a high-fidelity, production-grade architecture.

NON-NEGOTIABLE RIGOR:
1. NO AI FLUFF: Avoid generic corporate-speak.
2. NO HALLUCINATIONS: Suggest only actual, existing tools.
3. MANDATORY SYSTEM EXHAUSTION: Provide complete technology mapping for EVERY node in your diagram.
4. TRIPLE-COMPETITOR RIGOR: For EVERY entry, explain 'Why Not X and Y'.
5. DEPLOYMENT PLATFORM: Include specific deployment strategy.

Output MUST be JSON:
{
    "requirement_analysis": "Concise analysis",
    "patterns": [{"title": "Strategy", "decision": "Choice", "justification": "Why"}],
    "system_design": [{"title": "Layer", "decision": "Detail", "justification": "Why"}],
    "technology_mapping": [
        {
            "name": "Tool", 
            "pros": ["string"], 
            "cons": ["string"], 
            "trade_off_summary": "Logic", 
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

VALIDATION_PROMPT = """
You are a Staff Requirement Validator. Be helpful and permissive.
Only set is_sufficient=false if requirements are empty or gibberish.

Output MUST be JSON:
{
    "is_sufficient": boolean,
    "clarifying_questions": [{"field": "string", "question": "string", "why": "string"}]
}
"""

def call_openai(system_prompt: str, user_content: str) -> dict:
    response = client.chat.completions.create(
        model=FAST_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        response_format={"type": "json_object"}
    )
    return json.loads(response.choices[0].message.content)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            requirements = json.loads(post_data.decode('utf-8'))
            
            req_text = json.dumps(requirements, indent=2)
            
            # Parallel-ish execution (sequential for simplicity in serverless)
            validation = call_openai(VALIDATION_PROMPT, f"Requirements:\n{req_text}")
            design = call_openai(ARCHITECT_PROMPT, f"Requirements:\n{req_text}")
            
            # Merge results
            final = {**design}
            if not validation.get("is_sufficient", True):
                final["clarifying_questions"] = validation.get("clarifying_questions", [])
            
            # Set defaults
            final.setdefault("critic_review", [])
            final.setdefault("risk_profile", None)
            final.setdefault("what_if_analysis", final.get("what_if_analysis", []))
            final.setdefault("executive_summary", "Architecture synthesized.")
            final.setdefault("technical_summary", "See technology mapping.")
            
            response_data = {"status": "success", "data": final}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
