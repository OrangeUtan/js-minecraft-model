import test from 'ava'
import { MinecraftModelJson, resolveModelHierarchy } from '../../src/model'

test('valid', (t) => {
    const models = {
        a: {
            parent: "b"
        },
        b: {
            parent: "c"
        },
        c: {},
    } as {[key: string]: MinecraftModelJson};

    t.deepEqual(
        resolveModelHierarchy(models["a"]!, models),
        [models["a"], models["b"], models["c"]]
    )
})

test('no ancestors', (t) => {
    t.deepEqual(
        resolveModelHierarchy({parent: "a"}, {}),
        [{parent: "a"}]
    )
})

test('parent missing', t => {
    const models = {
        a: {
            parent: "b"
        },
        b: {
            parent: "f"
        },
        c: {},
    } as {[key: string]: MinecraftModelJson};

    t.deepEqual(
        resolveModelHierarchy(models["a"]!, models),
        [models["a"], models["b"]]
    )
})

test('parent undefined', t => {
    const models = {
        a: {
            parent: "b"
        },
        b: {
            parent: undefined
        },
        c: {},
    } as {[key: string]: MinecraftModelJson};

    t.deepEqual(
        resolveModelHierarchy(models["a"]!, models),
        [models["a"], models["b"]]
    )
})