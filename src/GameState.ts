export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'tick':
      return tick(state)
    case 'insert':
      return insert(state, action.inventory)
    case 'dump':
      return dump(state)
  }
}

export function tick(state: GameState) {
  const overrides = state.adjacencies.reduce(
    (overrides, { from: ai, to: bi }) => {
      const a = state.containers[ai]
      const b = state.containers[bi]
      tryPull([overrides, a, ai, b, bi])
      tryPull([overrides, b, bi, a, ai])
      return overrides
    },
    new Map<number, Inventory>(),
  )
  return {
    ...state,
    containers: state.containers.map(
      (container, index): ContainerState => {
        const inventory = overrides.get(index) || container.inventory
        return {
          ...container,
          inventory: inventory?.count !== 0 ? inventory : undefined,
        }
      },
    ),
  }
}

type tryPullProps = [
  Map<number, Inventory>,
  ContainerState,
  number,
  ContainerState,
  number,
]
function tryPull([overrides, a, aIndex, b, bIndex]: tryPullProps) {
  if (
    a.type === 'source' &&
    a.inventory &&
    a.inventory.count > 0 &&
    (!b.inventory || a.inventory.name === b.inventory?.name)
  ) {
    overrides.set(aIndex, {
      count: (overrides.get(aIndex)?.count || a.inventory.count) - 1,
      name: a.inventory.name,
    })
    overrides.set(bIndex, {
      count: (overrides.get(bIndex)?.count || b.inventory?.count || 0) + 1,
      name: a.inventory.name,
    })
  }
}

export function insert(state: GameState, inventory: Inventory): GameState {
  return {
    ...state,
    containers: state.containers.map(
      (container): ContainerState =>
        container.type === 'source'
          ? {
              ...container,
              inventory: {
                count: (container.inventory?.count || 0) + inventory.count,
                name: inventory.name,
              },
            }
          : container,
    ),
  }
}

export function dump(state: GameState): GameState {
  return {
    ...state,
    containers: state.containers.map(
      ({ inventory, ...container }): ContainerState =>
        container.type === 'sink'
          ? { ...container }
          : { ...container, inventory },
    ),
  }
}

export interface GameState {
  adjacencies: Adjacency[]
  containers: ContainerState[]
}

export interface Adjacency {
  from: number
  to: number
}

export interface ContainerState {
  inventory?: Inventory
  type: 'source' | 'sink'
}

export interface Inventory {
  count: number
  name: 'iron rod' | 'iron gear'
}

export type Action =
  | { type: 'tick' | 'dump' }
  | { type: 'insert'; inventory: Inventory }
