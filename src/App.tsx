import { useEffect, useState } from 'react'

interface State {
  adjacencies: Adjacency[]
  containers: ContainerState[]
}

export interface Adjacency {
  from: number
  to: number
}

export interface ContainerState {
  count: number
  type: 'source' | 'sink'
}

const defaultState: State = {
  adjacencies: [{ from: 0, to: 1 }],
  containers: [
    {
      type: 'source',
      count: 0,
    },
    {
      type: 'sink',
      count: 0,
    },
  ],
}

export default function App() {
  const frame = useFrame()
  const [state, setState] = useState<State>(defaultState)
  useEffect(() => setState(tick), [frame])
  return (
    <>
      <div>{JSON.stringify(state)}</div>
      <button
        onClick={() =>
          setState((state) => ({
            ...state,
            containers: state.containers.map((container) =>
              container.type === 'source'
                ? { ...container, count: container.count + 16 }
                : container,
            ),
          }))
        }
      >
        add 16 to source container
      </button>
    </>
  )
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
      if (from.type === 'source' && from.count > 0) {
        const fromCountDifference = offsetByIndex.get(fromIndex) || 0 - 1
        const toCountDifference = offsetByIndex.get(toIndex) || 0 + 1
        offsetByIndex.set(fromIndex, fromCountDifference)
        offsetByIndex.set(toIndex, toCountDifference)
      } else if (to.type === 'source' && to.count > 0) {
        const fromCountDifference = offsetByIndex.get(fromIndex) || 0 + 1
        const toCountDifference = offsetByIndex.get(toIndex) || 0 - 1
        offsetByIndex.set(fromIndex, fromCountDifference)
        offsetByIndex.set(toIndex, toCountDifference)
      }
    })
  return {
    ...state,
    containers: state.containers.map((container, index) => ({
      ...container,
      count: container.count + (offsetByIndex.get(index) || 0),
    })),
  }
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
