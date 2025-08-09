import type { Step } from "@/types/Step"
import { usePagination } from "@/hooks/usePagination"
import Pagination from "@/components/common/Pagination"
import CopyableCell from "@/components/common/CopyableCell"

interface StepListProps {
    steps: Step[]
    onEdit: (step: Step) => void
}

export default function StepList({ steps, onEdit }: StepListProps) {
    const { page, totalPages, pageItems, setPage } = usePagination(steps, 10)

    return (
        <div className="space-y-4">
            <table className="w-full text-sm table-fixed">
                <thead>
                    <tr className="text-left border-b border-gray-600">
                        <th className="px-2 py-1 text-center w-[150px]">ステップ名</th>
                        <th className="px-2 py-1 text-center w-[200px]">batパス</th>
                        <th className="px-2 py-1 text-center w-[200px]">メモ</th>
                        <th className="px-2 py-1 text-center w-[100px]">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {pageItems.map((step) => (
                        <tr key={step.id} className="border-b border-gray-700">
                            <CopyableCell value={step.name} cellKey={`name-${step.id}`} />
                            <CopyableCell value={step.batPath} cellKey={`bat-${step.id}`} />
                            <CopyableCell value={step.memo ?? ""} cellKey={`memo-${step.id}`} />
                            <td className="px-2 py-1 text-center">
                                <button
                                    className="bg-gray-700 px-4 py-2 rounded text-white text-base hover:bg-gray-600"
                                    onClick={() => onEdit(step)}
                                >
                                    編集
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
    )
}
