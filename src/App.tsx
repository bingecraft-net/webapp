import { useEffect, useReducer, useState } from 'react'

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick':
      return tick(state)
    case 'insert':
      return {
        ...state,
        containers: state.containers.map(
          (container): ContainerState =>
            container.type === 'source'
              ? {
                  ...container,
                  inventory: {
                    count: (container.inventory?.count || 0) + 16,
                  },
                }
              : container,
        ),
      }
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
}

interface Action {
  type: 'tick' | 'insert'
}

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

export function tick(state: State) {
  const offsetByIndex = new Map<number, number>()
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
        from.inventory.count > 0
      ) {
        const fromCountDifference = offsetByIndex.get(fromIndex) || 0 - 1
        const toCountDifference = offsetByIndex.get(toIndex) || 0 + 1
        offsetByIndex.set(fromIndex, fromCountDifference)
        offsetByIndex.set(toIndex, toCountDifference)
      } else if (
        to.type === 'source' &&
        to.inventory &&
        to.inventory.count > 0
      ) {
        const fromCountDifference = offsetByIndex.get(fromIndex) || 0 + 1
        const toCountDifference = offsetByIndex.get(toIndex) || 0 - 1
        offsetByIndex.set(fromIndex, fromCountDifference)
        offsetByIndex.set(toIndex, toCountDifference)
      }
    })
  return {
    ...state,
    containers: state.containers.map(
      (container, index): ContainerState => {
        const count =
          (container.inventory?.count || 0) +
          (offsetByIndex.get(index) || 0)
        return {
          ...container,
          inventory: count !== 0 ? { count } : undefined,
        }
      },
    ),
  }
}

interface ContainerProps {
  dispatch: React.Dispatch<any>
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
          ? `: ${container.inventory.count} iron rod`
          : ''}
      </div>
      <button
        onClick={() => dispatch({ type: 'insert' })}
        style={{
          visibility: container.type === 'source' ? 'visible' : 'hidden',
        }}
      >
        add 16 iron rod
      </button>
    </div>
  )
}
