import type { Flow } from '@/types/pages/Flow'
import { formatDateTime } from '@/utils/formatDateTime';
import { ButtonCell, Cell, HeaderCell, CopyableCell } from '@/components/common/Cell';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/common/Pagination';
import NoItem from '@/components/common/NoItem';
import { Page } from '@/types/Page';


interface FlowListProps {
    flows: Flow[];
    onEdit: (flow: Flow) => void;
}

export default function FlowList({ flows, onEdit }: FlowListProps) {
    const { page, totalPages, pageItems, setPage } = usePagination(flows ?? []);

    return (
        <div className='p-4'>
            <table className='w-full text-sm table-fixed'>
                <thead>
                    <tr className='text-left border-b border-gray-600'>
                        <HeaderCell name='フロー名' width='150' />
                        <HeaderCell name='メモ' width='200' />
                        <HeaderCell name='作成日' width='90' />
                        <HeaderCell name='更新日' width='90' />
                        <HeaderCell name='操作' width='70' />
                    </tr>
                </thead>
                <tbody>
                    {pageItems.map((flow) => (
                        <tr key={flow.id} className='border-b border-gray-700'>
                            <CopyableCell value={flow.name} cellKey={`name-${flow.id}`} />
                            <CopyableCell value={flow.memo ?? ''} cellKey={`memo-${flow.id}`} />
                            <Cell value={formatDateTime(flow.createdAt)} />
                            <Cell value={formatDateTime(flow.updatedAt)} />
                            <ButtonCell onClick={() => onEdit(flow)} />
                        </tr>
                    ))}
                </tbody>
            </table>

            {pageItems.length === 0 && (
                <NoItem page={Page.Flow} />
            )}
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    );
}
