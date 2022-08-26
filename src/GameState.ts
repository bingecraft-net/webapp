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
  const overrides = new Map<number, Inventory>()
  state.adjacencies
    .map(({ from, to }) => ({
      from: state.containers[from],
      fromIndex: from,
      to: state.containers[to],
      toIndex: to,
    }))
    .forEach(({ from, fromIndex, to, toIndex }) => {
      if (
        from.type === 'source' &&
        from.inventory &&
        from.inventory.count > 0 &&
        (!to.inventory || from.inventory.name === to.inventory?.name)
      ) {
        overrides.set(fromIndex, {
          count:
            (overrides.get(fromIndex)?.count || from.inventory.count) - 1,
          name: from.inventory.name,
        })
        overrides.set(toIndex, {
          count:
            (overrides.get(toIndex)?.count || to.inventory?.count || 0) +
            1,
          name: from.inventory.name,
        })
      } else if (
        to.type === 'source' &&
        to.inventory &&
        to.inventory.count > 0
      ) {
        overrides.set(toIndex, {
          count: (overrides.get(toIndex)?.count || to.inventory.count) - 1,
          name: to.inventory.name,
        })
        overrides.set(fromIndex, {
          count:
            (overrides.get(fromIndex)?.count ||
              from.inventory?.count ||
              0) + 1,
          name: to.inventory.name,
        })
      }
    })
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
