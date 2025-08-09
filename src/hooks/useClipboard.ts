import { useState } from "react"

export function useClipboard(timeout = 1000) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    const copy = async (text: string, key?: string) => {
        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                await navigator.clipboard.writeText(text ?? "")
            } else {
                const ta = document.createElement("textarea")
                ta.value = text ?? ""
                ta.style.position = "fixed"
                ta.style.opacity = "0"
                document.body.appendChild(ta)
                ta.select()
                document.execCommand("copy")
                document.body.removeChild(ta)
            }
            if (key) {
                setCopiedKey(key)
                setTimeout(() => setCopiedKey(null), timeout)
            }
        } catch (e) {
            console.error("コピー失敗:", e)
        }
    }

    return { copy, copiedKey }
}
