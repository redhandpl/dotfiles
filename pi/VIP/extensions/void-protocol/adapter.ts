import * as fs from "node:fs";
import * as path from "node:path";
import { getAgentDir, parseFrontmatter } from "@mariozechner/pi-coding-agent";
import type { AdaptedPiAgentConfig, PiAgentFrontmatter, ToolProfileName, VoidChangeCriticality, VoidDomain, VoidMode } from "./types";

const DIRECT_SKILL_MAP: Record<string, string[]> = {
	ghost: ["delivery-gates", "project-memory-hygiene", "agent-governance"],
	nexus: [
		"agent-governance",
		"repo-conventions",
		"delivery-gates",
		"project-memory-hygiene",
		"discovery-scope",
		"architect",
		"planner",
		"coder",
		"devops",
		"tester",
		"reviewer",
	],
	anchor: ["project-memory-hygiene", "discovery-scope"],
	blueprint: ["architect", "documentalist", "project-memory-hygiene"],
	weaver: ["planner", "delivery-gates", "project-memory-hygiene"],
	shard: ["planner"],
	forger: [
		"repo-conventions",
		"delivery-gates",
		"project-memory-hygiene",
		"agent-governance",
		"test-strategy",
		"python-patterns",
		"python-testing",
	],
	d43mon: [
		"repo-conventions",
		"delivery-gates",
		"project-memory-hygiene",
		"github-actions",
		"docker-patterns",
		"aws-cost-optimizer",
		"terraform-terragrunt",
		"terraform-style-guide",
		"cdk-aws",
		"argocd-gitops",
		"ansible-ops",
		"terminal-context-bridge",
		"documentalist",
	],
	gl1tch: ["repo-conventions", "test-strategy", "agent-governance"],
	sentinel: ["repo-conventions", "review-rubric", "agent-governance"],
};

function normalizeMode(frontmatter: PiAgentFrontmatter): VoidMode {
	const mode = frontmatter.opencodeMode ?? frontmatter.mode;
	if (mode === "primary" || mode === "subagent") return mode;
	return "unknown";
}

function inferDomain(name: string): VoidDomain {
	switch (name) {
		case "forger":
			return "App";
		case "d43mon":
			return "DevOps";
		case "nexus":
			return "Mixed";
		case "ghost":
		case "anchor":
		case "blueprint":
		case "weaver":
		case "shard":
		case "gl1tch":
		case "sentinel":
			return "Unknown";
		default:
			return "Unknown";
	}
}

function inferCriticality(name: string): VoidChangeCriticality {
	switch (name) {
		case "d43mon":
		case "sentinel":
			return "High";
		case "forger":
		case "gl1tch":
			return "Medium";
		default:
			return "Unknown";
	}
}

function inferToolProfile(name: string, mode: VoidMode): ToolProfileName {
	switch (name) {
		case "ghost":
			return "orchestrator";
		case "nexus":
			return "single-agent";
		case "forger":
			return "implementer";
		case "d43mon":
			return "devops";
		case "gl1tch":
		case "sentinel":
			return "quality-gate";
		case "anchor":
		case "blueprint":
		case "weaver":
		case "shard":
			return "analysis";
		default:
			return mode === "primary" ? "single-agent" : "unknown";
	}
}

function canDelegate(name: string): boolean {
	return new Set(["forger", "d43mon", "gl1tch", "sentinel"]).has(name);
}

function loadAgentsFromDir(dir: string, source: "user" | "project"): AdaptedPiAgentConfig[] {
	if (!fs.existsSync(dir)) return [];

	const files = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((entry) => (entry.isFile() || entry.isSymbolicLink()) && entry.name.endsWith(".md") && entry.name !== "README.md")
		.map((entry) => path.join(dir, entry.name))
		.sort();

	return files
		.map((filePath) => {
			const content = fs.readFileSync(filePath, "utf-8");
			const { frontmatter, body } = parseFrontmatter<PiAgentFrontmatter>(content);
			const name = frontmatter.name ?? path.basename(filePath, ".md");
			const mode = normalizeMode(frontmatter);
			return {
				name,
				filePath,
				description: frontmatter.description ?? `${name} imported from ${dir}`,
				model: frontmatter.model,
				reasoningEffort: frontmatter.reasoningEffort,
				mode,
				systemPrompt: body.trim(),
				toolProfile: inferToolProfile(name, mode),
				domain: inferDomain(name),
				defaultCriticality: inferCriticality(name),
				suggestedSkills: DIRECT_SKILL_MAP[name] ?? [],
				canDelegate: canDelegate(name),
				source,
				frontmatter,
			};
		})
		.filter((config) => Boolean(config.name) && Boolean(config.description) && Boolean(config.systemPrompt));
}

export function getUserAgentDir(): string {
	return path.join(getAgentDir(), "agents");
}

export function getProjectAgentDir(cwd: string): string {
	return path.join(cwd, ".pi", "agents");
}

export function resolveAgentDir(cwd: string): { dir: string | null; source: "user" | "project" | "none" } {
	const userDir = getUserAgentDir();
	const userAgents = loadAgentsFromDir(userDir, "user");
	if (userAgents.length > 0) return { dir: userDir, source: "user" };

	const projectDir = getProjectAgentDir(cwd);
	const projectAgents = loadAgentsFromDir(projectDir, "project");
	if (projectAgents.length > 0) return { dir: projectDir, source: "project" };

	return { dir: null, source: "none" };
}

export function loadAdaptedAgentConfigs(cwd: string): AdaptedPiAgentConfig[] {
	const resolved = resolveAgentDir(cwd);
	if (!resolved.dir || resolved.source === "none") return [];
	return loadAgentsFromDir(resolved.dir, resolved.source);
}

export function getAdaptedAgent(cwd: string, name: string): AdaptedPiAgentConfig | undefined {
	return loadAdaptedAgentConfigs(cwd).find((agent) => agent.name === name);
}

export function formatAgentSummary(agent: AdaptedPiAgentConfig): string {
	const skills = agent.suggestedSkills.length > 0 ? agent.suggestedSkills.join(", ") : "none";
	return [
		`name=${agent.name}`,
		`source=${agent.source}`,
		`mode=${agent.mode}`,
		`profile=${agent.toolProfile}`,
		`domain=${agent.domain}`,
		`delegate=${agent.canDelegate ? "yes" : "no"}`,
		`skills=${skills}`,
	].join(" | ");
}
