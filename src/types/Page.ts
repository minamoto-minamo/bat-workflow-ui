export const Page = Object.freeze({
    Post: 'post',
    Step: 'step',
    Flow: 'flow',
    Control: 'control',
    Log: 'log',
} as const);
export type Page = typeof Page[keyof typeof Page];


export const PAGES = Object.freeze(Object.values(Page)) as readonly Page[];


export function isPage(v: unknown): v is Page {
    return typeof v === 'string' && (PAGES as readonly string[]).includes(v);
}

export function parsePage(v: unknown): Page | undefined {
    return isPage(v) ? v : undefined;
}
export function parsePageOr(v: unknown, fallback: Page): Page {
    return isPage(v) ? v : fallback;
}

export function assertPage(v: unknown): asserts v is Page {
    if (!isPage(v)) throw new Error(`Invalid Page: ${String(v)}`);
}

export function assertNever(x: never): never {
    throw new Error(`Unreachable case: ${String(x)}`);
}
