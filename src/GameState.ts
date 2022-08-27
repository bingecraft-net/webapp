export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'tick':
      return tick(state)
    case 'insert':
      return insert(state, action)
    case 'dump':
      return dump(state, action.key)
    case 'jump':
      return jump(state, action)
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

export function insert(
  state: GameState,
  { key, slot }: { key: number; slot: Slot },
): GameState {
  return {
    ...state,
    containers: state.containers.map(
      (container, index): ContainerState =>
        index === key
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

export function dump(state: GameState, key: number): GameState {
  return {
    ...state,
    containers: state.containers.map(
      ({ slots, ...container }, index): ContainerState => ({
        ...container,
        slots: key === index ? [] : slots,
      }),
    ),
  }
}

export function jump(
  state: GameState,
  { key }: { key: number },
): GameState {
  const positions = state.containers.reduce(
    (acc, cur) => acc.concat(cur.position.x),
    new Array<number>(),
  )
  let next = positions[0]
  while (positions.some((position) => position === next)) {
    next = Math.floor(Math.random() * 8)
  }
  return move(state, { key, position: { x: next } })
}

export function move(
  state: GameState,
  { key, position }: { key: number; position: { x: number } },
) {
  const adjacencies: Adjacency[] = state.adjacencies.filter(
    ({ from, to }) => from !== key && to !== key,
  )
  const containers = state.containers.map(
    (container, index): ContainerState => {
      if (
        key !== index &&
        Math.abs(position.x - container.position.x) === 1
      )
        adjacencies.push({ from: index, to: key })
      return {
        ...container,
        position: key !== index ? container.position : position,
      }
    },
  )
  return {
    adjacencies,
    containers,
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
  | { type: 'tick' }
  | { key: number; type: 'dump' }
  | { key: number; type: 'jump' }
  | { key: number; slot: Slot; type: 'insert' }
