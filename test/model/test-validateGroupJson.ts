import test from 'ava'
import { ModelValidationError } from '../../src/error'
import { validateGroupJson } from '../../src/model'

test('valid', (t) => {
    t.true(
        validateGroupJson({
            name: 'A name',
            origin: [1, 2, 3],
            children: [
                1,
                2,
                3,
                {
                    name: 'Child',
                    origin: [1, 2, 3],
                    children: [4, 5, 6],
                },
            ],
        }),
    )
})

test('"name" is invalid', (t) => {
    t.throws(
        () =>
            validateGroupJson({
                name: false,
                origin: [1, 2, 3],
                children: [],
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid group name: false',
        },
    )
})

test('"origin" is invalid', (t) => {
    t.throws(
        () =>
            validateGroupJson({
                name: 'A name',
                origin: [1, 2, 3, 4],
                children: [],
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid Vec3: [1,2,3,4]',
        },
    )
})

test('"children" is invalid', (t) => {
    t.throws(
        () =>
            validateGroupJson({
                name: 'A name',
                origin: [1, 2, 3],
                children: {},
            }),
        {
            instanceOf: ModelValidationError,
            message: 'Invalid group children: {}',
        },
    )
})

test('invalid child', (t) => {
    for (const children of [
        [1, 2, false],
        [1, 2, { name: false, origin: [1, 2, 3], children: [] }],
    ]) {
        t.throws(
            () =>
                validateGroupJson({
                    name: 'A name',
                    origin: [1, 2, 3],
                    children,
                }),
            {
                instanceOf: ModelValidationError,
                message: /Invalid group.*/,
            },
        )
    }
})
