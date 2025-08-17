import { useCrud } from '@/hooks/useCrud';
import { useRightPanel } from '@/hooks/useRightPanel'
import type { Flow } from '@/types/pages/Flow';
import type { Step } from '@/types/pages/Step';
import FlowList from '@/components/pages/flow/FlowList';
import FlowForm from '@/components/pages/flow/FlowForm';
import MasterDetailPage from '@/pages/MasterDetailPage'
import { CONFIG } from '@/config'

interface Props { setRightPanel: (content: React.ReactNode) => void }

export default function StepConfigPage({ setRightPanel }: Props) {
	const { items: flows, save, remove } = useCrud<Flow>('/api/flow');
	const { items: Steps } = useCrud<Step>('/api/step');
	const { open, close } = useRightPanel(setRightPanel)



	const openForm = (flow: Flow | null) => {
		open(
			<FlowForm
				flow={flow}
				steps={Steps}
				onSave={async (f, id) => { await save(f, id); close() }}
				onDelete={async (id) => { await remove(id); close() }}
				onClose={close}
			/>
		)
	};


	return (
		<MasterDetailPage<Flow>
			title={CONFIG['page.flow.title']}
			items={flows}
			onOpenForm={openForm}
			ListComponent={({ items, onEdit }) => (
				<FlowList flows={items ?? []} onEdit={onEdit} />
			)}
			onCreateLabel={CONFIG['page.flow.add-button']}
		/>
	)
}
