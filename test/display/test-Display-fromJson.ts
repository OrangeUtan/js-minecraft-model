import test from 'ava'
import { Display } from '../../src/display'

test('valid', (t) => {
    t.true(
        Display.fromJson({
            rotation: [1, 2, 3],
            translation: [4, 5, 6],
            scale: [7, 8, 9],
        }) instanceof Display,
    )
})

test('default values', (t) => {
    t.deepEqual(
        Display.fromJson({}),
        new Display([0, 0, 0], [0, 0, 0], [1, 1, 1]),
    )
})

test('clamp translation', (t) => {
    t.deepEqual(Display.fromJson({ translation: [-90, 100, 10] }).translation, [
        -80,
        80,
        10,
    ])
})

test('clamp scale', (t) => {
    t.deepEqual(Display.fromJson({ scale: [-20, 200, 1] }).scale, [0, 4, 1])
})
