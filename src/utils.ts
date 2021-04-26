export function isObject(o: unknown): o is Record<string, unknown> {
    return typeof o === 'object' && Array.isArray(o) === false && o !== null
}
