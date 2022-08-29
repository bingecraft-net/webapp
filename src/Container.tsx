import { useCallback, useRef } from 'react'
import { Action, ContainerState, Vector1 } from './GameState'

interface ContainerProps {
  dispatch: React.Dispatch<Action>
  _key: number
  container: ContainerState
  position: Vector1
}
export default function Container({
  dispatch,
  _key,
  container,
  position,
}: ContainerProps) {
  const drag = useRef<{
    dragging: boolean
    fontSize: number
    position: { x: number }
  }>({
    dragging: false,
    fontSize: 0,
    position: { x: 0 },
  })
  const onPointerMove = useCallback(
    (e: PointerEvent) =>
      (drag.current.position.x = Math.floor(
        e.clientX / drag.current.fontSize / 8,
      )),
    [],
  )
  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      drag.current.dragging = false
      dispatch({
        key: _key,
        position: {
          x: Math.floor(e.clientX / drag.current.fontSize / 8),
        },
        type: 'move',
      })
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    },
    [_key, dispatch, onPointerMove],
  )
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(8rem*${
          drag.current.dragging ? drag.current.position.x : position.x
        })`,
        width: '8rem',
        height: '8rem',
        padding: '1rem',
        boxSizing: 'border-box',

        backgroundColor:
          container.type === 'source'
            ? `hsl(20,100%,75%)`
            : `hsl(40,100%,75%)`,

        userSelect: 'none',
        cursor: 'grab',
      }}
      onPointerDown={(e) => {
        drag.current = {
          dragging: true,
          fontSize: parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          ),
          position: {
            x: Math.floor(e.clientX / drag.current.fontSize / 8),
          },
        }
        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerup', onPointerUp)
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
                key: _key,
                slot: { count: 8, name: 'iron rod' },
                type: 'insert',
              })
            }
            disabled={
              container.slots[0] && container.slots[0].name !== 'iron rod'
            }
          >
            add 8 iron rod
          </button>
          <button
            onClick={() =>
              dispatch({
                key: _key,
                slot: { count: 8, name: 'iron gear' },
                type: 'insert',
              })
            }
            disabled={
              container.slots[0] && container.slots[0].name !== 'iron gear'
            }
          >
            add 8 iron gear
          </button>
        </>
      )}
      {container.type === 'assembler' && (
        <button onClick={() => dispatch({ key: _key, type: 'dump' })}>
          dump
        </button>
      )}
    </div>
  )
}
