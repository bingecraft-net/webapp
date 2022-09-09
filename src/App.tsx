import { useEffect, useState } from 'react'
import { State } from './state'
import assembleTick from './state/assembleTick'
import TextView from './state/TextView'
import transferTick from './state/transferTick'

export default function App() {
  const [state, setState] = useState<State>({
    machines: [
      {
        position: { x: 0, y: 0 },
        stacks: [
          { count: 8, name: 'gear' },
          { count: 8, name: 'plate' },
        ],
        type: 'crate',
      },
      {
        position: { x: 1, y: 0 },
        stacks: [{ count: 8, name: 'rod' }],
        type: 'crate',
      },
      {
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

  return <TextView setState={setState} state={state} />
}
