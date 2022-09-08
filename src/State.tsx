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
      type: 'assembler'
    }

export interface Stack {
  count: number
  name: StackName
}

export type StackName = 'gear' | 'rod'

export function tick({ machines }: State) {
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

function combineStacks(operand0: Stack[], operand1: Stack[]): Stack[] {
  const stacks: Stack[] = []
  operand0
    .concat(operand1)
    .reduce(
      (countByName, stack) =>
        countByName.set(
          stack.name,
          stack.count + (countByName.get(stack.name) || 0),
        ),
      new Map<string, number>(),
    )
    .forEach((count, name) =>
      stacks.push({
        count,
        name: name as StackName,
      }),
    )
  return stacks
}
