import { ModelValidationError } from './error'
import { isObject } from './utils'
import { validateVec4, Vec4 } from './vector'

export enum FaceType {
    WEST = 'west',
    EAST = 'east',
    DOWN = 'down',
    UP = 'up',
    NORTH = 'north',
    SOUTH = 'south',
}

export type TextureRotationAngle = 0 | 90 | 180 | 270

export interface FaceJson {
    texture: string
    uv?: Vec4
    cullface?: FaceType
    rotation?: TextureRotationAngle
    tintindex?: number
}

export function validateFaceJson(json: unknown): json is FaceJson | never {
    if (!isObject(json)) {
        throw new ModelValidationError('Invalid face: ' + JSON.stringify(json))
    }

    if (
        !(
            json.texture != null &&
            typeof json.texture === 'string' &&
            json.texture.length >= 2 &&
            json.texture.startsWith('#')
        )
    ) {
        throw new ModelValidationError(
            'Invalid face texture: ' + JSON.stringify(json.texture),
        )
    }

    if (json.uv != null) {
        validateVec4(json.uv)
    }

    if (
        json.cullface != null &&
        !Object.values(FaceType).includes(json.cullface as FaceType)
    ) {
        throw new ModelValidationError(
            'Face has invalid cullface: ' + JSON.stringify(json.cullface),
        )
    }

    if (
        json.rotation != null &&
        ![0, 90, 180, 270].includes(json.rotation as number)
    ) {
        throw new ModelValidationError(
            'Invalid face rotation: ' + JSON.stringify(json.rotation),
        )
    }

    if (json.tintindex != null && typeof json.tintindex !== 'number') {
        throw new ModelValidationError(
            'Invalid face tintindex: ' + JSON.stringify(json.tintindex),
        )
    }

    return true
}

export class Face {
    constructor(
        public texture: string,
        public rotation: TextureRotationAngle,
        public uv?: Vec4,
        public cullface?: FaceType,
        public tintindex?: number,
    ) {}

    static fromJson(json: FaceJson): Face {
        return new Face(
            json.texture,
            json.rotation ?? 0,
            json.uv,
            json.cullface,
            json.tintindex,
        )
    }
}
