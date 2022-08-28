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
      position: { x: 0 },
      slots: [],
      type: 'source',
    },
    {
      position: { x: 1 },
      slots: [],
      type: 'assembler',
    },
    {
      position: { x: 2 },
      slots: [],
      type: 'source',
    },
    {
      position: { x: 3 },
      slots: [],
      type: 'assembler',
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
          _key={key}
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
