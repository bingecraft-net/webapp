import { State } from '.'
import assembleTick from './assembleTick'

describe('assemble tick', () => {
  test('increase potential', () => {
    const actual0 = assembleTick({
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 18,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })

    const expected0: State = {
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 19,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }

    expect(actual0).toStrictEqual(expected0)

    const actual1 = assembleTick({
      machines: [
        {
          inStacks: [{ count: 8, name: 'plate' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 38,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    })

    const expected1: State = {
      machines: [
        {
          inStacks: [{ count: 8, name: 'plate' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 39,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    }

    expect(actual1).toStrictEqual(expected1)
  })
  test('cap potential', () => {
    const actual0 = assembleTick({
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected0: State = {
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }

    expect(actual0).toStrictEqual(expected0)

    const actual1 = assembleTick({
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 40,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    })
    const expected1: State = {
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 40,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    }

    expect(actual1).toStrictEqual(expected1)
  })
  test('consume potential and ingredients to create widget', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          key: 'assembler0',
          outStacks: [{ count: 1, name: 'widget' }],
          position: { x: 0, y: 0 },
          potential: 19,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [{ count: 2, name: 'widget' }],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
  test('consume potential and ingredients to create machine hull', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [{ count: 8, name: 'plate' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 39,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [{ count: 1, name: 'machine hull' }],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
  test('block creating other recipes', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [{ count: 8, name: 'plate' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [{ count: 8, name: 'plate' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
})
