import type { Edge, Node } from 'reactflow';

export type CycleResult = { hasCycle: boolean; cycleNodeIds?: string[] };
export type ConnectivityResult = { isSingleComponent: boolean; components: string[][] };

function hasCycleByKahn(nodes: Node[], edges: Edge[]): boolean {
    const indeg = new Map<string, number>();
    const outAdj = new Map<string, string[]>();
    for (const n of nodes) { indeg.set(n.id, 0); outAdj.set(n.id, []); }
    for (const e of edges) {
        if (!indeg.has(e.source) || !indeg.has(e.target)) continue;
        if (e.source === e.target) return true; // 自己ループは即循環
        indeg.set(e.target, (indeg.get(e.target)! + 1));
        outAdj.get(e.source)!.push(e.target);
    }
    const q: string[] = [];
    for (const [id, d] of indeg) if (d === 0) q.push(id);
    let removed = 0;
    while (q.length) {
        const u = q.shift()!;
        removed++;
        for (const v of outAdj.get(u)!) {
            indeg.set(v, indeg.get(v)! - 1);
            if (indeg.get(v) === 0) q.push(v);
        }
    }
    return removed !== nodes.length;
}

export function findCycle(nodes: Node[], edges: Edge[]): CycleResult {
    if (!hasCycleByKahn(nodes, edges)) return { hasCycle: false };

    const adj = new Map<string, string[]>(); for (const n of nodes) adj.set(n.id, []);
    for (const e of edges) if (adj.has(e.source) && adj.has(e.target)) adj.get(e.source)!.push(e.target);

    const color = new Map<string, 0 | 1 | 2>(); const parent = new Map<string, string | null>();
    for (const n of nodes) { color.set(n.id, 0); parent.set(n.id, null); }

    const cycle: string[] = [];
    const dfs = (u: string): boolean => {
        color.set(u, 1);
        for (const v of adj.get(u)!) {
            if (u === v) { cycle.push(u, v); return true; }
            if (color.get(v) === 0) { parent.set(v, u); if (dfs(v)) return true; }
            else if (color.get(v) === 1) {
                const path: string[] = [v];
                for (let cur: string | null = u; cur && cur !== v; cur = parent.get(cur)!) path.push(cur);
                path.push(v); path.reverse(); cycle.push(...path); return true;
            }
        }
        color.set(u, 2); return false;
    };

    for (const n of nodes) if (color.get(n.id) === 0 && dfs(n.id)) return { hasCycle: true, cycleNodeIds: cycle };
    return { hasCycle: true };
}

export function checkWeakConnectivity(nodes: Node[], edges: Edge[]): ConnectivityResult {
    const und = new Map<string, Set<string>>(); for (const n of nodes) und.set(n.id, new Set());
    for (const e of edges) {
        if (!und.has(e.source) || !und.has(e.target) || e.source === e.target) continue;
        und.get(e.source)!.add(e.target);
        und.get(e.target)!.add(e.source);
    }

    const visited = new Set<string>(); const components: string[][] = [];
    const bfs = (s: string) => {
        const q = [s]; visited.add(s); const comp = [s];
        while (q.length) {
            const u = q.shift()!;
            for (const v of und.get(u)!) if (!visited.has(v)) { visited.add(v); q.push(v); comp.push(v); }
        }
        components.push(comp);
    };
    for (const n of nodes) if (!visited.has(n.id)) bfs(n.id);

    return { isSingleComponent: components.length <= 1, components };
}

export function validateWorkflow(nodes: Node[], edges: Edge[]) {
    const cycle = findCycle(nodes, edges);
    if (cycle.hasCycle) return { ok: false as const, reason: 'cycle' as const, detail: cycle };
    const conn = checkWeakConnectivity(nodes, edges);
    if (!conn.isSingleComponent) return { ok: false as const, reason: 'disconnected' as const, detail: conn };
    return { ok: true as const };
}
