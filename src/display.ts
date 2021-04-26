import { ModelValidationError } from './error'
import { clamp, isObject } from './utils'
import { validateVec3, Vec3 } from './vector'

export enum DisplayPosition {
    GUI = 'gui',
    HEAD = 'head',
    GROUND = 'ground',
    FIXED = 'fixed',
    THIRDPERSON_RIGHTHAND = 'thirdperson_righthand',
    THIRDPERSON_LEFTHAND = 'thirdperson_lefthand',
    FIRSTPERSON_RIGHTHAND = 'firstperson_righthand',
    FIRSTPERSON_LEFTHAND = 'firstperson_lefthand',
}

export interface DisplayJson {
    rotation?: Vec3
    translation?: Vec3
    scale?: Vec3
}

export function validateDisplayJson(json: unknown): json is DisplayJson {
    if (!isObject(json)) {
        throw new ModelValidationError(
            'Invalid element display: ' + JSON.stringify(json),
        )
    }

    if (json.rotation != null) {
        validateVec3(json.rotation)
    }
    if (json.translation != null) {
        validateVec3(json.translation)
    }
    if (json.scale != null) {
        validateVec3(json.scale)
    }

    return true
}

export class Display {
    constructor(
        public rotation: Vec3,
        public translation: Vec3,
        public scale: Vec3,
    ) {
        this.translation = translation.map((n) => clamp(n, -80, 80)) as Vec3
        this.scale = scale.map((n) => clamp(n, 0, 4)) as Vec3
    }

    static fromJson(json: DisplayJson): Display {
        return new Display(
            json.rotation ?? [0, 0, 0],
            json.translation ?? [0, 0, 0],
            json.scale ?? [1, 1, 1],
        )
    }
}
