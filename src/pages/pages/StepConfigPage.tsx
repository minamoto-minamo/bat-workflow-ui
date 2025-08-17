import { useCrud } from '@/hooks/useCrud'
import { useRightPanel } from '@/hooks/useRightPanel'
import type { Step } from '@/types/pages/Step'
import StepForm from '@/components/pages/step/StepForm'
import StepList from '@/components/pages/step/StepList'
import MasterDetailPage from '@/pages/MasterDetailPage'
import { CONFIG } from '@/config'

interface Props { setRightPanel: (content: React.ReactNode) => void }

export default function StepConfigPage({ setRightPanel }: Props) {
	const { items: steps, save, remove } = useCrud<Step>('/api/step')
	const { open, close } = useRightPanel(setRightPanel)

	const openForm = (step: Step | null) => {
		open(
			<StepForm
				step={step}
				onSave={async (s, id) => { await save(s, id); close() }}
				onDelete={async (id) => { await remove(id); close() }}
				onClose={close}
			/>
		)
	}

	return (
		<MasterDetailPage<Step>
			title={CONFIG['page.step.title']}
			items={steps}
			onOpenForm={openForm}
			ListComponent={({ items, onEdit }) => (
				<StepList steps={items} onEdit={onEdit} />
			)}
			onCreateLabel={CONFIG['page.step.add-button']}
		/>
	)
}
