import { useEffect, useState } from 'react'
import { Machine, Stack, State, tick } from './State'

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
      { inStacks: [], outStacks: [], type: 'assembler' },
    ],
  })

  useEffect(() => {
    setInterval(() => setState(tick), 1000 / 20)
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
      <div style={{ textIndent: '1rem' }}>
        <MachineStacks machine={machine} />
      </div>
    </div>
  )
}

type MachineStacksProps = { machine: Machine }
function MachineStacks({ machine }: MachineStacksProps) {
  switch (machine.type) {
    case 'assembler':
      return (
        <>
          <Stacks stacks={machine.inStacks} />
          <Stacks stacks={machine.outStacks} />
        </>
      )
    case 'crate':
      return <Stacks stacks={machine.stacks} />
  }
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
