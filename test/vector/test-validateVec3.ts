import test from 'ava'
import { ModelValidationError } from '../../src/error'
import * as vector from '../../src/vector'

test('valid', (t) => {
    t.true(vector.validateVec3([1, 2, 3]))
})

test('invalid type', (t) => {
    for (const vec of [{}, '[1, 2, 3]']) {
        t.throws(() => vector.validateVec3(vec), {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec3: ' + JSON.stringify(vec),
        })
    }
})

test('invalid element count', (t) => {
    for (const vec of [[], [1], [1, 2], [1, 2, 3, 4]]) {
        t.throws(() => vector.validateVec3(vec), {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec3: ' + JSON.stringify(vec),
        })
    }
})

test('invalid elements types', (t) => {
    for (const vec of [
        [1, 1, '1'],
        [1, false, 1],
    ]) {
        t.throws(() => vector.validateVec3(vec), {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec3: ' + JSON.stringify(vec),
        })
    }
})
