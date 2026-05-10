import type { AdaptedPiAgentConfig, VoidChangeCriticality, VoidDomain } from "./types";

export interface VoidRoutePlan {
	domain: VoidDomain;
	criticality: VoidChangeCriticality;
	agents: string[];
	rationale: string[];
}

const DEVOPS_TERMS = [
	"workflow",
	"workflows",
	"github actions",
	"ci",
	"cd",
	"cicd",
	"pipeline",
	"infra",
	"infrastructure",
	"terraform",
	"terragrunt",
	"argocd",
	"helm",
	"kubectl",
	"k8s",
	"kubernetes",
	"docker",
	"deploy",
	"deployment",
	"release",
	"oidc",
	"iam",
	"secret",
	"runner",
	"ansible",
	"cdk",
	".github/workflows",
];

const APP_TERMS = [
	"feature",
	"bug",
	"fix",
	"refactor",
	"ui",
	"api",
	"endpoint",
	"handler",
	"component",
	"function",
	"class",
	"module",
	"app",
	"code",
	"test",
	"agent",
	"skill",
	"prompt",
	"instruction",
	"opencode/agent",
	"github/agents",
	"opencode.json",
];

const HIGH_RISK_TERMS = [
	"auth",
	"authentication",
	"authorization",
	"permission",
	"permissions",
	"secret",
	"secrets",
	"credential",
	"credentials",
	"token",
	"tokens",
	"iam",
	"production",
	"prod",
	"rollback",
	"deploy",
	"deployment",
	"public api",
	"migration",
];

const MEDIUM_RISK_TERMS = [
	"workflow",
	"pipeline",
	"ci",
	"review",
	"test",
	"validation",
	"protected surface",
	"infra",
	"agent",
	"skill",
];

function countTerms(input: string, terms: string[]): number {
	const lowered = input.toLowerCase();
	return terms.reduce((count, term) => (lowered.includes(term) ? count + 1 : count), 0);
}

export function classifyDomain(task: string): VoidDomain {
	const devopsHits = countTerms(task, DEVOPS_TERMS);
	const appHits = countTerms(task, APP_TERMS);
	if (devopsHits > 0 && appHits > 0) return "Mixed";
	if (devopsHits > 0) return "DevOps";
	if (appHits > 0) return "App";
	return "Unknown";
}

export function classifyCriticality(task: string): VoidChangeCriticality {
	if (countTerms(task, HIGH_RISK_TERMS) > 0) return "High";
	if (countTerms(task, MEDIUM_RISK_TERMS) > 0) return "Medium";
	return "Low";
}

export function buildGhostRoute(task: string, forcedDomain?: VoidDomain): VoidRoutePlan {
	const domain = forcedDomain && forcedDomain !== "Unknown" ? forcedDomain : classifyDomain(task);
	const criticality = classifyCriticality(task);

	if (domain === "DevOps") {
		return {
			domain,
			criticality,
			agents: ["d43mon", "gl1tch", "sentinel"],
			rationale: [
				"Detected DevOps-oriented delivery signals.",
				"Route implementation to d43mon, then execution evidence to gl1tch, then final gate to sentinel.",
			],
		};
	}

	if (domain === "Mixed") {
		return {
			domain,
			criticality,
			agents: ["forger", "d43mon", "gl1tch", "sentinel"],
			rationale: [
				"Detected both app and DevOps signals.",
				"Use a sequential mixed handoff: app slice, DevOps slice, testing, final review.",
			],
		};
	}

	return {
		domain: domain === "Unknown" ? "App" : domain,
		criticality,
		agents: ["forger", "gl1tch", "sentinel"],
		rationale: [
			"Defaulted to App implementation path.",
			"Route implementation to forger, then testing to gl1tch, then final gate to sentinel.",
		],
	};
}

export function buildSingleAgentPlan(agent: AdaptedPiAgentConfig, task: string): VoidRoutePlan {
	return {
		domain: agent.domain,
		criticality: agent.defaultCriticality,
		agents: [agent.name],
		rationale: [`Direct single-agent execution for ${agent.name}.`, `Task: ${task}`],
	};
}

export function formatRoutePlan(plan: VoidRoutePlan): string {
	return [
		`Domain: ${plan.domain}`,
		`Criticality: ${plan.criticality}`,
		`Agents: ${plan.agents.join(" -> ")}`,
		"Rationale:",
		...plan.rationale.map((item) => `- ${item}`),
	].join("\n");
}
