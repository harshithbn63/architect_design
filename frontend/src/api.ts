import axios from 'axios';

const API_BASE_URL = '/api';

export interface RequirementInput {
    user_count: string;
    traffic_pattern: string;
    workload_type: string;
    ai_ml_usage: string;
    latency_sensitivity: string;
    budget_constraint: string;
    reliability_needs: string;
    additional_context?: string;
}

export interface ClarifyingQuestion {
    field: string;
    question: string;
    why: string;
}

export interface ValidationResult {
    is_sufficient: boolean;
    clarifying_questions: ClarifyingQuestion[];
}

export interface DecisionStep {
    title: string;
    decision: string;
    justification: string;
}

export interface TechOption {
    name: string;
    pros: string[];
    cons: string[];
    trade_off_summary: string;
    comparative_analysis: string;
}

export interface CostInsight {
    component: string;
    cost_band: 'Low' | 'Medium' | 'High';
    driver: string;
}

export interface WhatIfScenario {
    scenario: string;
    impact: string;
    valid_parts: string[];
    broken_parts: string[];
    recommendation: string;
}

export interface RiskProfile {
    overall_confidence_score: number;
    risks: { category: string; score: number; justification: string }[];
}

export interface ArchitectureResponse {
    requirement_analysis: string;
    patterns: DecisionStep[];
    system_design: DecisionStep[];
    technology_mapping: TechOption[];
    diagram_mermaid: string;
    cost_insights: CostInsight[];
    scale_simulation: string;
    bottlenecks: string[];
    failure_handling: string;
    risk_profile?: RiskProfile;
    critic_review?: any[];
    what_if_analysis?: WhatIfScenario[];
    executive_summary?: string;
    technical_summary?: string;
    deployment_strategy?: DecisionStep[];
    clarifying_questions?: ClarifyingQuestion[];
}

export interface FinalResponse {
    status: 'success' | 'needs_clarification' | 'error';
    data: ArchitectureResponse | ValidationResult;
}

export const analyzeRequirements = async (requirements: RequirementInput): Promise<FinalResponse> => {
    try {
        const response = await axios.post<FinalResponse>(`${API_BASE_URL}/analyze`, requirements);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        return {
            status: 'error',
            data: { is_sufficient: false, clarifying_questions: [] } as any
        };
    }
};
