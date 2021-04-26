import test from 'ava'
import { ModelValidationError } from '../../src/error'
import { validateDisplayJson } from '../../src/display'

test('valid', (t) => {
    t.true(
        validateDisplayJson({
            rotation: [1, 2, 3],
            translation: [4, 5, 6],
            scale: [7, 8, 9],
        }),
    )
})

test('invalid type', (t) => {
    for (const it of [20, []] as unknown[]) {
        t.throws(() => validateDisplayJson(it), {
            instanceOf: ModelValidationError,
            message: 'Invalid element display: ' + JSON.stringify(it),
        })
    }
})

test('"rotation" is invalid', (t) => {
    t.throws(
        () =>
            validateDisplayJson({
                rotation: [1, 2],
            }),
        { instanceOf: ModelValidationError, message: 'Invalid Vec3: [1,2]' },
    )
})

test('"translation" is invalid', (t) => {
    t.throws(
        () =>
            validateDisplayJson({
                translation: [1, 2],
            }),
        { instanceOf: ModelValidationError, message: 'Invalid Vec3: [1,2]' },
    )
})

test('"scale" is invalid', (t) => {
    t.throws(
        () =>
            validateDisplayJson({
                scale: [1, 2],
            }),
        { instanceOf: ModelValidationError, message: 'Invalid Vec3: [1,2]' },
    )
})
