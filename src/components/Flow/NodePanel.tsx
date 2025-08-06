import React from 'react';

const NodePanel: React.FC = () => {
	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData('application/reactflow', nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	return (
		<div>
			<p className="font-bold mb-2">ステップ一覧</p>
			<div
				className="p-2 bg-white border mb-2 cursor-pointer"
				onDragStart={(e) => onDragStart(e, 'default')}
				draggable
			>
				バッチステップ
			</div>
		</div>
	);
};

export default NodePanel;
