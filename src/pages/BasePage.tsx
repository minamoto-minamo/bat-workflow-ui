// pages/PageBase.tsx
import { useState, useRef, type ReactNode, useEffect } from 'react'
import SidebarMenu from '@/components/menu/SideBar'
import PostCommentPage from '@/pages/pages/PostCommentPage';
import FlowConfigPage from '@/pages/pages/FlowConfigPage';
import StepConfigPage from '@/pages/pages/StepConfigPage';
import { CONFIG } from '@/config'
import { type Page } from '@/types/Page';


export default function PageBase() {
	const [selectedPage, setSelectedPage] = useState<Page>("post")
	const [rightPanelContent, setRightPanelContent] = useState<ReactNode>(null)
	const [rightPanelWidth, setRightPanelWidth] = useState(CONFIG['page.base.right.start'])
	const isResizing = useRef(false)

	const handleMouseDown = () => {
		isResizing.current = true
	}

	const handleMouseMove = (e: MouseEvent) => {
		if (isResizing.current) {
			const newWidth = window.innerWidth - e.clientX
			const maxWidth = CONFIG['page.base.right.max']
			const minWidth = CONFIG['page.base.right.min']
			setRightPanelWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)))
		}
	}

	const handleMouseUp = () => {
		isResizing.current = false
	}

	useEffect(() => {
		setRightPanelContent(null)
	}, [selectedPage])

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	const renderContent = () => {
		switch (selectedPage) {
			case 'post':
				return <PostCommentPage setRightPanel={setRightPanelContent} />
			case 'step':
				return <StepConfigPage setRightPanel={setRightPanelContent} />
			case 'flow':
				return <FlowConfigPage setRightPanel={setRightPanelContent} />
			case 'control':
				return <div className='text-gray-400'>実行制御画面</div>
			case 'log':
				return <div className='text-gray-400'>統計・ログ閲覧画面</div>
		}
	}

	return (
		<div className='flex h-screen overflow-hidden'>
			{/* 左：サイドバー */}
			<aside className='bg-gray-800 text-white p-2 min-w-[64px] max-w-[200px]'>
				<SidebarMenu selectedPage={selectedPage} onSelectPage={setSelectedPage} />
			</aside>

			{/* 中央：可変エリア */}
			<main className='flex-1 overflow-auto p-4 bg-gray-100 min-w-5'>
				{renderContent()}
			</main>

			{/* ドラッグバー */}
			<div
				onMouseDown={handleMouseDown}
				className='w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400'
			/>

			{/* 右：リサイズ可能パネル */}
			<aside
				className='bg-white border-l border-gray-300 p-4'
				style={{ width: `${rightPanelWidth}px` }}
			>
				{rightPanelContent}
			</aside>
		</div>
	)
}