import test from 'ava'
import * as vector from '../../src/vector'

test('valid', t => {
    t.true(vector.isVec4([1, 2, 3, 4]))
});

test('invalid type', (t) => {
    for (const vec of [{}, '[1, 2, 3, 4]']) {
        t.false(vector.isVec4(vec))
    }
})

test('invalid element count', (t) => {
    for (const vec of [[], [1], [1, 2], [1, 2, 3], [1, 2, 3, 4, 5]]) {
        t.false(vector.isVec4(vec))
    }
})

test('invalid element types', (t) => {
    for (const vec of [
        [1, 1, '1', 1],
        [1, false, 1, 1],
    ]) {
        t.false(vector.isVec4(vec))
    }
})