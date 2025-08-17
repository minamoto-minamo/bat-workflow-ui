import { useClipboard } from '@/hooks/useClipboard'

interface CellProps {
    value?: string
}

export function Cell({ value = '' }: CellProps) {
    return (
        <td className='px-3 py-2 truncate cursor-copy'>
            <div className='flex items-center gap-2'>
                <span>{value}</span>
            </div>
        </td>
    )
}


type ButtonCellProps = {
    onClick: () => void;
    label?: string;
    className?: string;
    disabled?: boolean;
};

export function ButtonCell({ onClick, label = '編集', className = '', }: ButtonCellProps) {
    return (
        <td className={`px-3 py-2 truncate text-center ${className}`}>
            <button
                type='button'
                onClick={onClick}
                className='bg-gray-700 px-4 py-2 rounded text-white text-base hover:bg-gray-600'
            >
                {label}
            </button>
        </td>
    );
}


interface CopyableCellProps {
    value?: string
    cellKey: string
}

export function CopyableCell({ value = '', cellKey }: CopyableCellProps) {
    const { copy, copiedKey } = useClipboard()

    return (
        <td
            className='px-3 py-2 truncate cursor-copy'
            title={`${value}\nダブルクリックでコピー`}
            onDoubleClick={(e) => {
                e.stopPropagation()
                copy(value, cellKey)
            }}
        >
            <div className='flex items-center gap-2'>
                <span>{value}</span>
                {copiedKey === cellKey && (
                    <span className='text-xs text-green-600 select-none'>Copied</span>
                )}
            </div>
        </td>
    )
}



// 定数でないとTailwindがうまく解釈してくれない場面があるので
// おまじないとして定数化しておく。
const WIDTH_CLASS: Record<string, string> = {
    '70': 'w-[70px]',
    '90': 'w-[90px]',
    '150': 'w-[150px]',
    '200': 'w-[200px]',
} as const;

interface HeaderCellProps {
    name: string
    width: string
}

export function HeaderCell({ name, width }: HeaderCellProps) {
    const cls = WIDTH_CLASS[width];
    return (
        <th className={`px-3 py-2 text-center ${cls ?? `w-[${width}px]`}`}>
            {name}
        </th>
    );
}
