import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Message } from "@mariozechner/pi-ai";
import type { AdaptedPiAgentConfig, ToolProfileName, VoidChangeCriticality, VoidDelegateInput, VoidDomain } from "./types";

export interface VoidUsageStats {
	input: number;
	output: number;
	cacheRead: number;
	cacheWrite: number;
	cost: number;
	turns: number;
	contextTokens: number;
}

export interface VoidSubagentResult {
	agent: string;
	task: string;
	exitCode: number;
	messages: Message[];
	stderr: string;
	usage: VoidUsageStats;
	model?: string;
	stopReason?: string;
	errorMessage?: string;
	domain?: VoidDomain;
	criticality?: VoidChangeCriticality;
}

export interface VoidWorkflowResult {
	mode: "single" | "chain";
	domain: VoidDomain;
	criticality: VoidChangeCriticality;
	agents: string[];
	results: VoidSubagentResult[];
}

function initialUsage(): VoidUsageStats {
	return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0, turns: 0, contextTokens: 0 };
}

function getPiInvocation(args: string[]): { command: string; args: string[] } {
	const currentScript = process.argv[1];
	const isBunVirtualScript = currentScript?.startsWith("/$bunfs/root/");
	if (currentScript && !isBunVirtualScript && fs.existsSync(currentScript)) {
		return { command: process.execPath, args: [currentScript, ...args] };
	}

	const execName = path.basename(process.execPath).toLowerCase();
	const isGenericRuntime = /^(node|bun)(\.exe)?$/.test(execName);
	if (!isGenericRuntime) return { command: process.execPath, args };
	return { command: "pi", args };
}

function getSkillPaths(cwd: string, skillNames: string[]): string[] {
	return skillNames
		.map((name) => path.join(cwd, "skills", name, "SKILL.md"))
		.filter((filePath) => fs.existsSync(filePath));
}

function getToolAllowlist(agent: AdaptedPiAgentConfig): string[] {
	if (agent.name === "gl1tch") return ["read", "grep", "find", "ls", "bash", "edit", "write"];
	if (agent.name === "sentinel") return ["read", "grep", "find", "ls", "bash"];

	switch (agent.toolProfile as ToolProfileName) {
		case "analysis":
		case "read-only":
		case "orchestrator":
			return ["read", "grep", "find", "ls"];
		case "implementer":
			return ["read", "grep", "find", "ls", "edit", "write"];
		case "devops":
			return ["read", "grep", "find", "ls", "bash", "edit", "write"];
		case "quality-gate":
			return ["read", "grep", "find", "ls", "bash"];
		case "single-agent":
			return ["read", "grep", "find", "ls", "bash", "edit", "write"];
		default:
			return ["read", "grep", "find", "ls"];
	}
}

function buildSubagentPrompt(agent: AdaptedPiAgentConfig, input: VoidDelegateInput): string {
	return [
		agent.systemPrompt,
		"",
		"Execution overlay:",
		input.domain ? `- Domain: ${input.domain}` : undefined,
		input.criticality ? `- Change Criticality: ${input.criticality}` : undefined,
		input.chainPosition ? `- Chain position: ${input.chainPosition}` : undefined,
		input.handoffNotes ? `- Handoff Notes: ${input.handoffNotes}` : undefined,
		agent.suggestedSkills.length > 0 ? `- Suggested repository skills: ${agent.suggestedSkills.join(", ")}` : undefined,
		agent.name === "d43mon"
			? "- Keep operational commands conservative. Prefer inspection and validators over direct mutation."
			: undefined,
		agent.name === "sentinel" ? "- Final review is read-only. Return a decisive verdict with evidence." : undefined,
	]
		.filter(Boolean)
		.join("\n");
}

function getFinalOutput(messages: Message[]): string {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role !== "assistant") continue;
		for (const part of message.content) {
			if (part.type === "text") return part.text;
		}
	}
	return "";
}

export function summarizeWorkflowResult(result: VoidWorkflowResult): string {
	const lines = [
		`# Void workflow result`,
		"",
		`- Domain: ${result.domain}`,
		`- Change Criticality: ${result.criticality}`,
		`- Agents: ${result.agents.join(" -> ")}`,
		"",
		`## Per-agent results`,
	];

	for (const item of result.results) {
		const status = item.exitCode === 0 && item.stopReason !== "error" && item.stopReason !== "aborted" ? "success" : "error";
		lines.push(`### ${item.agent}`);
		lines.push(`- Status: ${status}`);
		lines.push(`- Exit code: ${item.exitCode}`);
		if (item.stopReason) lines.push(`- Stop reason: ${item.stopReason}`);
		if (item.errorMessage) lines.push(`- Error: ${item.errorMessage}`);
		if (item.stderr.trim()) lines.push(`- Stderr: ${item.stderr.trim()}`);
		const output = getFinalOutput(item.messages);
		if (output) {
			lines.push("");
			lines.push(output);
		}
		lines.push("");
	}

	return lines.join("\n").trim();
}

export async function runVoidSubagent(
	cwd: string,
	agent: AdaptedPiAgentConfig,
	input: VoidDelegateInput,
	signal?: AbortSignal,
	onUpdate?: (result: VoidSubagentResult) => void,
): Promise<VoidSubagentResult> {
	const result: VoidSubagentResult = {
		agent: agent.name,
		task: input.task,
		exitCode: 0,
		messages: [],
		stderr: "",
		usage: initialUsage(),
		model: agent.model,
		domain: input.domain,
		criticality: input.criticality,
	};

	const args = ["--mode", "json", "-p", "--no-session", "--no-skills"];
	if (agent.model) args.push("--model", agent.model);
	args.push("--tools", getToolAllowlist(agent).join(","));
	for (const skillPath of getSkillPaths(cwd, agent.suggestedSkills)) {
		args.push("--skill", skillPath);
	}
	args.push("--append-system-prompt", buildSubagentPrompt(agent, input));
	args.push(input.task);

	const invocation = getPiInvocation(args);
	let buffer = "";

	const processLine = (line: string) => {
		if (!line.trim()) return;
		let event: any;
		try {
			event = JSON.parse(line);
		} catch {
			return;
		}

		if (event.type === "message_end" && event.message) {
			const message = event.message as Message;
			result.messages.push(message);
			if (message.role === "assistant") {
				result.usage.turns += 1;
				const usage = message.usage;
				if (usage) {
					result.usage.input += usage.input || 0;
					result.usage.output += usage.output || 0;
					result.usage.cacheRead += usage.cacheRead || 0;
					result.usage.cacheWrite += usage.cacheWrite || 0;
					result.usage.cost += usage.cost?.total || 0;
					result.usage.contextTokens = usage.totalTokens || result.usage.contextTokens;
				}
				if (!result.model && message.model) result.model = message.model;
				if (message.stopReason) result.stopReason = message.stopReason;
				if (message.errorMessage) result.errorMessage = message.errorMessage;
			}
			onUpdate?.({ ...result, messages: [...result.messages], usage: { ...result.usage } });
		}
	};

	const exitCode = await new Promise<number>((resolve) => {
		const proc = spawn(invocation.command, invocation.args, {
			cwd,
			shell: false,
			stdio: ["ignore", "pipe", "pipe"],
		});

		proc.stdout.on("data", (data) => {
			buffer += data.toString();
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";
			for (const line of lines) processLine(line);
		});

		proc.stderr.on("data", (data) => {
			result.stderr += data.toString();
		});

		proc.on("close", (code) => {
			if (buffer.trim()) processLine(buffer);
			resolve(code ?? 0);
		});

		proc.on("error", (error) => {
			result.stderr += error.message;
			resolve(1);
		});

		if (signal) {
			const abort = () => proc.kill("SIGTERM");
			if (signal.aborted) abort();
			else signal.addEventListener("abort", abort, { once: true });
		}
	});

	result.exitCode = exitCode;
	return result;
}

export async function runVoidChain(
	cwd: string,
	agents: AdaptedPiAgentConfig[],
	inputs: VoidDelegateInput[],
	signal?: AbortSignal,
	onUpdate?: (results: VoidSubagentResult[]) => void,
): Promise<VoidSubagentResult[]> {
	const results: VoidSubagentResult[] = [];
	let previousOutput = "";

	for (let index = 0; index < inputs.length; index++) {
		const input = { ...inputs[index] };
		input.task = input.task.replace(/\{previous\}/g, previousOutput);
		const agent = agents[index];
		const result = await runVoidSubagent(cwd, agent, input, signal, (partial) => {
			if (!onUpdate) return;
			onUpdate([...results, partial]);
		});
		results.push(result);
		onUpdate?.([...results]);
		previousOutput = getFinalOutput(result.messages);
		if (result.exitCode !== 0 || result.stopReason === "error" || result.stopReason === "aborted") break;
	}

	return results;
}
