import { State, tick } from './State'

test('tick no machines', () => {
  const actual = tick({ machines: [] })
  const expected: State = { machines: [] }
  expect(actual).toStrictEqual(expected)
})

test('transfer one rod from crate to empty assembler', () => {
  const actual = tick({
    machines: [
      { stacks: [{ count: 1, name: 'rod' }], type: 'crate' },
      { inStacks: [], outStacks: [], type: 'assembler' },
    ],
  })
  const expected: State = {
    machines: [
      { stacks: [], type: 'crate' },
      {
        inStacks: [{ count: 1, name: 'rod' }],
        outStacks: [],
        type: 'assembler',
      },
    ],
  }
  expect(actual).toStrictEqual(expected)
})

test('transfer one per tick', () => {
  const actual = tick({
    machines: [
      { stacks: [{ count: 2, name: 'rod' }], type: 'crate' },
      { inStacks: [], outStacks: [], type: 'assembler' },
    ],
  })
  const expected: State = {
    machines: [
      {
        stacks: [{ count: 1, name: 'rod' }],
        type: 'crate',
      },
      {
        inStacks: [{ count: 1, name: 'rod' }],
        outStacks: [],
        type: 'assembler',
      },
    ],
  }
  expect(actual).toStrictEqual(expected)
})

test('preserve assembler stacks', () => {
  const actual = tick({
    machines: [
      {
        inStacks: [{ count: 1, name: 'rod' }],
        outStacks: [],
        type: 'assembler',
      },
    ],
  })
  const expected: State = {
    machines: [
      {
        inStacks: [{ count: 1, name: 'rod' }],
        outStacks: [],
        type: 'assembler',
      },
    ],
  }
  expect(actual).toStrictEqual(expected)
})

test('transfer two per two ticks', () => {
  const actual = tick(
    tick({
      machines: [
        { stacks: [{ count: 2, name: 'rod' }], type: 'crate' },
        { inStacks: [], outStacks: [], type: 'assembler' },
      ],
    }),
  )
  const expected: State = {
    machines: [
      {
        stacks: [],
        type: 'crate',
      },
      {
        inStacks: [{ count: 2, name: 'rod' }],
        outStacks: [],
        type: 'assembler',
      },
    ],
  }
  expect(actual).toStrictEqual(expected)
})
