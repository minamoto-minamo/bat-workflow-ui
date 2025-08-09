// src/hooks/useCrud.ts
import { useEffect, useState } from "react"

export type HasId = { id: number }

export function useCrud<T extends HasId>(
    resourcePath: string, // 例: "/api/post" | "/api/step"
    sortBy: (a: T, b: T) => number = (a, b) => a.id - b.id
) {
    const [items, setItems] = useState<T[]>([])

    useEffect(() => {
        fetch(resourcePath)
            .then(res => res.json())
            .then((data: T[]) => setItems(data.sort(sortBy)))
    }, [resourcePath])

    const save = async <U extends Partial<T>>(payload: U, id?: number) => {
        const res = await fetch(id ? `${resourcePath}/${id}` : resourcePath, {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        const saved: T = await res.json()
        setItems(prev => [...prev.filter(x => x.id !== saved.id), saved].sort(sortBy))
        return saved
    }

    const remove = async (id: number) => {
        await fetch(`${resourcePath}/${id}`, { method: "DELETE" })
        setItems(prev => prev.filter(x => x.id !== id))
    }

    return { items, setItems, save, remove }
}
