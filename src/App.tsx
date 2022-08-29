import { useEffect, useReducer, useState } from 'react'
import Container from './Container'
import { GameState, reducer } from './GameState'

const defaultState: GameState = {
  adjacencies: [
    { from: 0, to: 1 },
    { from: 2, to: 1 },
    { from: 2, to: 3 },
  ],
  containers: [
    {
      slots: [],
      type: 'source',
    },
    {
      slots: [],
      type: 'assembler',
    },
    {
      slots: [],
      type: 'source',
    },
    {
      slots: [],
      type: 'assembler',
    },
  ],
  positions: [{ x: 0 }, { x: 1 }, { x: 2 }, { x: 3 }],
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
          _key={key}
          container={container}
          position={state.positions[key]}
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
