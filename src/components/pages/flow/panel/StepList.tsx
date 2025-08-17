import type { FC } from "react";
import type { Step } from "@/types/pages/Step";

type Props = {
    steps: Step[];
    onDragStart: (e: React.DragEvent, stepId: string, stepName: string) => void;
};

const StepList: FC<Props> = ({ steps, onDragStart }) => {
    return (
        <>
            <h4 className="font-semibold mb-3">ステップ一覧</h4>
            <ul className="space-y-2">
                {steps.map((s) => (
                    <li
                        key={s.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, String(s.id), String(s.name))}
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 cursor-grab active:cursor-grabbing bg-gray-50 dark:bg-gray-800"
                        title={`${s.name}\n${s.batPath}`}
                    >
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-gray-500 truncate">{s.batPath}</div>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default StepList;
