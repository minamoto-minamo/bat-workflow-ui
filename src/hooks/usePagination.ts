import { useMemo, useState } from "react"

export function usePagination<T>(items: T[], perPage = 10) {
    const [page, setPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(items.length / perPage))
    const safePage = Math.min(page, totalPages)

    const pageItems = useMemo(() => {
        const start = (safePage - 1) * perPage
        return items.slice(start, start + perPage)
    }, [items, perPage, safePage])

    const go = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))
    const next = () => go(safePage + 1)
    const prev = () => go(safePage - 1)
    const reset = () => setPage(1)

    return { page: safePage, totalPages, pageItems, perPage, setPage: go, next, prev, reset }
}
