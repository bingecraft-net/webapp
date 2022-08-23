import { useEffect, useState } from 'react'

interface State {
  source: Container
  sink: Container
}

interface Container {
  count: number
}

const defaultState: State = {
  source: {
    count: 0,
  },
  sink: {
    count: 0,
  },
}

export default function App() {
  const tick = useTick()
  const [state, setState] = useState<State>(defaultState)
  useEffect(() => {
    setState((state) => {
      if (state.source.count > 0) {
        return {
          source: {
            count: state.source.count - 1,
          },
          sink: {
            count: state.sink.count + 1,
          },
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
            ...state,
            source: { count: state.source.count + 16 },
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
