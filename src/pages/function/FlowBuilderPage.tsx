import React from 'react'
import FlowCanvas from '@/components/Flow/FlowCanvas'
import NodePanel from '@/components/Flow/NodePanel'


const FlowBuilderPage: React.FC = () => {
	return (
		<div className="bg-gray-800 min-h-screen text-white p-10">
			<div className="w-64 bg-gray-100 p-4 border-r">
				<NodePanel />
			</div>
			<div className="flex-1">
				<FlowCanvas />
			</div>
		</div>
	)
}

export default FlowBuilderPage
