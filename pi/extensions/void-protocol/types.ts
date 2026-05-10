export type VoidDomain = "App" | "DevOps" | "Mixed" | "Unknown";
export type VoidChangeCriticality = "Low" | "Medium" | "High" | "Unknown";
export type VoidMode = "primary" | "subagent" | "unknown";
export type ToolProfileName =
	| "orchestrator"
	| "single-agent"
	| "read-only"
	| "implementer"
	| "devops"
	| "quality-gate"
	| "analysis"
	| "unknown";

export interface PiAgentFrontmatter {
	name?: string;
	model?: string;
	reasoningEffort?: string;
	description?: string;
	tools?: string;
	mode?: string;
	opencodeMode?: string;
	source?: string;
	permission?: Record<string, unknown>;
}

export interface AdaptedPiAgentConfig {
	name: string;
	filePath: string;
	description: string;
	model?: string;
	reasoningEffort?: string;
	mode: VoidMode;
	systemPrompt: string;
	toolProfile: ToolProfileName;
	domain: VoidDomain;
	defaultCriticality: VoidChangeCriticality;
	suggestedSkills: string[];
	canDelegate: boolean;
	source: "user" | "project";
	frontmatter: PiAgentFrontmatter;
}

export interface VoidDelegateInput {
	agent: string;
	task: string;
	domain?: VoidDomain;
	criticality?: VoidChangeCriticality;
	handoffNotes?: string;
	chainPosition?: string;
}

export interface NexusSessionState {
	mode: "nexus";
	sourceAgent: "nexus";
	task: string;
	createdAt: number;
}
