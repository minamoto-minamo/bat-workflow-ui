import type { LucideIcon } from 'lucide-react'

type NavItemProps = {
	icon: LucideIcon
	label: string
	selected?: boolean
	onClick: () => void
}

export default function NavItem({ icon: Icon, label, selected, onClick }: NavItemProps) {
	return (
		<button
			onClick={onClick}
			className={`flex justify-center px-1 py-1 rounded-md w-4/5
        ${selected ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
		>
			<Icon className="w-5 h-5" size={18} />
			<span className="ml-2 hidden lg:inline-block whitespace-nowrap">{label}</span>
		</button>
	)
}