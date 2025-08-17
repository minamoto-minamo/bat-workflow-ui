/**
 * ISO文字列や日付文字列をローカル日時形式に変換する。
 * @param v ISO形式の文字列（例: '2025-08-09T10:00:00Z'）
 * @returns ローカル日時文字列 or '—'
 */
export function formatDateTime(v?: string): string {
    if (!v) return '—';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    return d.toLocaleString();
}
