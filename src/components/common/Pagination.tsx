type Props = {
    page: number
    totalPages: number
    onChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
    if (totalPages <= 1) return null

    // 数字ボタンは現在ページの前後に限定してスリムに
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)

    return (
        <div className='flex justify-center items-center gap-2 mt-4'>
            <button
                className='px-3 py-1 border rounded bg-gray-200 disabled:opacity-50'
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
            >
                前へ
            </button>

            {/* 省略記号対応 */}
            {pages.map((p, idx) => {
                const prev = pages[idx - 1]
                const showDots = idx > 0 && p - (prev ?? p) > 1
                return (
                    <span key={p} className='flex'>
                        {showDots && <span className='px-2'>…</span>}
                        <button
                            className={`px-3 py-1 border rounded ${page === p ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}
                            onClick={() => onChange(p)}
                            aria-current={page === p ? 'page' : undefined}
                        >
                            {p}
                        </button>
                    </span>
                )
            })}

            <button
                className='px-3 py-1 border rounded bg-gray-200 disabled:opacity-50'
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
            >
                次へ
            </button>
        </div>
    )
}
