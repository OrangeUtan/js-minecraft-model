import test from 'ava'
import { validateElementJson } from '../../src/element'
import { ModelValidationError } from '../../src/error'

test('valid', (t) => {
    t.true(
        validateElementJson({
            from: [1, 1, 1],
            to: [2, 2, 2],
            faces: {},
            rotation: {
                origin: [1, 2, 3],
                angle: 22.5,
                axis: 'x',
            },
            shade: true,
        }),
    )
})

test('invalid type', (t) => {
    for (const it of [20, []] as unknown[]) {
        t.throws(() => validateElementJson(it), {
            instanceOf: ModelValidationError,
            message: 'Invalid element: ' + JSON.stringify(it),
        })
    }
})

test('"from" is missing', (t) => {
    t.throws(
        () =>
            validateElementJson({
                to: [1, 1, 1],
                faces: {},
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element is missing property "from"',
        },
    )
})

test('"from" is invalid', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1, 1, 1],
                to: [2, 2, 2],
                faces: {},
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec3: [1,1,1,1,1]',
        },
    )
})

test('"to" is missing', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1],
                faces: {},
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element is missing property "to"',
        },
    )
})

test('"to" is invalid', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1],
                to: [2],
                faces: {},
            }),
        { instanceOf: ModelValidationError, message: 'Invalid Vec3: [2]' },
    )
})

test('"faces" is missing', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1],
                to: [2, 2, 2],
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element is missing property "faces"',
        },
    )
})

test('"faces" has too many faces', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1],
                to: [2, 2, 2],
                faces: {
                    west: {},
                    east: {},
                    down: {},
                    around: {},
                },
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid element face name: "around"',
        },
    )
})

test('"shade" is invalid', (t) => {
    t.throws(
        () =>
            validateElementJson({
                from: [1, 1, 1],
                to: [2, 2, 2],
                faces: {},
                shade: 2,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid element shade: 2',
        },
    )
})
