import { Stack, stackCountByName, stacks } from './Stacks'

export interface State {
  machines: Machine[]
}

export type MachineBase = { position: { x: number; y: number } }

interface Assembler extends MachineBase {
  inStacks: Stack[]
  outStacks: Stack[]
  potential: number
  type: 'assembler'
}

interface Crate extends MachineBase {
  stacks: Stack[]
  type: 'crate'
}

export type Machine = Assembler | Crate

export function assembleTick({ machines }: State): State {
  return {
    machines: machines.map((machine): Machine => {
      if (machine.type !== 'assembler') return machine

      const potential = Math.min(20, machine.potential + 1)
      if (potential < 20) return { ...machine, potential }

      const outCountByName = stackCountByName(machine.outStacks)

      const inCountByName = stackCountByName(machine.inStacks)
      const gearCount = inCountByName.get('gear') || 0
      const rodCount = inCountByName.get('rod') || 0
      if (gearCount >= 2 && rodCount >= 1) {
        inCountByName.set('gear', gearCount - 2)
        inCountByName.set('rod', rodCount - 1)
        outCountByName.set('widget', 1)
        return {
          ...machine,
          inStacks: stacks(inCountByName),
          outStacks: stacks(outCountByName),
          potential: 0,
        }
      }
      return { ...machine, potential }
    }),
  }
}
