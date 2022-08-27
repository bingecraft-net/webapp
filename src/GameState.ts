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
    new Map<number, Slot>(),
  )
  return {
    ...state,
    containers: state.containers.map(
      (container, index): ContainerState => {
        const slot = overrides.get(index) || container.slots[0]
        return {
          ...container,
          slots: slot !== undefined && slot.count !== 0 ? [slot] : [],
        }
      },
    ),
  }
}

type tryPullProps = [
  Map<number, Slot>,
  ContainerState,
  number,
  ContainerState,
  number,
]
function tryPull([overrides, a, aIndex, b, bIndex]: tryPullProps) {
  const slot = a.slots[0]
  const other = b.slots[0]
  if (
    a.type === 'source' &&
    slot &&
    slot.count > 0 &&
    (!other || slot.name === other?.name)
  ) {
    overrides.set(aIndex, {
      count: (overrides.get(aIndex)?.count || slot.count) - 1,
      name: slot.name,
    })
    overrides.set(bIndex, {
      count: (overrides.get(bIndex)?.count || other?.count || 0) + 1,
      name: slot.name,
    })
  }
}

export function insert(state: GameState, slot: Slot): GameState {
  return {
    ...state,
    containers: state.containers.map(
      (container): ContainerState =>
        container.type === 'source'
          ? {
              ...container,
              slots: [
                {
                  count: (container.slots[0]?.count || 0) + slot.count,
                  name: slot.name,
                },
              ],
            }
          : container,
    ),
  }
}

export function dump(state: GameState): GameState {
  return {
    ...state,
    containers: state.containers.map(
      ({ slots, ...container }): ContainerState => ({
        ...container,
        slots: container.type === 'sink' ? [] : slots,
      }),
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
  position: { x: number }
  slots: [] | [Slot]
  type: 'source' | 'sink'
}

export interface Slot {
  count: number
  name: 'iron rod' | 'iron gear'
}

export type Action =
  | { type: 'tick' | 'dump' }
  | { type: 'insert'; inventory: Slot }
