export interface Stack {
  count: number
  name: StackName
}

export type StackName =
  | 'gear'
  | 'machine hull'
  | 'plate'
  | 'rod'
  | 'widget'

export function combineStacks(
  operand0: Stack[],
  operand1: Stack[],
): Stack[] {
  return stacks(stackCountByName(operand0.concat(operand1)))
}

export function stackCountByName(stacks: Stack[]): Map<StackName, number> {
  return stacks.reduce(
    (countByName, stack) =>
      countByName.set(
        stack.name,
        stack.count + (countByName.get(stack.name) || 0),
      ),
    new Map<StackName, number>(),
  )
}

export function stacks(stackCountByName: Map<StackName, number>): Stack[] {
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
