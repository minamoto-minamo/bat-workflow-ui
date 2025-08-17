import type { Edge, Node } from "reactflow";
import type { FlowGraph } from "@/types/FlowGraph";
import { validateWorkflow } from "@/utils/pages/flow/flowValidation";

/** ReactFlow -> 保存用 JSON へ整形（UI非依存） */
export const toFlowJson = (nodes: Node[], edges: Edge[], idSeq: number): FlowGraph => ({
    nodes: nodes.map((n) => ({ id: n.id, position: n.position, data: n.data })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: "default" })),
    idSeq
});

/** 検証を走らせ、NGならユーザー向けメッセージを返す（nullならOK） */
export const validateOrMessage = (nodes: Node[], edges: Edge[]): string | null => {
    const r = validateWorkflow(nodes, edges);
    if (r.ok) return null;

    if (r.reason === "cycle") {
        const loop = r.detail.cycleNodeIds?.join(" → ") ?? "(特定不可)";
        return `保存できません：フローが循環しています。\n循環: ${loop}`;
    }
    if (r.reason === "disconnected") {
        const comps = r.detail.components.map((c, i) => `#${i + 1}: ${c.join(", ")}`).join("\n");
        return `保存できません：フローが二つ以上に分かれています。\n連結成分:\n${comps}`;
    }
    return "未知の検証エラーが発生しました。";
};
