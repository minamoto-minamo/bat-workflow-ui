
const pickSeq = (id: string) => {
    const m = /(\d+)$/.exec(id);
    return m ? parseInt(m[1], 10) : 0;
};

export const nextSeqFrom = (nodes: Array<{ id: string }>) =>
    nodes.reduce((max, n) => Math.max(max, pickSeq(n.id)), 0) + 1;