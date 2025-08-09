import YAML from "yaml"

/**
 * YAMLファイルをパースして返す。
 * @param raw - ?rawで読み込んだYAML文字列
 * @returns フラット化したオブジェクト（"app.title" 形式のキーでもアクセス可能）
 */
export function loadYaml<T extends object>(raw: string): T & Record<string, any> {
    const parsed = YAML.parse(raw) as T

    // "app.title" の形で直接アクセスできるようにフラット化
    const flat: Record<string, any> = {}
    function flatten(obj: any, prefix = "") {
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key
            if (value && typeof value === "object" && !Array.isArray(value)) {
                flatten(value, fullKey)
            } else {
                flat[fullKey] = value
            }
        }
    }
    flatten(parsed)

    return Object.assign(parsed, flat)
}
