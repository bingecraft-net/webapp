import {
  Adjacency,
  ContainerState,
  dump,
  GameState,
  insert,
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
      { slots: [{ count: 16, name: 'iron rod' }], type: 'source' },
      { slots: [], type: 'sink' },
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
                slots: [{ count: 1, name: 'iron rod' }],
                type: 'source',
              },
              { slots: [], type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { slots: [], type: 'source' },
          { slots: [{ count: 1, name: 'iron rod' }], type: 'sink' },
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
                slots: [{ count: 16, name: 'iron gear' }],
                type: 'source',
              },
              { slots: [], type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { slots: [{ count: 14, name: 'iron gear' }], type: 'source' },
          { slots: [{ count: 2, name: 'iron gear' }], type: 'sink' },
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
                slots: [{ count: 16, name: 'iron gear' }],
                type: 'source',
              },
              { slots: [], type: 'sink' },
            ],
          }),
        ),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          { slots: [{ count: 14, name: 'iron gear' }], type: 'source' },
          { slots: [{ count: 2, name: 'iron gear' }], type: 'sink' },
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
              slots: [{ count: 16, name: 'iron gear' }],
              type: 'source',
            },
            { slots: [{ count: 16, name: 'iron rod' }], type: 'sink' },
          ],
        }),
      ).toStrictEqual<GameState>({
        adjacencies,
        containers: [
          {
            slots: [{ count: 16, name: 'iron gear' }],
            type: 'source',
          },
          { slots: [{ count: 16, name: 'iron rod' }], type: 'sink' },
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
          containers: [{ slots: [], type: 'source' }],
        },
        { count: 32, name: 'iron gear' },
      ),
    ).toStrictEqual<GameState>({
      adjacencies: [],
      containers: [
        { slots: [{ count: 32, name: 'iron gear' }], type: 'source' },
      ],
    })
  })
})

test('dump', () => {
  expect(
    dump({
      adjacencies: [],
      containers: [
        { slots: [{ count: 16, name: 'iron rod' }], type: 'source' },
        { slots: [{ count: 32, name: 'iron gear' }], type: 'sink' },
      ],
    }),
  ).toStrictEqual<GameState>({
    adjacencies: [],
    containers: [
      { slots: [{ count: 16, name: 'iron rod' }], type: 'source' },
      { slots: [], type: 'sink' },
    ],
  })
})
