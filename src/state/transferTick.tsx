import { Machine, State } from '.'
import { combineStacks, Stack } from './Stacks'

export default function transferTick({ machines }: State) {
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
