interface Props {
    label?: string
    onEdit: () => void
}

export default function CreateButton({ label, onEdit }: Props) {
    return (
        <button
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 truncate'
            onClick={onEdit}
        >
            {`＋ ${label}`}
        </button>
    )

}