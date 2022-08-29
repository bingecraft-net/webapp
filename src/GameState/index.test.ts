import { dump, GameState, insert, move, tick } from '.'

describe('tick', () => {
  test('do nothing', () => {
    const empty: GameState = {
      adjacencies: [],
      containers: [],
      positions: [],
    }
    expect(tick(empty)).toStrictEqual(empty)
  })
  test('no transfer to non-adjacent', () => {
    const state: GameState = {
      adjacencies: [],
      containers: [
        {
          slots: [{ count: 16, name: 'iron rod' }],
          type: 'source',
        },
        { slots: [], type: 'assembler' },
      ],
      positions: [],
    }
    expect(tick(state)).toStrictEqual(state)
  })

  describe('assembler and source', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    test('no transfer once empty', () => {
      const actual = tick(
        tick({
          adjacencies,
          containers: [
            {
              slots: [{ count: 1, name: 'iron rod' }],
              type: 'source',
            },
            {
              slots: [],
              type: 'assembler',
            },
          ],
          positions: [],
        }),
      )

      const expected: GameState = {
        adjacencies,
        containers: [
          {
            slots: [],
            type: 'source',
          },
          {
            slots: [{ count: 1, name: 'iron rod' }],
            type: 'assembler',
          },
        ],
        positions: [],
      }

      expect(actual).toStrictEqual(expected)
    })

    test('transfer forward two to adjacent', () => {
      const actual = tick(
        tick({
          adjacencies,
          containers: [
            {
              slots: [{ count: 16, name: 'iron gear' }],
              type: 'source',
            },
            {
              slots: [],
              type: 'assembler',
            },
          ],
          positions: [],
        }),
      )

      const expected: GameState = {
        adjacencies,
        containers: [
          {
            slots: [{ count: 14, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [{ count: 2, name: 'iron gear' }],
            type: 'assembler',
          },
        ],
        positions: [],
      }

      expect(actual).toStrictEqual(expected)
    })

    test('transfer backward two to adjacent', () => {
      const actual = tick(
        tick({
          adjacencies,
          containers: [
            {
              slots: [{ count: 16, name: 'iron gear' }],
              type: 'source',
            },
            {
              slots: [],
              type: 'assembler',
            },
          ],
          positions: [],
        }),
      )

      const expected: GameState = {
        adjacencies,
        containers: [
          {
            slots: [{ count: 14, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [{ count: 2, name: 'iron gear' }],
            type: 'assembler',
          },
        ],
        positions: [],
      }

      expect(actual).toStrictEqual(expected)
    })
    test('backpressure upon mixed types', () => {
      const adjacencies = [{ from: 0, to: 1 }]
      const actual = tick({
        adjacencies,
        containers: [
          {
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [{ count: 16, name: 'iron rod' }],
            type: 'assembler',
          },
        ],
        positions: [],
      })

      const expected: GameState = {
        adjacencies,
        containers: [
          {
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [{ count: 16, name: 'iron rod' }],
            type: 'assembler',
          },
        ],
        positions: [],
      }

      expect(actual).toStrictEqual(expected)
    })
    test('no transfer between adjacent sources', () => {
      const adjacencies = [{ from: 0, to: 1 }]
      const actual = tick({
        adjacencies,
        containers: [
          {
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [],
            type: 'source',
          },
        ],
        positions: [],
      })

      const expected: GameState = {
        adjacencies,
        containers: [
          {
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            slots: [],
            type: 'source',
          },
        ],
        positions: [],
      }

      expect(actual).toStrictEqual(expected)
    })
  })
})

describe('insert', () => {
  test('add 32 iron gear', () => {
    const actual = insert(
      {
        adjacencies: [],
        containers: [
          {
            slots: [],
            type: 'source',
          },
          {
            slots: [],
            type: 'source',
          },
        ],
        positions: [],
      },
      { key: 0, slot: { count: 32, name: 'iron gear' } },
    )

    const expected: GameState = {
      adjacencies: [],
      containers: [
        {
          slots: [{ count: 32, name: 'iron gear' }],
          type: 'source',
        },
        {
          slots: [],
          type: 'source',
        },
      ],
      positions: [],
    }

    expect(actual).toStrictEqual(expected)
  })
})

test('dump', () => {
  const actual = dump(
    {
      adjacencies: [],
      containers: [
        {
          slots: [{ count: 16, name: 'iron rod' }],
          type: 'source',
        },
        {
          slots: [{ count: 32, name: 'iron gear' }],
          type: 'assembler',
        },
        {
          slots: [{ count: 32, name: 'iron gear' }],
          type: 'assembler',
        },
      ],
      positions: [],
    },
    0,
  )

  const expected: GameState = {
    adjacencies: [],
    containers: [
      {
        slots: [],
        type: 'source',
      },
      {
        slots: [{ count: 32, name: 'iron gear' }],
        type: 'assembler',
      },
      {
        slots: [{ count: 32, name: 'iron gear' }],
        type: 'assembler',
      },
    ],
    positions: [],
  }

  expect(actual).toStrictEqual(expected)
})

describe('move', () => {
  test('move a loner', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [{ slots: [], type: 'assembler' }],
        positions: [{ x: 0 }],
      },
      { key: 0, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [],
      containers: [{ slots: [], type: 'assembler' }],
      positions: [{ x: 1 }],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('move one away severs relevant adjacencies and preserves other', () => {
    const actual = move(
      {
        adjacencies: [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
        ],
        containers: [
          { slots: [], type: 'source' },
          { slots: [], type: 'assembler' },
          { slots: [], type: 'source' },
          { slots: [], type: 'assembler' },
        ],
        positions: [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }],
      },
      { key: 1, position: { x: 5 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 2, to: 3 }],
      containers: [
        { slots: [], type: 'source' },
        { slots: [], type: 'assembler' },
        { slots: [], type: 'source' },
        { slots: [], type: 'assembler' },
      ],
      positions: [{ x: 0 }, { x: 5 }, { x: 2 }, { x: 3 }],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('move one to right of other creates adjacency', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [
          { slots: [], type: 'source' },
          { slots: [], type: 'assembler' },
        ],
        positions: [{ x: 0 }, { x: 2 }],
      },
      { key: 1, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 0, to: 1 }],
      containers: [
        { slots: [], type: 'source' },
        { slots: [], type: 'assembler' },
      ],
      positions: [{ x: 0 }, { x: 1 }],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('move one to left of other creates adjacency', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [
          { slots: [], type: 'source' },
          { slots: [], type: 'assembler' },
        ],
        positions: [{ x: 0 }, { x: 2 }],
      },
      { key: 0, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 1, to: 0 }],
      containers: [
        { slots: [], type: 'source' },
        { slots: [], type: 'assembler' },
      ],
      positions: [{ x: 1 }, { x: 2 }],
    }
    expect(actual).toStrictEqual(expected)
  })
})
