import { Stack } from './Stacks'

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
