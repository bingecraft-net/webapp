import React, { useEffect, useRef, useState } from 'react'
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
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <TextView setState={setState} state={state} />
      </div>
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <TwoDView setState={setState} state={state} />
      </div>
    </div>
  )
}

interface TwoDViewProps {
  setState: React.Dispatch<React.SetStateAction<State>>
  state: State
}
function TwoDView({ setState, state }: TwoDViewProps) {
  const [{ offset }, setCamera] = useState({ offset: { x: 0, y: 0 } })
  const context = useRef({
    dragging: false,
    lastPosition: { x: 0, y: 0 },
  })
  return (
    <div
      style={{ position: 'relative', height: '100%' }}
      onPointerDown={(e) => {
        context.current = {
          dragging: true,
          lastPosition: { x: e.pageX, y: e.pageY },
        }
      }}
      onPointerMove={(e) => {
        const dx = context.current.lastPosition.x - e.pageX
        const dy = context.current.lastPosition.y - e.pageY
        if (context.current.dragging)
          setCamera((camera) => ({
            offset: { x: camera.offset.x - dx, y: camera.offset.y - dy },
          }))
        context.current.lastPosition = { x: e.pageX, y: e.pageY }
      }}
      onPointerUp={() => (context.current.dragging = false)}
    >
      {state.machines.map((machine) => (
        <div
          key={machine.key}
          style={{
            position: 'absolute',
            left: offset.x + 128 * machine.position.x,
            top: offset.y + 128 * machine.position.y,
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
