/** 曜日（週次スケジュール用） */
export type WeeklyDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

/** スケジュール共通：時刻は "HH:mm" を想定 */
export type ScheduleDaily = { type: "daily"; time: string };
export type ScheduleWeekly = { type: "weekly"; time: string; daysOfWeek: WeeklyDay[] };
export type ScheduleMonthly = {
    type: "monthly";
    time: string;
    /** 1–31 の整数。空なら未指定扱い */
    daysOfMonth: number[];
    /** 月末実行フラグ（28/29/30/31 の差異を吸収） */
    lastDayOfMonth: boolean;
};
export type ScheduleYearly = {
    type: "yearly";
    time: string;
    /** "MM-DD" 形式（例: "01-15", "12-31"） */
    daysOfYear: string[];
};

/** スケジュール：ユニオン */
export type Schedule = ScheduleDaily | ScheduleWeekly | ScheduleMonthly | ScheduleYearly;

/**
 * ノードのビジネスデータ
 * JSON には stepId のみ保持（名前やパスは描画時に steps から解決）
 */
export type NodeData = {
    /** 画面表示用の任意ラベル（ユーザーが編集可能） */
    label: string;
    retryCount: number;
    retryIntervalSec?: number;
    parallel: boolean;
    schedule: Schedule;

    /** 参照するステップのID（JSONにはこれだけ） */
    stepId: string;
};

/** フロー内ノード（ReactFlow 非依存の保存用構造） */
export type FlowNode = {
    id: string;
    position: { x: number; y: number };
    data: NodeData;
};

/** フロー内エッジ（シンプルな有向辺） */
export type FlowEdge = {
    id: string;
    source: string; // source node id
    target: string; // target node id
    type: "default";
};

/** フロー保存形式（flowJson へシリアライズする中身） */
export type FlowGraph = {
    nodes: FlowNode[];
    edges: FlowEdge[];
    idSeq: number;
};
