import { count } from 'console'

export interface State {
  machines: Machine[]
}

export type Machine =
  | {
      stacks: Stack[]
      type: 'crate'
    }
  | {
      inStacks: Stack[]
      outStacks: Stack[]
      potential: number
      type: 'assembler'
    }

export interface Stack {
  count: number
  name: StackName
}

export type StackName = 'gear' | 'rod' | 'widget'

export function transferTick({ machines }: State) {
  const transfer = machines.reduce((prev, current) => {
    switch (current.type) {
      case 'crate':
        return prev.concat(
          current.stacks.map((stack) => ({ ...stack, count: 1 })),
        )
      default:
        return prev
    }
  }, new Array<Stack>())

  return {
    machines: machines.map((machine): Machine => {
      switch (machine.type) {
        case 'crate':
          return {
            ...machine,
            stacks: machine.stacks.flatMap((stack) => {
              return stack.count > 1
                ? [
                    {
                      ...stack,
                      count: stack.count - 1,
                    },
                  ]
                : []
            }),
          }
        case 'assembler':
          return {
            ...machine,
            inStacks: combineStacks(machine.inStacks, transfer),
          }
      }
    }),
  }
}

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

function combineStacks(operand0: Stack[], operand1: Stack[]): Stack[] {
  return stacks(stackCountByName(operand0.concat(operand1)))
}

function stackCountByName(stacks: Stack[]): Map<StackName, number> {
  return stacks.reduce(
    (countByName, stack) =>
      countByName.set(
        stack.name,
        stack.count + (countByName.get(stack.name) || 0),
      ),
    new Map<StackName, number>(),
  )
}

function stacks(stackCountByName: Map<StackName, number>): Stack[] {
  const stacks: Stack[] = []
  stackCountByName.forEach(
    (count, name) =>
      count !== 0 &&
      stacks.push({
        count,
        name: name as StackName,
      }),
  )
  return stacks
}
