import { useEffect, useReducer, useState } from 'react'

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick':
      return tick(state)
    case 'insert':
      return insert(state, action.inventory)
    case 'dump':
      return dump(state)
  }
}

export function tick(state: State) {
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

export function insert(state: State, inventory: Inventory): State {
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

export function dump(state: State): State {
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

export interface State {
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

type Action =
  | { type: 'tick' | 'dump' }
  | { type: 'insert'; inventory: Inventory }

const defaultState: State = {
  adjacencies: [{ from: 0, to: 1 }],
  containers: [
    {
      type: 'source',
    },
    {
      type: 'sink',
    },
  ],
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, defaultState)
  const frame = useFrame()
  useEffect(() => dispatch({ type: 'tick' }), [frame])
  return (
    <>
      <div>adjacencies: {JSON.stringify(state.adjacencies)}</div>
      {state.containers.map((container, key) => (
        <Container
          dispatch={dispatch}
          key={key.toString()}
          _key={key.toString()}
          container={container}
        />
      ))}
    </>
  )
}

function useFrame() {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    let timeout: NodeJS.Timeout
    async function tick() {
      setFrame((tick) => tick + 1)
      timeout = setTimeout(tick, 1000 / 20)
    }
    tick()
    return () => clearTimeout(timeout)
  }, [])
  return frame
}

interface ContainerProps {
  dispatch: React.Dispatch<Action>
  _key: string
  container: ContainerState
}
function Container({ dispatch, _key, container }: ContainerProps) {
  return (
    <div
      style={{
        width: '8rem',
        height: '8rem',
        backgroundColor:
          container.type === 'source'
            ? `hsl(20,100%,75%)`
            : `hsl(40,100%,75%)`,
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div>
        {_key}
        {container.inventory?.count
          ? `: ${container.inventory.count} ${container.inventory.name}`
          : ''}
      </div>
      {container.type === 'source' && (
        <>
          <button
            onClick={() =>
              dispatch({
                type: 'insert',
                inventory: { count: 8, name: 'iron rod' },
              })
            }
            disabled={
              container.inventory &&
              container.inventory.name !== 'iron rod'
            }
          >
            add 8 iron rod
          </button>
          <button
            onClick={() =>
              dispatch({
                type: 'insert',
                inventory: { count: 8, name: 'iron gear' },
              })
            }
            disabled={
              container.inventory &&
              container.inventory.name !== 'iron gear'
            }
          >
            add 8 iron gear
          </button>
        </>
      )}
      {container.type === 'sink' && (
        <button onClick={() => dispatch({ type: 'dump' })}>dump</button>
      )}
    </div>
  )
}
