import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { addEdge, type Connection, type Edge, type OnConnect, type Node, useEdgesState, useNodesState } from "reactflow"
import "reactflow/dist/style.css"

import type { Flow } from "@/types/pages/Flow"
import type { Step } from "@/types/pages/Step"
import type { FlowGraph, NodeData, Schedule } from "@/types/FlowGraph"
import { toFlowJson, validateOrMessage, nextSeqFrom } from "@/utils/pages/flow"

import FlowInfo from "@/components/pages/flow/panel/FlowInfo"
import StepList from "@/components/pages/flow/panel/StepList"
import NodeSettings from "@/components/pages/flow/panel/NodeSettings"
import Canvas from "@/components/pages/flow/panel/Canvas"

type FlowSaveDto = { name: string; memo?: string; flowJson: string };

interface Props {
	flow: (Flow & { flowJson?: string }) | null;
	steps: Step[];
	onSave: (dto: FlowSaveDto, id?: number) => void;
	onDelete?: (id: number) => void;
	onClose: () => void;
}


export default function FlowForm({ flow, steps, onSave, onDelete, onClose }: Props) {
	const idSeq = useRef(1);
	const [name, setName] = useState("");
	const [memo, setMemo] = useState("");

	// React Flow state
	const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

	// 編集時の初期復元（互換なし：stepId のみを期待）
	useEffect(() => {
		setSelectedNodeId(null);
		setName(flow?.name ?? "");
		setMemo(flow?.memo ?? "");

		if (!flow?.flowJson) {
			setNodes([]);
			setEdges([]);
			idSeq.current = 1;
			return;
		}

		try {
			const parsed = JSON.parse(flow.flowJson) as FlowGraph;

			idSeq.current = Number.isInteger(parsed.idSeq) && parsed.idSeq! > 0
				? (parsed as any).idSeq as number
				: nextSeqFrom(parsed.nodes ?? []);

			const initNodes: Node<NodeData>[] = (parsed.nodes ?? []).map((n) => ({
				id: n.id,
				position: n.position,
				data: n.data,
				type: "default",
			}));

			const initEdges: Edge[] = (parsed.edges ?? []).map((e) => ({
				id: e.id,
				source: e.source,
				target: e.target,
				type: "default",
			}));
			setNodes(initNodes);
			setEdges(initEdges);
		} catch {
			setNodes([]);
			setEdges([]);
		}
	}, [flow, setNodes, setEdges]);

	// ステップD&D（中央→キャンバス）
	const onDragStart = (e: React.DragEvent, stepId: string, stepName: string) => {
		e.dataTransfer.setData("application/step-id", stepId);
		e.dataTransfer.setData("application/step-name", stepName);
		e.dataTransfer.effectAllowed = "move";
	};

	// キャンバスへドロップでノード生成（JSONには stepId のみ保持）

	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
			const stepId = e.dataTransfer.getData("application/step-id");
			const stepName = e.dataTransfer.getData("application/step-name");
			if (!stepId) return;

			const position = { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
			const newId = `step-${String(idSeq.current++).padStart(5, "0")}`;

			const defaultData: NodeData = {
				label: stepName || newId,
				retryCount: 0,
				retryIntervalSec: 0,
				parallel: false,
				schedule: { type: "daily", time: "00:00" },
				stepId,
			};

			setNodes((nds) =>
				nds.concat({
					id: newId,
					position,
					data: defaultData,
					type: "default",
				}),
			);
			setSelectedNodeId(newId);
		},
		[setNodes],
	);

	const onDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const onConnect: OnConnect = useCallback(
		(params: Edge | Connection) =>
			setEdges((eds) => addEdge({ ...(params as any), id: `e-${uid()}`, type: "default" } as Edge, eds)),
		[setEdges],
	);

	const invalidNodeIds = useMemo(() => {
		const valid = new Set(steps.map(s => String(s.id)));
		return new Set(
			nodes.filter(n => !valid.has(String(n.data.stepId))).map(n => n.id)
		);
	}, [nodes, steps]);

	const viewNodes = useMemo(() => (
		nodes.map(n => ({ ...n, data: { ...n.data, invalid: invalidNodeIds.has(n.id) } }))
	), [nodes, invalidNodeIds]);

	// 選択ノード & 描画用ステップ解決（名前/パスは常に steps から）
	const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);
	const selectedStep = useMemo(() => {
		const sid = selectedNode?.data.stepId;
		return sid ? steps.find((s) => String(s.id) === String(sid)) ?? null : null;
	}, [selectedNode, steps]);

	// スケジュールの絞り込み（パネルへ渡す）
	const schedule = selectedNode?.data.schedule;
	type Weekly = Extract<Schedule, { type: "weekly" }>;
	type Monthly = Extract<Schedule, { type: "monthly" }>;
	type Yearly = Extract<Schedule, { type: "yearly" }>;
	const weekly = (schedule?.type === "weekly" ? schedule : undefined) as Weekly | undefined;
	const monthly = (schedule?.type === "monthly" ? schedule : undefined) as Monthly | undefined;
	const yearly = (schedule?.type === "yearly" ? schedule : undefined) as Yearly | undefined;

	// ノード更新
	const updateSelectedNode = <K extends keyof NodeData>(key: K, value: NodeData[K]) => {
		if (!selectedNodeId) return;
		setNodes((nds) => nds.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, [key]: value } } : n)));
	};

	// 保存（JSONは stepId のみ）
	const handleSave = () => {
		if (!name.trim()) {
			alert("フロー名は必須です。");
			return;
		}

		if (invalidNodeIds.size > 0) {
			// ラベル表示（無ければID）
			const list = nodes
				.filter(n => invalidNodeIds.has(n.id))
				.map(n => n.data.label || n.id)
				.join(", ");
			alert(`保存できません：削除済みのステップが含まれています。\n対象: ${list}`);
			return;
		}

		const msg = validateOrMessage(nodes, edges);
		if (msg) { alert(msg); return; }

		const json = toFlowJson(nodes, edges, idSeq.current);
		const flowJson = JSON.stringify(json)

		onSave(
			{ name, memo, flowJson },
			flow?.id
		);
	};

	const handleDelete = () => {
		if (flow?.id && confirm("本当に削除しますか？")) onDelete?.(flow.id);
	};

	return (
		<div className="h-full grid grid-cols-[280px_1fr] grid-rows-[260px_1fr] gap-4 text-sm">
			{/* 左上：フロー情報（枠のみ保持） */}
			<section className="col-[1/2] row-[1/2] bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 p-4 text-gray-900 dark:text-gray-100">
				<FlowInfo
					isEdit={!!flow}
					name={name}
					memo={memo}
					setName={setName}
					setMemo={setMemo}
					onClose={onClose}
					onSave={handleSave}
					onDelete={flow?.id ? () => handleDelete() : undefined}
				/>
			</section>

			{/* 左下：ステップ一覧（枠のみ保持） */}
			<section className="col-[1/2] row-[2/3] bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 p-4 overflow-auto">
				<StepList steps={steps} onDragStart={onDragStart} />
			</section>

			{/* 右上：ノード設定（枠のみ保持） */}
			<section className="col-[2/3] row-[1/2] bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 p-4 overflow-auto">
				<NodeSettings
					selectedNode={selectedNode}
					selectedStep={selectedStep}
					schedule={schedule}
					weekly={weekly}
					monthly={monthly}
					yearly={yearly}
					updateSelectedNode={updateSelectedNode}
				/>
			</section>

			{/* 右下：キャンバス（枠のみ保持） */}
			<section
				className="col-[2/3] row-[2/3] bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 overflow-hidden"
				onDrop={onDrop}
				onDragOver={onDragOver}
			>
				<Canvas
					nodes={viewNodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onNodeClick={(id) => setSelectedNodeId(id)}
				/>
			</section>
		</div>
	);
}

function uid() {
	if ("randomUUID" in crypto) return (crypto as any).randomUUID();
	return Math.random().toString(36).slice(2);
}
