// src/components/common/MasterDetailPage.tsx
import React from "react"
import { type HasId } from "@/hooks/useCrud"
import Button from "@/components/common/Button"

type MasterDetailPageProps<T extends HasId> = {
    title: string
    items: T[]
    onOpenForm: (target: T | null) => void
    ListComponent: React.ComponentType<{ items: T[], onEdit: (t: T) => void }>
    onCreateLabel?: string
}

export default function MasterDetailPage<T extends HasId>({
    title,
    items,
    onOpenForm,
    ListComponent,
    onCreateLabel = "＋ 新規作成",
}: MasterDetailPageProps<T>) {
    return (
        <div className="text-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                <Button label={onCreateLabel} onEdit={() => onOpenForm(null)} />
            </div>

            <ListComponent items={items} onEdit={onOpenForm} />
        </div>
    )
}
