import test from 'ava'
import { validateMinecraftModelJson } from '../../src/model'
import { ModelValidationError } from '../../src/error'

test('valid', (t) => {
    t.true(
        validateMinecraftModelJson({
            textures: {
                'block/stone': 'somePath',
            },
            elements: [
                {
                    from: [1, 1, 1],
                    to: [2, 2, 2],
                    faces: {},
                },
            ],
            display: {
                gui: {
                    rotation: [1, 2, 3],
                },
            },
        }),
    )
})

test('invalid type', (t) => {
    for (const it of [20, []] as unknown[]) {
        t.throws(() => validateMinecraftModelJson(it), {
            instanceOf: ModelValidationError,
            message: 'Invalid model: ' + JSON.stringify(it),
        })
    }
})

test('"textures" is missing', (t) => {
    t.notThrows(() =>
        validateMinecraftModelJson({
            elements: [],
        }),
    )
})

test('"textures" has invalid type', (t) => {
    for (const textures of [20, [], { a: 999 }]) {
        t.throws(
            () =>
                validateMinecraftModelJson({
                    textures,
                    elements: [],
                }),
            {
                instanceOf: ModelValidationError,
                message:
                    'Invalid property "textures": ' + JSON.stringify(textures),
            },
        )
    }
})

test('"parent" has invalid type', (t) => {
    t.throws(
        () =>
            validateMinecraftModelJson({
                textures: {
                    'block/stone': 'somePath',
                },
                elements: [],
                parent: 20,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid property "parent": 20',
        },
    )
})

test('"elements" has invalid type', (t) => {
    t.throws(
        () =>
            validateMinecraftModelJson({
                textures: {
                    'block/stone': 'somePath',
                },
                elements: true,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid property "elements": true',
        },
    )
})

test('"ambientocclusion" has invalid type', (t) => {
    t.throws(
        () =>
            validateMinecraftModelJson({
                textures: {
                    'block/stone': 'somePath',
                },
                elements: [],
                ambientocclusion: 'a string',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid property "ambientocclusion": "a string"',
        },
    )
})

test('"display" has invalid type', (t) => {
    for (const display of [20, []]) {
        t.throws(
            () =>
                validateMinecraftModelJson({
                    textures: {
                        'block/stone': 'somePath',
                    },
                    elements: [],
                    display,
                }),
            {
                instanceOf: ModelValidationError,
                message:
                    'Invalid property "display": ' + JSON.stringify(display),
            },
        )
    }
})

test('"display" has unknown display type', (t) => {
    t.throws(
        () =>
            validateMinecraftModelJson({
                textures: {
                    'block/stone': 'somePath',
                },
                elements: [],
                display: {
                    gui: {},
                    head: {},
                    down_under: {},
                },
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Unknown display type: "down_under"',
        },
    )
})

test('"groups" has invalid type', (t) => {
    for (const groups of [false, '', { a: 999 }]) {
        t.throws(
            () =>
                validateMinecraftModelJson({
                    elements: [],
                    groups,
                }),
            {
                instanceOf: ModelValidationError,
                message: 'Invalid property "groups": ' + JSON.stringify(groups),
            },
        )
    }
})
