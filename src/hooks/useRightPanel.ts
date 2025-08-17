import { useCallback } from 'react'

export function useRightPanel(setRightPanel: (n: React.ReactNode) => void) {
    const open = useCallback((node: React.ReactNode) => setRightPanel(node), [setRightPanel])
    const close = useCallback(() => setRightPanel(null), [setRightPanel])
    return { open, close }
}
