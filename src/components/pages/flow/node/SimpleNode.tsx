import { Handle, Position, type NodeProps } from "reactflow";

export default function WhiteNode({ data }: NodeProps<any>) {
    const invalid = !!data?.invalid; // FlowForm 側で付与

    return (
        <div
            className={[
                "rounded-xl border bg-white text-black shadow-sm relative",
                invalid ? "border-red-500 bg-red-50" : "border-gray-300",
            ].join(" ")}
            title={invalid ? "このステップは削除済みです" : data?.label}
        >
            {/* 角の小さなバッジ */}
            {invalid && (
                <span className="absolute -top-4 -left-5 rounded-full bg-red-500 text-white px-2 py-[2px] text-[10px] font-semibold shadow">
                    削除済み
                </span>
            )}

            <div className="flex items-center gap-2 px-3 py-2">
                {invalid && <span aria-hidden className="text-red-500">⚠</span>}
                <span className="max-w-[220px] truncate text-[13px] leading-5">
                    {data?.label ?? ""}
                </span>
            </div>

            {/* React Flow handles */}
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
