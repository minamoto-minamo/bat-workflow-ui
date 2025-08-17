import type { Step } from '@/types/pages/Step'
import { CopyableCell, ButtonCell, HeaderCell } from '@/components/common/Cell'
import { usePagination } from '@/hooks/usePagination'
import Pagination from '@/components/common/Pagination'
import NoItem from '@/components/common/NoItem'
import { Page } from '@/types/Page'

interface StepListProps {
    steps: Step[]
    onEdit: (step: Step) => void
}

export default function StepList({ steps, onEdit }: StepListProps) {
    const { page, totalPages, pageItems, setPage } = usePagination(steps ?? [])

    return (
        <div className='p-4'>
            <table className='w-full text-sm table-fixed'>
                <thead>
                    <tr className='text-left border-b border-gray-600'>
                        <HeaderCell name='ステップ名' width='150' />
                        <HeaderCell name='batパス' width='200' />
                        <HeaderCell name='メモ' width='200' />
                        <HeaderCell name='操作' width='70' />
                    </tr>
                </thead>
                <tbody>
                    {pageItems.map((step) => (
                        <tr key={step.id} className='border-b border-gray-700'>
                            <CopyableCell value={step.name} cellKey={`name-${step.id}`} />
                            <CopyableCell value={step.batPath} cellKey={`bat-${step.id}`} />
                            <CopyableCell value={step.memo ?? ''} cellKey={`memo-${step.id}`} />
                            <ButtonCell onClick={() => onEdit(step)} />
                        </tr>
                    ))}

                </tbody>
            </table>
            {pageItems.length === 0 && (
                <NoItem page={Page.Step} />
            )}

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    )
}
