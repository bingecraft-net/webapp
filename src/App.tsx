import { useEffect, useState } from 'react'
import { assembleTick, Machine, Stack, State, transferTick } from './State'

export default function App() {
  const [{ machines }, setState] = useState<State>({
    machines: [
      {
        stacks: [{ count: 8, name: 'gear' }],
        type: 'crate',
      },
      {
        stacks: [{ count: 8, name: 'rod' }],
        type: 'crate',
      },
      { inStacks: [], outStacks: [], potential: 0, type: 'assembler' },
    ],
  })

  useEffect(() => {
    setInterval(
      () => setState((state) => assembleTick(transferTick(state))),
      1000 / 20,
    )
  }, [])
  return (
    <div>
      {machines.map((machine, index) => (
        <MachineView key={index} machine={machine} />
      ))}
    </div>
  )
}

type MachineViewProps = { machine: Machine }
function MachineView({ machine }: MachineViewProps) {
  return (
    <div>
      <div>{machine.type}</div>
      <div style={{ paddingLeft: '1rem' }}>
        {machine.type === 'assembler' ? (
          <>
            <div>potential: {machine.potential}</div>
            <div>in stacks:</div>
            <div style={{ paddingLeft: '1rem' }}>
              <Stacks stacks={machine.inStacks} />
            </div>
            <div>out stacks:</div>
            <div style={{ paddingLeft: '1rem' }}>
              <Stacks stacks={machine.outStacks} />
            </div>
          </>
        ) : (
          <Stacks stacks={machine.stacks} />
        )}
      </div>
    </div>
  )
}

type StacksProps = { stacks: Stack[] }
function Stacks({ stacks }: StacksProps) {
  return (
    <>
      {stacks.map((stack, index) => (
        <div key={index}>
          {stack.count} {stack.name}
        </div>
      ))}
    </>
  )
}
