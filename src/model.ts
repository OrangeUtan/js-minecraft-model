// Types for minecraft json models (see https://minecraft.fandom.com/wiki/Model)

import { Display, DisplayJson, DisplayPosition } from './display'
import { Element, ElementJson } from './element'
import { ModelValidationError } from './error'
import { isObject } from './utils'

export interface MinecraftModelJson {
    parent?: string
    textures?: { [textureVar: string]: string }
    elements?: ElementJson[]
    display?: { [name in DisplayPosition]?: DisplayJson }
    ambientocclusion?: boolean
}

export function validateMinecraftModelJson(
    json: unknown,
): json is MinecraftModelJson | never {
    if (!isObject(json)) {
        throw new ModelValidationError('Invalid model: ' + JSON.stringify(json))
    }

    if (json.parent != null && typeof json.parent !== 'string') {
        throw new ModelValidationError(
            'Invalid property "parent": ' + JSON.stringify(json.parent),
        )
    }

    if (json.textures != null) {
        if (
            !isObject(json.textures) ||
            !Object.entries(json.textures).every(
                ([name, texture]) =>
                    typeof name === 'string' && typeof texture === 'string',
            )
        ) {
            throw new ModelValidationError(
                'Invalid property "textures": ' + JSON.stringify(json.textures),
            )
        }
    }

    if (json.elements != null) {
        if (!Array.isArray(json.elements)) {
            throw new ModelValidationError(
                'Invalid property "elements": ' + JSON.stringify(json.elements),
            )
        }
    }

    if (json.display != null) {
        if (!isObject(json.display)) {
            throw new ModelValidationError(
                'Invalid property "display": ' + JSON.stringify(json.display),
            )
        }

        const positions = Object.values(DisplayPosition) as string[]
        for (const position of Object.keys(json.display)) {
            if (!positions.includes(position)) {
                throw new ModelValidationError(
                    'Unknown display type: ' + JSON.stringify(position),
                )
            }
        }
    }

    if (
        json.ambientocclusion != null &&
        typeof json.ambientocclusion !== 'boolean'
    ) {
        throw new ModelValidationError(
            'Invalid property "ambientocclusion": ' +
                JSON.stringify(json.ambientocclusion),
        )
    }

    return true
}

export class MinecraftModel {
    constructor(
        public ambientocclusion: boolean,
        public parent?: string,
        public textures?: { [textureVar: string]: string },
        public elements?: Element[],
        public display?: { [name in DisplayPosition]?: Display },
    ) {}

    static fromJson(json: MinecraftModelJson) {
        let displayPositions:
            | { [name in DisplayPosition]?: Display }
            | undefined = undefined
        if (json.display != null) {
            displayPositions = {}
            for (const [position, displayJson] of Object.entries(
                json.display,
            ) as [DisplayPosition, DisplayJson | undefined][]) {
                displayPositions[position] =
                    displayJson != null
                        ? Display.fromJson(displayJson)
                        : displayJson
            }
        }

        return new MinecraftModel(
            json.ambientocclusion ?? true,
            json.parent,
            json.textures,
            json.elements?.map((e) => Element.fromJson(e)),
            displayPositions,
        )
    }

    hasElements() {
        return this.elements != null && this.elements.length >= 1
    }
}
