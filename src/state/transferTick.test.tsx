import { State } from '.'
import transferTick from './transferTick'

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
