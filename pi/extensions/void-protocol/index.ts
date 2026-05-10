import { Type } from "typebox";
import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { getAdaptedAgent, loadAdaptedAgentConfigs, resolveAgentDir, formatAgentSummary } from "./adapter";
import { buildGhostRoute, formatRoutePlan, type VoidRoutePlan } from "./router";
import { runVoidChain, runVoidSubagent, summarizeWorkflowResult, type VoidWorkflowResult } from "./runner";
import type { AdaptedPiAgentConfig, VoidDelegateInput, VoidDomain } from "./types";

const NEXUS_KICKOFF_MARKER = "Adopt the Nexus operating model for this session.";
const DELEGABLE_AGENTS = new Set(["forger", "d43mon", "gl1tch", "sentinel"]);

const VoidDomainSchema = Type.Union(
	[
		Type.Literal("App"),
		Type.Literal("DevOps"),
		Type.Literal("Mixed"),
		Type.Literal("Unknown"),
	],
	{ description: "Optional domain classification from the orchestrator." },
);

const VoidCriticalitySchema = Type.Union(
	[
		Type.Literal("Low"),
		Type.Literal("Medium"),
		Type.Literal("High"),
		Type.Literal("Unknown"),
	],
	{ description: "Optional change criticality from the orchestrator." },
);

function buildNexusKickoff(task: string): string {
	return [
		NEXUS_KICKOFF_MARKER,
		"",
		"Constraints:",
		"- End-to-end single-agent execution.",
		"- No delegation to subagents.",
		"- Preserve explicit App/DevOps boundaries internally.",
		"- Apply the Discovery, Architecture, Planning, Implementation, Testing, and Review phases only when their triggers are met.",
		"- Reuse repository skills directly instead of duplicating role instructions.",
		"",
		"Task:",
		task,
	].join("\n");
}

function currentSessionIsNexus(ctx: ExtensionContext): boolean {
	return ctx.sessionManager.getEntries().some((entry) => {
		if (entry.type !== "message") return false;
		const message = entry.message;
		if (message.role !== "user") return false;
		return message.content.some((part) => part.type === "text" && part.text.includes(NEXUS_KICKOFF_MARKER));
	});
}

function getRequiredAgent(cwd: string, name: string): AdaptedPiAgentConfig {
	const agent = getAdaptedAgent(cwd, name);
	if (!agent) throw new Error(`Agent not found in configured Pi agent catalog: ${name}`);
	return agent;
}

function buildChainInputs(plan: VoidRoutePlan, task: string): VoidDelegateInput[] {
	return plan.agents.map((agentName, index) => {
		const isFirst = index === 0;
		const previous = "{previous}";
		let agentTask = task;
		if (!isFirst && agentName === "d43mon") {
			agentTask = [
				"Handle the DevOps slice required by this delegated task.",
				"Original task:",
				task,
				"",
				"Prior slice output:",
				previous,
			].join("\n");
		} else if (!isFirst && agentName === "gl1tch") {
			agentTask = [
				"Validate the delegated change and report execution-backed evidence.",
				"Original task:",
				task,
				"",
				"Previous agent output:",
				previous,
			].join("\n");
		} else if (!isFirst && agentName === "sentinel") {
			agentTask = [
				"Perform the final read-only review and return a decisive verdict.",
				"Original task:",
				task,
				"",
				"Previous agent output:",
				previous,
			].join("\n");
		}

		return {
			agent: agentName,
			task: agentTask,
			domain: plan.domain,
			criticality: plan.criticality,
			chainPosition: `${index + 1}/${plan.agents.length}`,
			handoffNotes: `Ghost route: ${plan.agents.join(" -> ")}`,
		};
	});
}

async function executePlan(
	cwd: string,
	plan: VoidRoutePlan,
	task: string,
	signal?: AbortSignal,
	onUpdate?: (workflow: VoidWorkflowResult) => void,
): Promise<VoidWorkflowResult> {
	const agents = plan.agents.map((name) => getRequiredAgent(cwd, name));
	const inputs = buildChainInputs(plan, task);
	const results =
		agents.length === 1
			? [await runVoidSubagent(cwd, agents[0], inputs[0], signal, (partial) => onUpdate?.({ mode: "single", ...plan, results: [partial] }))]
			: await runVoidChain(cwd, agents, inputs, signal, (partials) => onUpdate?.({ mode: "chain", ...plan, results: partials }));

	return {
		mode: results.length > 1 ? "chain" : "single",
		domain: plan.domain,
		criticality: plan.criticality,
		agents: plan.agents,
		results,
	};
}

function workflowFailed(result: VoidWorkflowResult): boolean {
	return result.results.some((item) => item.exitCode !== 0 || item.stopReason === "error" || item.stopReason === "aborted");
}

function notifyWorkflowResult(ctx: ExtensionContext, title: string, result: VoidWorkflowResult): void {
	const summary = [
		`# ${title}`,
		"",
		formatRoutePlan({
			domain: result.domain,
			criticality: result.criticality,
			agents: result.agents,
			rationale: ["Executed through the Pi Void Protocol extension."],
		}),
		"",
		summarizeWorkflowResult(result),
	].join("\n");
	if (ctx.hasUI) ctx.ui.setEditorText(summary);
	ctx.ui.notify(`${title} finished`, workflowFailed(result) ? "error" : "success");
}

export default function (pi: ExtensionAPI) {
	pi.registerCommand("void-agents", {
		description: "List agent definitions loaded from ~/.pi/agent/agents or fallback ./.pi/agents",
		handler: async (_args, ctx) => {
			const agents = loadAdaptedAgentConfigs(ctx.cwd);
			const resolved = resolveAgentDir(ctx.cwd);
			if (agents.length === 0 || !resolved.dir) {
				ctx.ui.notify("No agent definitions found in ~/.pi/agent/agents or ./.pi/agents", "error");
				return;
			}
			ctx.ui.notify(`Loaded ${agents.length} agent definitions from ${resolved.dir}`, "info");
			ctx.ui.setEditorText(agents.map((agent) => formatAgentSummary(agent)).join("\n"));
		},
	});

	pi.registerCommand("nexus", {
		description: "Start a dedicated Nexus session draft from the current context",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /nexus <task>", "error");
				return;
			}

			const result = await ctx.newSession({
				parentSession: ctx.sessionManager.getSessionFile(),
				withSession: async (replacementCtx) => {
					replacementCtx.ui.setEditorText(buildNexusKickoff(task));
					replacementCtx.ui.notify("Nexus session prepared. Review the kickoff prompt and submit when ready.", "info");
				},
			});

			if (result.cancelled) ctx.ui.notify("Nexus session creation cancelled", "info");
		},
	});

	pi.registerCommand("ghost", {
		description: "Classify a task and execute the Ghost-style routed chain",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /ghost <task>", "error");
				return;
			}
			const plan = buildGhostRoute(task);
			ctx.ui.notify(`Ghost route: ${plan.agents.join(" -> ")}`, "info");
			const result = await executePlan(ctx.cwd, plan, task);
			notifyWorkflowResult(ctx, "Ghost workflow", result);
		},
	});

	pi.registerCommand("implement", {
		description: "Run the implementation workflow using Ghost-style routing",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /implement <task>", "error");
				return;
			}
			const plan = buildGhostRoute(task);
			const result = await executePlan(ctx.cwd, plan, task);
			notifyWorkflowResult(ctx, "Implement workflow", result);
		},
	});

	pi.registerCommand("ops", {
		description: "Run the DevOps workflow through d43mon -> gl1tch -> sentinel",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /ops <task>", "error");
				return;
			}
			const plan: VoidRoutePlan = {
				domain: "DevOps",
				criticality: "Medium",
				agents: ["d43mon", "gl1tch", "sentinel"],
				rationale: ["Explicit DevOps workflow command."],
			};
			const result = await executePlan(ctx.cwd, plan, task);
			notifyWorkflowResult(ctx, "Ops workflow", result);
		},
	});

	pi.registerCommand("test", {
		description: "Run gl1tch against a testing or validation scope",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /test <scope>", "error");
				return;
			}
			const agent = getRequiredAgent(ctx.cwd, "gl1tch");
			const result = await runVoidSubagent(ctx.cwd, agent, {
				agent: "gl1tch",
				task,
				domain: "Unknown",
				criticality: "Medium",
				handoffNotes: "Direct /test workflow command",
			});
			notifyWorkflowResult(ctx, "Test workflow", {
				mode: "single",
				domain: "Unknown",
				criticality: "Medium",
				agents: ["gl1tch"],
				results: [result],
			});
		},
	});

	pi.registerCommand("review", {
		description: "Run sentinel as the final read-only reviewer",
		handler: async (args, ctx) => {
			const task = (args ?? "").trim();
			if (!task) {
				ctx.ui.notify("Usage: /review <scope>", "error");
				return;
			}
			const agent = getRequiredAgent(ctx.cwd, "sentinel");
			const result = await runVoidSubagent(ctx.cwd, agent, {
				agent: "sentinel",
				task,
				domain: "Unknown",
				criticality: "Medium",
				handoffNotes: "Direct /review workflow command",
			});
			notifyWorkflowResult(ctx, "Review workflow", {
				mode: "single",
				domain: "Unknown",
				criticality: "Medium",
				agents: ["sentinel"],
				results: [result],
			});
		},
	});

	pi.on("before_agent_start", async (event, ctx) => {
		if (!currentSessionIsNexus(ctx)) return;
		return {
			systemPrompt:
				event.systemPrompt +
				"\n\nNexus session overlay:\n- This session is running in Nexus single-agent mode.\n- Do not delegate to subagents.\n- Keep app and DevOps ownership explicit internally.\n- Use repository phase skills instead of inventing new role prompts.",
		};
	});

	pi.registerTool({
		name: "void_delegate",
		label: "Void Delegate",
		description:
			"Execute a real Pi subagent loaded from the configured Pi agent catalog and return its output. Intended for forger, d43mon, gl1tch, and sentinel.",
		parameters: Type.Object({
			agent: Type.String({ description: "Target subagent name, e.g. forger, d43mon, gl1tch, sentinel" }),
			task: Type.String({ description: "Exact delegated task" }),
			domain: Type.Optional(VoidDomainSchema),
			criticality: Type.Optional(VoidCriticalitySchema),
			handoffNotes: Type.Optional(Type.String({ description: "Additional handoff notes for the target agent" })),
			chainPosition: Type.Optional(Type.String({ description: "Optional chain metadata, e.g. 1/3" })),
		}),
		async execute(_toolCallId, params, signal, onUpdate, ctx) {
			const input = params as VoidDelegateInput;
			const agent = getAdaptedAgent(ctx.cwd, input.agent);
			if (!agent) {
				return {
					content: [{ type: "text", text: `Unknown agent: ${input.agent}` }],
					details: { status: "error", reason: "agent-not-found", requestedAgent: input.agent },
					isError: true,
				};
			}
			if (!DELEGABLE_AGENTS.has(agent.name) || !agent.canDelegate) {
				return {
					content: [{ type: "text", text: `Agent ${agent.name} is not configured as a real Pi subagent.` }],
					details: { status: "error", reason: "agent-not-delegable", agent: agent.name },
					isError: true,
				};
			}

			const result = await runVoidSubagent(ctx.cwd, agent, input, signal, (partial) => {
				onUpdate?.({
					content: [{ type: "text", text: `Running ${partial.agent}...` }],
					details: { status: "running", result: partial },
				});
			});

			const failed = result.exitCode !== 0 || result.stopReason === "error" || result.stopReason === "aborted";
			return {
				content: [
					{
						type: "text",
						text: failed
							? `Subagent ${agent.name} failed${result.errorMessage ? `: ${result.errorMessage}` : ""}`
							: summarizeWorkflowResult({
								mode: "single",
								domain: input.domain ?? "Unknown",
								criticality: input.criticality ?? "Unknown",
								agents: [agent.name],
								results: [result],
							}),
					},
				],
				details: { status: failed ? "error" : "completed", payload: input, result },
				isError: failed,
			};
		},
	});

	pi.registerTool({
		name: "ghost_route",
		label: "Ghost Route",
		description:
			"Classify a task using Ghost-style heuristics, return the route plan, and optionally execute the resulting workflow chain.",
		parameters: Type.Object({
			task: Type.String({ description: "Task to classify and route" }),
			domain: Type.Optional(VoidDomainSchema),
			execute: Type.Optional(Type.Boolean({ description: "Execute the routed chain immediately. Default: true.", default: true })),
		}),
		async execute(_toolCallId, params, signal, onUpdate, ctx) {
			const execute = params.execute ?? true;
			const plan = buildGhostRoute(params.task, params.domain as VoidDomain | undefined);
			if (!execute) {
				return {
					content: [{ type: "text", text: formatRoutePlan(plan) }],
					details: { status: "planned", plan },
				};
			}

			const workflow = await executePlan(ctx.cwd, plan, params.task, signal, (partial) => {
				onUpdate?.({
					content: [{ type: "text", text: `Ghost route in progress: ${plan.agents.join(" -> ")}` }],
					details: { status: "running", workflow: partial, plan },
				});
			});

			return {
				content: [{ type: "text", text: summarizeWorkflowResult(workflow) }],
				details: { status: workflowFailed(workflow) ? "error" : "completed", plan, workflow },
				isError: workflowFailed(workflow),
			};
		},
	});
}
