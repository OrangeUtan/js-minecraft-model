import test from 'ava'
import * as vector from '../../src/vector'

test('valid', t => {
    t.true(vector.isVec3([1, 2, 3]))
});

test('invalid type', (t) => {
    for (const vec of [{}, '[1, 2, 3]']) {
        t.false(vector.isVec3(vec))
    }
})

test('invalid element count', (t) => {
    for (const vec of [[], [1], [1, 2], [1, 2, 3, 4]]) {
        t.false(vector.isVec3(vec))
    }
})

test('invalid element types', (t) => {
    for (const vec of [
        [1, 1, '1'],
        [1, false, 1],
    ]) {
        t.false(vector.isVec3(vec))
    }
})