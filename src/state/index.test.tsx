import { assembleTick, State } from '.'

describe('assemble tick', () => {
  test('increase potential', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 4,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 5,
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
  test('cap potential', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 20,
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
  test('consume potential and ingredients to create product', () => {
    const actual = assembleTick({
      machines: [
        {
          inStacks: [
            { count: 2, name: 'gear' },
            { count: 1, name: 'rod' },
          ],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 19,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [],
          outStacks: [{ count: 1, name: 'widget' }],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    }

    expect(actual).toStrictEqual(expected)
  })
})
