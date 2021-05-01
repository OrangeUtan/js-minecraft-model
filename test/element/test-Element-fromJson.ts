import test from 'ava'
import { Element, ElementJson, validateElementJson } from '../../src/element'

test('"name" defaults to "__comment"', (t) => {
    const json = {
        from: [0, 0, 0],
        to: [1, 1, 1],
        faces: {},
        __comment: 'A comment',
    } as ElementJson
    validateElementJson(json)
    const element = Element.fromJson(json)

    t.true(element.name === 'A comment')
})
