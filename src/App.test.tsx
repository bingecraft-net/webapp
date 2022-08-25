import { Adjacency, ContainerState, tick } from './App'

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
      { type: 'source', count: 16 },
      { type: 'sink', count: 0 },
    ]
    expect(
      tick({
        adjacencies,
        containers,
      }),
    ).toStrictEqual({
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
            { type: 'source', count: 1 },
            { type: 'sink', count: 0 },
          ],
        }),
      ),
    ).toStrictEqual({
      adjacencies,
      containers: [
        { type: 'source', count: 0 },
        { type: 'sink', count: 1 },
      ],
    })
  })
  test('transfer forward one to adjacent', () => {
    const adjacencies = [{ from: 0, to: 1 }]
    expect(
      tick(
        tick({
          adjacencies,
          containers: [
            { type: 'source', count: 16 },
            { type: 'sink', count: 0 },
          ],
        }),
      ),
    ).toStrictEqual({
      adjacencies,
      containers: [
        { type: 'source', count: 14 },
        { type: 'sink', count: 2 },
      ],
    })
  })
  test('transfer backward one to adjacent', () => {
    const adjacencies = [{ from: 1, to: 0 }]
    expect(
      tick(
        tick({
          adjacencies,
          containers: [
            { type: 'source', count: 16 },
            { type: 'sink', count: 0 },
          ],
        }),
      ),
    ).toStrictEqual({
      adjacencies,
      containers: [
        { type: 'source', count: 14 },
        { type: 'sink', count: 2 },
      ],
    })
  })
})
