import type { FC } from "react";
import SimpleNode from "@/components/pages/flow/node/SimpleNode";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    type OnConnect,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
} from "reactflow";
import type { NodeData } from "@/types/FlowGraph";

const nodeTypes = { default: SimpleNode }; // ★ 追加（既存default置き換え）

type Props = {
    nodes: Node<NodeData>[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: OnConnect;
    onNodeClick: (id: string) => void;
};

const Canvas: FC<Props> = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick }) => {
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, n) => onNodeClick(n.id)}
        >
            <Background style={{ backgroundColor: 'white' }} /> {/* grid の線は薄グレー */}
            <Controls />
            <MiniMap />
        </ReactFlow>
    );
};

export default Canvas;
