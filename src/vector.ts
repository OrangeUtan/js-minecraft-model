export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]

export function isVec3(vec: unknown): vec is Vec3 {
    return Array.isArray(vec)
        && vec.length === 3
        && vec.every(e => typeof e === 'number')
}

export function isVec4(vec: unknown): vec is Vec4 {
    return Array.isArray(vec)
    && vec.length === 4
    && vec.every(e => typeof e === 'number')
}