import test from 'ava'
import { validateElementRotationJson } from '../../src/element'
import { ModelValidationError } from '../../src/error'

test('valid', (t) => {
    t.true(
        validateElementRotationJson({
            origin: [1, 1, 1],
            angle: 22.5,
            axis: 'x',
            rescale: false,
        }),
    )
})

test('invalid type', (t) => {
    for (const it of [20, []] as unknown[]) {
        t.throws(() => validateElementRotationJson(it), {
            instanceOf: ModelValidationError,
            message: 'Invalid element rotation: ' + JSON.stringify(it),
        })
    }
})

test('missing "origin"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                angle: 22.5,
                axis: 'x',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element rotation is missing property "origin"',
        },
    )
})

test('missing "axis"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1, 1],
                angle: 22.5,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element rotation is missing property "axis"',
        },
    )
})

test('missing "angle"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1, 1],
                axis: 'x',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Element rotation is missing property "angle"',
        },
    )
})

test('invalid "origin"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1],
                angle: 22.5,
                axis: 'y',
            }),
        { instanceOf: ModelValidationError, message: 'Invalid Vec3: [1,1]' },
    )
})

test('invalid "angle"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1, 1],
                angle: 10,
                axis: 'y',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid element rotation angle: 10',
        },
    )
})

test('invalid "axis"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1, 1],
                angle: 22.5,
                axis: 'a',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid element rotation axis: "a"',
        },
    )
})

test('invalid "rescale"', (t) => {
    t.throws(
        () =>
            validateElementRotationJson({
                origin: [1, 1, 1],
                angle: 22.5,
                axis: 'x',
                rescale: 3,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid element rotation property "rescale": 3',
        },
    )
})
