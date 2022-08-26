import { Adjacency, ContainerState, insert, State, tick } from './App'

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
      { type: 'source', inventory: { count: 16 } },
      { type: 'sink', inventory: undefined },
    ]
    expect(
      tick({
        adjacencies,
        containers,
      }),
    ).toStrictEqual<State>({
      adjacencies,
      containers,
    })
  })
  test('no transfer once empty', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    expect(
      tick(
        tick({
          adjacencies,
          containers: [
            { type: 'source', inventory: { count: 1 } },
            { type: 'sink' },
          ],
        }),
      ),
    ).toStrictEqual<State>({
      adjacencies,
      containers: [
        { type: 'source', inventory: undefined },
        { type: 'sink', inventory: { count: 1 } },
      ],
    })
  })
  test('transfer forward two to adjacent', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    expect(
      tick(
        tick({
          adjacencies,
          containers: [
            { type: 'source', inventory: { count: 16 } },
            { type: 'sink' },
          ],
        }),
      ),
    ).toStrictEqual<State>({
      adjacencies,
      containers: [
        { type: 'source', inventory: { count: 14 } },
        { type: 'sink', inventory: { count: 2 } },
      ],
    })
  })
  test('transfer backward two to adjacent', () => {
    const adjacencies = [{ from: 1, to: 0 }]
    expect(
      tick(
        tick({
          adjacencies,
          containers: [
            { type: 'source', inventory: { count: 16 } },
            { type: 'sink' },
          ],
        }),
      ),
    ).toStrictEqual<State>({
      adjacencies,
      containers: [
        { type: 'source', inventory: { count: 14 } },
        { type: 'sink', inventory: { count: 2 } },
      ],
    })
  })
})

describe('insert', () => {
  test('add 32 iron rod', () => {
    expect(
      insert(
        {
          adjacencies: [],
          containers: [{ type: 'source' }],
        },
        { count: 32 },
      ),
    ).toStrictEqual({
      adjacencies: [],
      containers: [{ type: 'source', inventory: { count: 32 } }],
    })
  })
})
