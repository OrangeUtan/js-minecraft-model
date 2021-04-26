import { ModelValidationError } from './error'

export type Vec3 = [number, number, number]
export type Vec4 = [number, number, number, number]

export function isVec3(vec: unknown): vec is Vec3 {
    return (
        Array.isArray(vec) &&
        vec.length === 3 &&
        vec.every((e) => typeof e === 'number')
    )
}

export function validateVec3(vec: unknown): vec is Vec3 {
    if (!isVec3(vec)) {
        throw new ModelValidationError(`Invalid Vec3: ${JSON.stringify(vec)}`)
    }
    return true
}

export function isVec4(vec: unknown): vec is Vec4 {
    return (
        Array.isArray(vec) &&
        vec.length === 4 &&
        vec.every((e) => typeof e === 'number')
    )
}

export function validateVec4(vec: unknown): vec is Vec4 {
    if (!isVec4(vec)) {
        throw new ModelValidationError(`Invalid Vec4: ${JSON.stringify(vec)}`)
    }
    return true
}
