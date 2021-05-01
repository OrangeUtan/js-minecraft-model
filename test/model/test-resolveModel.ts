import test from 'ava'
import { MinecraftModelJson, resolveModelJson } from '../../src/model'

test('child inherits elements from ancestor', (t) => {
    const models = {
        child: {
            parent: 'parent',
        },
        parent: {
            parent: 'ancestor',
        },
        ancestor: {
            elements: [{ from: [1, 1, 1], to: [2, 2, 2], faces: {} }],
        } as MinecraftModelJson,
    } as { [key: string]: MinecraftModelJson }

    const resolvedModel = resolveModelJson(models['child']!, models)
    t.deepEqual(resolvedModel.elements, [
        { from: [1, 1, 1], to: [2, 2, 2], faces: {} },
    ] as any[])
})

test('child overwrites elements of ancestor', (t) => {
    const models = {
        child: {
            parent: 'parent',
            elements: [{ from: [0, 0, 0], to: [1, 1, 1], faces: {} }],
        } as MinecraftModelJson,
        parent: {
            parent: 'ancestor',
            elements: [{ from: [1, 1, 1], to: [2, 2, 2], faces: {} }],
        } as MinecraftModelJson,
        ancestor: {
            elements: [{ from: [2, 2, 2], to: [3, 3, 3], faces: {} }],
        } as MinecraftModelJson,
    } as { [key: string]: MinecraftModelJson }

    const resolvedModel = resolveModelJson(models['child']!, models)
    t.deepEqual(resolvedModel.elements, [
        { from: [0, 0, 0], to: [1, 1, 1], faces: {} },
    ] as any[])
})

test('child merges textures from ancestors', (t) => {
    const models = {
        child: {
            parent: 'parent',
            textures: { tchild: 'path-child' },
        } as MinecraftModelJson,
        parent: {
            parent: 'ancestor',
            textures: { tparent: 'path-parent' },
        } as MinecraftModelJson,
        ancestor: {
            textures: { tancestor: 'path-ancestor' },
        } as MinecraftModelJson,
    } as { [key: string]: MinecraftModelJson }

    const resolvedModel = resolveModelJson(models['child']!, models)
    t.deepEqual(resolvedModel.textures, {
        tchild: 'path-child',
        tparent: 'path-parent',
        tancestor: 'path-ancestor',
    })
})

test('child overwrites textures from ancestors', (t) => {
    const models = {
        child: {
            parent: 'parent',
            textures: { tancestor: 'path-child' },
        } as MinecraftModelJson,
        parent: {
            parent: 'ancestor',
            textures: { tparent: 'path-parent' },
        } as MinecraftModelJson,
        ancestor: {
            textures: { tancestor: 'path-ancestor' },
        } as MinecraftModelJson,
    } as { [key: string]: MinecraftModelJson }

    const resolvedModel = resolveModelJson(models['child']!, models)
    t.deepEqual(resolvedModel.textures, {
        tparent: 'path-parent',
        tancestor: 'path-child',
    })
})
