import { useEffect, useReducer, useState } from 'react'
import { Action, ContainerState, GameState, reducer } from './GameState'

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
      type: 'sink',
    },
    {
      position: { x: 2 },
      slots: [],
      type: 'source',
    },
    {
      position: { x: 3 },
      slots: [],
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
        position: 'absolute',
        left: `calc(8rem*${container.position.x})`,
      }}
    >
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
          {container.slots[0]?.count
            ? `: ${container.slots[0].count} ${container.slots[0].name}`
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
                container.slots[0] &&
                container.slots[0].name !== 'iron rod'
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
                container.slots[0] &&
                container.slots[0].name !== 'iron gear'
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
    </div>
  )
}
