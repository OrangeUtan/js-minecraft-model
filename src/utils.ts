export function isObject(o: unknown): o is Record<string, unknown> {
    return typeof o === 'object' && Array.isArray(o) === false && o !== null
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(min, Math.min(num, max))
}
