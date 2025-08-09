import { useClipboard } from "@/hooks/useClipboard"

interface CopyableCellProps {
    value?: string
    label?: string
    cellKey: string
}

export default function CopyableCell({ value = "", cellKey }: CopyableCellProps) {
    const { copy, copiedKey } = useClipboard()

    return (
        <td
            className="px-2 py-1 truncate cursor-copy"
            title={`${value}\nダブルクリックでコピー`}
            onDoubleClick={(e) => {
                e.stopPropagation()
                copy(value, cellKey)
            }}
        >
            <div className="flex items-center gap-2">
                <span>{value}</span>
                {copiedKey === cellKey && (
                    <span className="text-xs text-green-600 select-none">Copied</span>
                )}
            </div>
        </td>
    )
}
