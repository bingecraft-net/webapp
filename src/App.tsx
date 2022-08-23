import { useEffect, useState } from 'react'

interface State {
  containers: ContainerState[]
}

interface ContainerState {
  id: string
  count: number
}

const defaultState: State = {
  containers: [
    {
      id: 'source',
      count: 0,
    },
    {
      id: 'sink',
      count: 0,
    },
  ],
}

export default function App() {
  const tick = useTick()
  const [state, setState] = useState<State>(defaultState)
  useEffect(() => {
    setState((state) => {
      const source = state.containers.find(
        (container) => container.id === 'source',
      )!
      const sink = state.containers.find(
        (container) => container.id === 'sink',
      )!
      if (source.count > 0) {
        return {
          containers: [
            {
              ...source,
              count: source.count - 1,
            },
            {
              ...sink,
              count: sink.count + 1,
            },
          ],
        }
      } else return state
    })
  }, [tick])
  return (
    <>
      <div>{JSON.stringify(state)}</div>
      <button
        onClick={() =>
          setState((state) => ({
            containers: state.containers.map((container) =>
              container.id === 'source'
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

function useTick() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    let timeout: NodeJS.Timeout
    async function tick() {
      setTick((tick) => tick + 1)
      timeout = setTimeout(tick, 1000 / 20)
    }
    tick()
    return () => clearTimeout(timeout)
  }, [])
  return tick
}
