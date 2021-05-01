// Types for minecraft json models (see https://minecraft.fandom.com/wiki/Model)

import { Display, DisplayJson, DisplayPosition } from './display'
import { Element, ElementJson } from './element'
import { ModelValidationError } from './error'
import { isObject } from './utils'
import { validateVec3, Vec3 } from './vector'

export interface GroupJson {
    name: string
    origin: Vec3
    children: (number | GroupJson)[]
}

export function validateGroupJson(json: unknown): json is GroupJson | never {
    if (!isObject(json)) {
        throw new ModelValidationError('Invalid group: ' + JSON.stringify(json))
    }

    for (const prop of ['name', 'origin', 'children']) {
        if (!(prop in json)) {
            throw new ModelValidationError(
                `Group is missing property "${prop}"`,
            )
        }
    }

    if (typeof json.name !== 'string') {
        throw new ModelValidationError(
            'Invalid group name: ' + JSON.stringify(json.name),
        )
    }

    validateVec3(json.origin)

    if (!Array.isArray(json.children)) {
        throw new ModelValidationError(
            'Invalid group children: ' + JSON.stringify(json.children),
        )
    }

    json.children.forEach((c) => typeof c === 'number' || validateGroupJson(c))

    return true
}

export interface MinecraftModelJson {
    parent?: string
    textures?: { [textureVar: string]: string }
    elements?: ElementJson[]
    display?: { [name in DisplayPosition]?: DisplayJson }
    ambientocclusion?: boolean
    groups?: (number | GroupJson)[]
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

    if (json.groups != null) {
        if (!Array.isArray(json.groups)) {
            throw new ModelValidationError(
                'Invalid property "groups": ' + JSON.stringify(json.groups),
            )
        }

        json.groups.forEach(
            (c) => typeof c === 'number' || validateGroupJson(c),
        )
    }

    return true
}

export class MinecraftModel {
    public ambientocclusion: boolean

    constructor(
        public elements: Element[],
        public textures: { [textureVar: string]: string },
        public parent?: string,
        public display?: { [name in DisplayPosition]?: Display },
        public groups?: (number | GroupJson)[],
        ambientocclusion?: boolean,
    ) {
        this.ambientocclusion = ambientocclusion ?? true
    }

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
            json.elements?.map((e) => Element.fromJson(e)) ?? [],
            json.textures ?? {},
            json.parent,
            displayPositions,
            json.groups,
            json.ambientocclusion,
        )
    }

    hasElements() {
        return this.elements != null && this.elements.length >= 1
    }
}

export function resolveModelHierarchy(
    root: MinecraftModelJson,
    ancestors: { [assetPath: string]: MinecraftModelJson },
) {
    const hierarchy = [root]
    let current = ancestors[root.parent!]
    while (current != null) {
        hierarchy.push(current)
        current = ancestors[current.parent!]
    }

    return hierarchy
}

export function resolveModelJson(
    root: MinecraftModelJson,
    ancestors: { [assetPath: string]: MinecraftModelJson },
) {
    const hierarchy = resolveModelHierarchy(root, ancestors)

    // Properties to resolve
    let elements: ElementJson[] | undefined
    let ambientocclusion: boolean | undefined
    let display: { [name in DisplayPosition]?: DisplayJson } | undefined
    let groups: (number | GroupJson)[] | undefined
    const textures: { [textureVar: string]: string } = {}

    // Resolve top -> down
    for (const model of hierarchy) {
        if (
            elements == null &&
            model.elements != null &&
            model.elements.length >= 1
        ) {
            elements = model.elements ?? []
        }

        if (ambientocclusion == null && model.ambientocclusion != null) {
            ambientocclusion = model.ambientocclusion
        }

        if (display == null && model.display) {
            display = model.display
        }

        if (groups == null && model.groups) {
            groups = model.groups
        }
    }

    // Resolve bottom -> up
    for (const model of hierarchy.reverse()) {
        if (model.textures != null) {
            Object.assign(textures, model.textures)
        }
    }

    return {
        textures,
        elements,
        display,
        groups,
        ambientocclusion,
    } as MinecraftModelJson
}
