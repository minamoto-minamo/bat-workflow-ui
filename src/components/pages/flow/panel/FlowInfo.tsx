import type { FC } from "react";

type Props = {
    isEdit: boolean;
    name: string;
    memo: string;
    setName: (v: string) => void;
    setMemo: (v: string) => void;
    onClose: () => void;
    onSave: () => void;
    onDelete?: () => void;
};

const FlowInfo: FC<Props> = ({ isEdit, name, memo, setName, setMemo, onClose, onSave, onDelete }) => {
    return (
        <>
            <h3 className="text-base font-bold mb-3">{isEdit ? "フローを編集" : "新規フロー"}</h3>

            <label className="block text-xs mb-1">フロー名</label>
            <input
                className="w-full border border-gray-400 dark:border-gray-600 rounded px-2 py-1 mb-3 bg-white dark:bg-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
            />

            <label className="block text-xs mb-1">メモ</label>
            <textarea
                className="w-full border border-gray-400 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 resize-none"
                rows={2}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                maxLength={1000}
            />

            <div className="flex gap-2 mt-4">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded" onClick={onClose}>
                    閉じる
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded" onClick={onSave}>
                    保存
                </button>
                {onDelete && (
                    <button className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" onClick={onDelete}>
                        削除
                    </button>
                )}
            </div>
        </>
    );
};

export default FlowInfo;
