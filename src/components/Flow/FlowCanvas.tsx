import React, { useCallback, useState } from 'react'
import ReactFlow, {
	addEdge,
	Background,
	Controls,
	MiniMap,
	useEdgesState,
	useNodesState,
	type Edge,
	type Node,
	type Connection, // ✅ 型だけ明示
} from 'reactflow'
import 'reactflow/dist/style.css'

const FlowCanvas: React.FC = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([])

	const onConnect = useCallback(
		(params: Edge | Connection) => {
			setEdges((eds) => addEdge(params, eds))
		},
		[setEdges]
	)

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()

			const type = event.dataTransfer.getData('application/reactflow')
			const position = { x: event.clientX - 300, y: event.clientY } // 左パネルを想定して補正
			const newNode: Node = {
				id: `${Date.now()}`,
				type,
				position,
				data: { label: `新しいステップ` },
			}
			setNodes((nds) => nds.concat(newNode))
		},
		[setNodes]
	)

	return (
		<div
			className="w-full h-full"
			onDrop={onDrop}
			onDragOver={(e) => e.preventDefault()}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			>
				<MiniMap />
				<Controls />
				<Background />
			</ReactFlow>
		</div>
	)
}

export default FlowCanvas
