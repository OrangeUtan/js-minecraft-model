import test from 'ava'
import { ModelValidationError } from '../../src/error'
import { Face } from '../../src/face'

test('valid', (t) => {
    t.true(
        Face.fromJson({
            texture: '#abc',
            uv: [1, 2, 3, 4],
            cullface: 'down',
            rotation: 90,
            tintindex: 12,
        }) instanceof Face,
    )
})

test('invalid type', (t) => {
    for (const it of [20, []] as unknown[]) {
        t.throws(() => Face.fromJson(it), {
            instanceOf: ModelValidationError,
            message: 'Invalid face: ' + JSON.stringify(it),
        })
    }
})

test('invalid "texture"', (t) => {
    for (const texture of ['#', '', 'ab', 'abc'] as unknown[]) {
        t.throws(
            () =>
                Face.fromJson({
                    texture: texture,
                }),
            {
                instanceOf: ModelValidationError,
                message: 'Invalid face texture: ' + JSON.stringify(texture),
            },
        )
    }
})

test('invalid "uv"', (t) => {
    t.throws(
        () =>
            Face.fromJson({
                texture: '#stone',
                uv: [1, 2, 3],
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec4: ' + JSON.stringify([1, 2, 3]),
        },
    )
})

test('invalid "cullface"', (t) => {
    t.throws(
        () =>
            Face.fromJson({
                texture: '#stone',
                cullface: 'nyet',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Face has invalid cullface: ' + JSON.stringify('nyet'),
        },
    )
})

test('invalid "rotation"', (t) => {
    t.throws(
        () =>
            Face.fromJson({
                texture: '#stone',
                rotation: 91,
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid face rotation: ' + JSON.stringify(91),
        },
    )
})

test('invalid "tintindex"', (t) => {
    t.throws(
        () =>
            Face.fromJson({
                texture: '#stone',
                tintindex: 'abc',
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid face tintindex: ' + JSON.stringify('abc'),
        },
    )
})
