// components/SidebarMenu.tsx
import { Home, List, Play, BarChart, Workflow } from 'lucide-react'
import NavItem from './MenuItem'

type Page = 'home' | 'step' | 'flow' | 'control' | 'log'

interface SidebarMenuProps {
	selectedPage: Page
	onSelectPage: (page: Page) => void
}

export default function SidebarMenu({ selectedPage, onSelectPage }: SidebarMenuProps) {
	return (
		<div className='text-white'>
			<h1 className='text-2xl font-extrabold text-white px-4 py-4 hidden lg:inline-block'>
				Bat Workflow Scheduler
			</h1>
			<nav className='flex flex-col items-center gap-2 text-sm'>
				<NavItem icon={Home} label='ホーム' selected={selectedPage === 'home'} onClick={() => onSelectPage('home')} />
				<NavItem icon={List} label='ステップ定義' selected={selectedPage === 'step'} onClick={() => onSelectPage('step')} />
				<NavItem icon={Workflow} label='フロー構築' selected={selectedPage === 'flow'} onClick={() => onSelectPage('flow')} />
				<NavItem icon={Play} label='実行制御' selected={selectedPage === 'control'} onClick={() => onSelectPage('control')} />
				<NavItem icon={BarChart} label='統計・ログ閲覧' selected={selectedPage === 'log'} onClick={() => onSelectPage('log')} />
			</nav>
		</div>
	)
}
