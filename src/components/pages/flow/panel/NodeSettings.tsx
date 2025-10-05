import type { FC } from "react";
import type { Node } from "reactflow";
import type { NodeData, WeeklyDay, Schedule } from "@/types/FlowGraph";
import type { Step } from "@/types/pages/Step";

const DAYS: WeeklyDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type Props = {
    selectedNode: Node<NodeData> | null;
    selectedStep: Step | null;
    schedule: Schedule | undefined;
    weekly: Extract<Schedule, { type: "weekly" }> | undefined;
    monthly: Extract<Schedule, { type: "monthly" }> | undefined;
    yearly: Extract<Schedule, { type: "yearly" }> | undefined;
    updateSelectedNode: <K extends keyof NodeData>(key: K, value: NodeData[K]) => void;
};

const NodeSettings: FC<Props> = ({
    selectedNode,
    selectedStep,
    schedule,
    weekly,
    monthly,
    yearly,
    updateSelectedNode,
}) => {
    if (!selectedNode) {
        return <p className="text-gray-500">キャンバス上のノードを選択してください。</p>;
    }

    return (
        <div className="gap-3">
            <div>
                <h4 className="font-semibold mb-3">ノード設定</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs mb-1">ノード名</label>
                        <input
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                            value={selectedNode.data.label}
                            onChange={(e) => updateSelectedNode("label", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs mb-1">並列実行を許可</label>
                        <label className="inline-flex items-center gap-2 text-xs">
                            <input
                                type="checkbox"
                                checked={selectedNode.data.parallel}
                                onChange={(e) => updateSelectedNode("parallel", e.target.checked)}
                            />
                            許可する
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs mb-1">リトライ回数</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                            value={selectedNode.data.retryCount}
                            onChange={(e) => updateSelectedNode("retryCount", Number(e.target.value || 0))}
                        />
                    </div>

                    <div>
                        <label className="block text-xs mb-1">リトライ間隔(秒)</label>
                        <input
                            type="number"
                            min={0}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                            value={selectedNode.data.retryIntervalSec ?? 0}
                            onChange={(e) => updateSelectedNode("retryIntervalSec", Number(e.target.value || 0))}
                        />
                    </div>
                </div>

                {/* --- スケジュール --- */}
                <div className="mt-4 space-y-2">
                    <label className="block text-xs font-semibold">スケジュール</label>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                            <label className="block text-xs mb-1">種別</label>
                            <select
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                                value={schedule?.type ?? "daily"}
                                onChange={(e) => {
                                    const t = e.target.value as Schedule["type"];
                                    if (t === "daily") updateSelectedNode("schedule", { type: "daily", time: "00:00" });
                                    if (t === "weekly") updateSelectedNode("schedule", { type: "weekly", time: "00:00", daysOfWeek: [] });
                                    if (t === "monthly")
                                        updateSelectedNode("schedule", { type: "monthly", time: "00:00", daysOfMonth: [], lastDayOfMonth: false });
                                    if (t === "yearly") updateSelectedNode("schedule", { type: "yearly", time: "00:00", daysOfYear: [] });
                                }}
                            >
                                <option value="daily">daily</option>
                                <option value="weekly">weekly</option>
                                <option value="monthly">monthly</option>
                                <option value="yearly">yearly</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-xs mb-1">時間(HH:mm)</label>
                            <input
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                                value={schedule?.time ?? "00:00"}
                                onChange={(e) => schedule && updateSelectedNode("schedule", { ...schedule, time: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* weekly */}
                    {weekly && (
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => {
                                        const set = new Set(weekly.daysOfWeek ?? []);
                                        set.has(d) ? set.delete(d) : set.add(d);
                                        updateSelectedNode("schedule", { ...weekly, daysOfWeek: Array.from(set) });
                                    }}
                                    className={`px-2 py-1 rounded border text-xs ${(weekly.daysOfWeek ?? []).includes(d) ? "bg-blue-600 text-white border-blue-600" : "bg-transparent border-gray-400"
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* monthly */}
                    {monthly && (
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <label className="block text-xs mb-1">日付(1-31, カンマ区切り)</label>
                                <input
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                                    placeholder="1,15,31"
                                    value={(monthly.daysOfMonth ?? []).join(",")}
                                    onChange={(e) => {
                                        const nums = e.target.value
                                            .split(",")
                                            .map((s) => s.trim())
                                            .filter(Boolean)
                                            .map(Number)
                                            .filter((n) => Number.isInteger(n) && n >= 1 && n <= 31);
                                        updateSelectedNode("schedule", { ...monthly, daysOfMonth: nums });
                                    }}
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="inline-flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={!!monthly.lastDayOfMonth}
                                        onChange={(e) => updateSelectedNode("schedule", { ...monthly, lastDayOfMonth: e.target.checked })}
                                    />
                                    月末
                                </label>
                            </div>
                        </div>
                    )}

                    {/* yearly */}
                    {yearly && (
                        <div>
                            <label className="block text-xs mb-1">月日(MM-DD, カンマ区切り)</label>
                            <input
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                                placeholder="01-15,06-30"
                                value={(yearly.daysOfYear ?? []).join(",")}
                                onChange={(e) => {
                                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                    updateSelectedNode("schedule", { ...yearly, daysOfYear: list });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-3">ステップ情報</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                        <label className="block text-xs mb-1">ステップ名</label>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border truncate">
                            {selectedStep?.name ?? "(未取得)"}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs mb-1">ステップパス</label>
                        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border truncate">
                            {selectedStep?.batPath ?? "(未取得)"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeSettings;
