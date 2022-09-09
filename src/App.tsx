import React, { useEffect, useState } from 'react'
import { State } from './state'
import assembleTick from './state/assembleTick'
import TextView from './state/TextView'
import transferTick from './state/transferTick'

export default function App() {
  const [state, setState] = useState<State>({
    machines: [
      {
        key: 'crate0',
        position: { x: 0, y: 0 },
        stacks: [
          { count: 8, name: 'gear' },
          { count: 8, name: 'plate' },
        ],
        type: 'crate',
      },
      {
        key: 'crate1',
        position: { x: 1, y: 0 },
        stacks: [{ count: 8, name: 'rod' }],
        type: 'crate',
      },
      {
        key: 'assembler0',
        inStacks: [],
        outStacks: [],
        position: { x: 2, y: 0 },
        potential: 0,
        recipeKey: 'machine hull',
        type: 'assembler',
      },
    ],
  })

  useEffect(() => {
    setInterval(
      () => setState((state) => assembleTick(transferTick(state))),
      1000 / 20,
    )
  }, [])

  return (
    <>
      <TextView setState={setState} state={state} />
      <TwoDView setState={setState} state={state} />
    </>
  )
}

interface TwoDViewProps {
  setState: React.Dispatch<React.SetStateAction<State>>
  state: State
}
function TwoDView({ setState, state }: TwoDViewProps) {
  return (
    <div style={{ position: 'relative' }}>
      {state.machines.map((machine) => (
        <div
          key={machine.key}
          style={{
            position: 'absolute',
            left: 128 * machine.position.x,
            top: 128 * machine.position.y,
            width: 128,
            height: 128,
            backgroundColor: '#AAB',
            border: '1px solid black',
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          {machine.key}
        </div>
      ))}
    </div>
  )
}
