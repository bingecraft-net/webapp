import {
  Adjacency,
  ContainerState,
  dump,
  GameState,
  insert,
  move,
  tick,
} from './GameState'

describe('tick', () => {
  test('do nothing', () => {
    expect(tick({ adjacencies: [], containers: [] })).toStrictEqual({
      adjacencies: [],
      containers: [],
    })
  })
  test('no transfer to non-adjacent', () => {
    const adjacencies = new Array<Adjacency>()
    const containers: ContainerState[] = [
      {
        position: { x: 0 },
        slots: [{ count: 16, name: 'iron rod' }],
        type: 'source',
      },
      { position: { x: 1 }, slots: [], type: 'sink' },
    ]
    expect(
      tick({
        adjacencies,
        containers,
      }),
    ).toStrictEqual<GameState>({
      adjacencies,
      containers,
    })
  })
  describe('sink and source', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    test('no transfer once empty', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                position: { x: 0 },
                slots: [{ count: 1, name: 'iron rod' }],
                type: 'source',
              },
              {
                position: { x: 1 },
                slots: [],
                type: 'sink',
              },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            position: { x: 0 },
            slots: [],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [{ count: 1, name: 'iron rod' }],
            type: 'sink',
          },
        ],
      })
    })
    test('transfer forward two to adjacent', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                position: { x: 0 },
                slots: [{ count: 16, name: 'iron gear' }],
                type: 'source',
              },
              {
                position: { x: 1 },
                slots: [],
                type: 'sink',
              },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            position: { x: 0 },
            slots: [{ count: 14, name: 'iron gear' }],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [{ count: 2, name: 'iron gear' }],
            type: 'sink',
          },
        ],
      })
    })
    test('transfer backward two to adjacent', () => {
      expect(
        tick(
          tick({
            adjacencies,
            containers: [
              {
                position: { x: 0 },
                slots: [{ count: 16, name: 'iron gear' }],
                type: 'source',
              },
              {
                position: { x: 1 },
                slots: [],
                type: 'sink',
              },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            position: { x: 0 },
            slots: [{ count: 14, name: 'iron gear' }],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [{ count: 2, name: 'iron gear' }],
            type: 'sink',
          },
        ],
      })
    })
    test('backpressure upon mixed types', () => {
      const adjacencies = [{ from: 0, to: 1 }]
      expect(
        tick({
          adjacencies,
          containers: [
            {
              position: { x: 0 },
              slots: [{ count: 16, name: 'iron gear' }],
              type: 'source',
            },
            {
              position: { x: 1 },
              slots: [{ count: 16, name: 'iron rod' }],
              type: 'sink',
            },
          ],
        }),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            position: { x: 0 },
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [{ count: 16, name: 'iron rod' }],
            type: 'sink',
          },
        ],
      })
    })
    test('no transfer between adjacent sources', () => {
      const adjacencies = [{ from: 0, to: 1 }]
      expect(
        tick({
          adjacencies,
          containers: [
            {
              position: { x: 0 },
              slots: [{ count: 16, name: 'iron gear' }],
              type: 'source',
            },
            {
              position: { x: 1 },
              slots: [],
              type: 'source',
            },
          ],
        }),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            position: { x: 0 },
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [],
            type: 'source',
          },
        ],
      })
    })
  })
})

describe('insert', () => {
  test('add 32 iron gear', () => {
    expect(
      insert(
        {
          adjacencies: [],
          containers: [
            {
              position: { x: 0 },
              slots: [],
              type: 'source',
            },
            {
              position: { x: 1 },
              slots: [],
              type: 'source',
            },
          ],
        },
        { key: 0, slot: { count: 32, name: 'iron gear' } },
      ),
    ).toStrictEqual<GameState>({
      adjacencies: [],
      containers: [
        {
          position: { x: 0 },
          slots: [{ count: 32, name: 'iron gear' }],
          type: 'source',
        },
        {
          position: { x: 1 },
          slots: [],
          type: 'source',
        },
      ],
    })
  })
})

test('dump', () => {
  expect(
    dump(
      {
        adjacencies: [],
        containers: [
          {
            position: { x: 0 },
            slots: [{ count: 16, name: 'iron rod' }],
            type: 'source',
          },
          {
            position: { x: 1 },
            slots: [{ count: 32, name: 'iron gear' }],
            type: 'sink',
          },
          {
            position: { x: 2 },
            slots: [{ count: 32, name: 'iron gear' }],
            type: 'sink',
          },
        ],
      },
      0,
    ),
  ).toStrictEqual<GameState>({
    adjacencies: [],
    containers: [
      {
        position: { x: 0 },
        slots: [],
        type: 'source',
      },
      {
        position: { x: 1 },
        slots: [{ count: 32, name: 'iron gear' }],
        type: 'sink',
      },
      {
        position: { x: 2 },
        slots: [{ count: 32, name: 'iron gear' }],
        type: 'sink',
      },
    ],
  })
})

describe('move', () => {
  test('move a loner', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [{ position: { x: 0 }, slots: [], type: 'sink' }],
      },
      { key: 0, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [],
      containers: [{ position: { x: 1 }, slots: [], type: 'sink' }],
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
          { position: { x: 0 }, slots: [], type: 'source' },
          { position: { x: 1 }, slots: [], type: 'sink' },
          { position: { x: 2 }, slots: [], type: 'source' },
          { position: { x: 3 }, slots: [], type: 'sink' },
        ],
      },
      { key: 1, position: { x: 5 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 2, to: 3 }],
      containers: [
        { position: { x: 0 }, slots: [], type: 'source' },
        { position: { x: 5 }, slots: [], type: 'sink' },
        { position: { x: 2 }, slots: [], type: 'source' },
        { position: { x: 3 }, slots: [], type: 'sink' },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('move one to right of other creates adjacency', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [
          { position: { x: 0 }, slots: [], type: 'source' },
          { position: { x: 2 }, slots: [], type: 'sink' },
        ],
      },
      { key: 1, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 0, to: 1 }],
      containers: [
        { position: { x: 0 }, slots: [], type: 'source' },
        { position: { x: 1 }, slots: [], type: 'sink' },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
  test('move one to left of other creates adjacency', () => {
    const actual = move(
      {
        adjacencies: [],
        containers: [
          { position: { x: 0 }, slots: [], type: 'source' },
          { position: { x: 2 }, slots: [], type: 'sink' },
        ],
      },
      { key: 0, position: { x: 1 } },
    )
    const expected: GameState = {
      adjacencies: [{ from: 1, to: 0 }],
      containers: [
        { position: { x: 1 }, slots: [], type: 'source' },
        { position: { x: 2 }, slots: [], type: 'sink' },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
})
