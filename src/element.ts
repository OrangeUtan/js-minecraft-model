import { ModelValidationError } from './error'
import { Face, FaceJson, FaceType } from './face'
import { isObject } from './utils'
import { validateVec3, Vec3 } from './vector'

export type ElementRotationAngle = -45 | -22.5 | 0 | 22.5 | 45

export enum RotationAxis {
    X = 'x',
    Y = 'y',
    Z = 'z',
}

export interface ElementRotationJson {
    origin: Vec3
    angle: number
    axis: RotationAxis
    rescale?: boolean
}

export function validateElementRotationJson(
    json: unknown,
): json is ElementRotationJson | never {
    if (!isObject(json)) {
        throw new ModelValidationError(
            'Invalid element rotation: ' + JSON.stringify(json),
        )
    }

    for (const prop of ['origin', 'angle', 'axis']) {
        if (!(prop in json)) {
            throw new ModelValidationError(
                `Element rotation is missing property "${prop}"`,
            )
        }
    }

    validateVec3(json.origin)

    if (![-45, -22.5, 0, 22.5, 45].includes(json.angle as number)) {
        throw new ModelValidationError(
            'Invalid element rotation angle: ' + JSON.stringify(json.angle),
        )
    }

    if (!Object.values(RotationAxis).includes(json.axis as RotationAxis)) {
        throw new ModelValidationError(
            'Invalid element rotation axis: ' + JSON.stringify(json.axis),
        )
    }

    if (json.rescale != null && typeof json.rescale !== 'boolean') {
        throw new ModelValidationError(
            'Invalid element rotation property "rescale": ' +
                JSON.stringify(json.rescale),
        )
    }

    return true
}

export class ElementRotation {
    constructor(
        public origin: Vec3,
        public angle: number,
        public axis: RotationAxis,
        public rescale: boolean,
    ) {}

    static fromJson(json: ElementRotationJson) {
        return new ElementRotation(
            json.origin,
            json.angle,
            json.axis,
            json.rescale ?? false,
        )
    }
}

export interface ElementJson {
    from: Vec3
    to: Vec3
    faces: { [name in FaceType]: FaceJson }
    rotation?: ElementRotation
    shade?: boolean
}

export function validateElementJson(
    json: unknown,
): json is ElementJson | never {
    if (!isObject(json)) {
        throw new ModelValidationError(
            'Invalid element: ' + JSON.stringify(json),
        )
    }

    for (const prop of ['from', 'to']) {
        if (!(prop in json)) {
            throw new ModelValidationError(
                `Element is missing property "${prop}"`,
            )
        }
    }

    validateVec3(json.from)
    validateVec3(json.to)

    if (json.faces == null) {
        throw new ModelValidationError('Element is missing property "faces"')
    } else {
        const faceNames = Object.values(FaceType) as string[]
        for (const face of Object.keys(json.faces as string[])) {
            if (!faceNames.includes(face)) {
                throw new ModelValidationError(
                    'Invalid element face name: ' + JSON.stringify(face),
                )
            }
        }
    }

    if (json.rotation != null) {
        validateElementRotationJson(json.rotation)
    }

    if (json.shade != null && typeof json.shade !== 'boolean') {
        throw new ModelValidationError(
            'Invalid element shade: ' + JSON.stringify(json.shade),
        )
    }

    return true
}

export class Element {
    constructor(
        public from: Vec3,
        public to: Vec3,
        public shade: boolean,
        public faces: { [name in FaceType]?: Face },
        public rotation?: ElementRotation,
    ) {}

    static fromJson(json: ElementJson) {
        const faces: { [name in FaceType]?: Face } = {}
        for (const face of Object.keys(json.faces) as FaceType[]) {
            faces[face] = Face.fromJson(json.faces[face])
        }

        return new Element(
            json.from,
            json.to,
            json.shade ?? true,
            faces,
            json.rotation ? ElementRotation.fromJson(json.rotation) : undefined,
        )
    }
}
