import test from 'ava'
import { MinecraftModelJson, resolveModel } from '../../src/model'
import { ElementJson } from '../../src/element'

test('child inherits elements from ancestor', t => {
    const models = {
        child: {
            parent: "parent"
        } as MinecraftModelJson,
        parent: {
            parent: "ancestor",
        } as MinecraftModelJson,
        ancestor: {
            elements: [{from: [1,1,1], to: [2,2,2], faces: {}}]
        } as MinecraftModelJson
    } as {[key: string]: MinecraftModelJson};
    t.deepEqual(
        resolveModel(models["child"]!, models),
        {
            elements: [{from: [1,1,1], to: [2,2,2], faces: {}}] as ElementJson[],
            textures: {}
        }
    )
})

test('child overwrites elements of ancestor', t => {
    const models = {
        child: {
            parent: "parent",
            elements: [{from: [0,0,0], to: [1,1,1], faces: {}}]
        } as MinecraftModelJson,
        parent: {
            parent: "ancestor",
            elements: [{from: [1,1,1], to: [2,2,2], faces: {}}]
        } as MinecraftModelJson,
        ancestor: {
            elements: [{from: [2,2,2], to: [3,3,3], faces: {}}]
        } as MinecraftModelJson,
    } as {[key: string]: MinecraftModelJson};
    t.deepEqual(
        resolveModel(models["child"]!, models),
        {
            elements: [{from: [0,0,0], to: [1,1,1], faces: {}}] as ElementJson[],
            textures: {}
        }
    )
})

test('child merges textures from ancestors', t => {
    const models = {
        child: {
            parent: "parent",
            textures: {"tchild": "path-child"}
        } as MinecraftModelJson,
        parent: {
            parent: "ancestor",
            textures: {"tparent": "path-parent"}
        } as MinecraftModelJson,
        ancestor: {
            textures: {"tancestor": "path-ancestor"}
        } as MinecraftModelJson
    } as {[key: string]: MinecraftModelJson};
    t.deepEqual(
        resolveModel(models["child"]!, models),
        {
            elements: [],
            textures: {
                "tchild": "path-child",
                "tparent": "path-parent",
                "tancestor": "path-ancestor"
            }
        }
    )
})

test('child overwrites textures from ancestors', t => {
    const models = {
        child: {
            parent: "parent",
            textures: {"tancestor": "path-child"}
        } as MinecraftModelJson,
        parent: {
            parent: "ancestor",
            textures: {"tparent": "path-parent"}
        } as MinecraftModelJson,
        ancestor: {
            textures: {"tancestor": "path-ancestor"}
        } as MinecraftModelJson
    } as {[key: string]: MinecraftModelJson};
    t.deepEqual(
        resolveModel(models["child"]!, models),
        {
            elements: [],
            textures: {
                "tparent": "path-parent",
                "tancestor": "path-child"
            }
        }
    )
})