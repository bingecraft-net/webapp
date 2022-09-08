import { assembleTick, State, transferTick } from '.'

describe('transfer tick', () => {
  test('tick no machines', () => {
    const actual = transferTick({ machines: [] })
    const expected: State = { machines: [] }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer one rod from crate to empty assembler', () => {
    const actual = transferTick({
      machines: [
        {
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        { position: { x: 0, y: 0 }, stacks: [], type: 'crate' },
        {
          inStacks: [{ count: 1, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer one per tick', () => {
    const actual = transferTick({
      machines: [
        {
          position: { x: 0, y: 0 },
          stacks: [{ count: 2, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [{ count: 1, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('preserve assembler stacks', () => {
    const actual = transferTick({
      machines: [
        {
          inStacks: [{ count: 1, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [{ count: 1, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer two per two ticks', () => {
    const actual = transferTick(
      transferTick({
        machines: [
          {
            position: { x: 0, y: 0 },
            stacks: [{ count: 2, name: 'rod' }],
            type: 'crate',
          },
          {
            inStacks: [],
            outStacks: [],
            position: { x: 0, y: 0 },
            potential: 0,
            type: 'assembler',
          },
        ],
      }),
    )
    const expected: State = {
      machines: [
        {
          position: { x: 0, y: 0 },
          stacks: [],
          type: 'crate',
        },
        {
          inStacks: [{ count: 2, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
})

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
