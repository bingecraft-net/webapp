import { Machine, State } from '.'
import { recipeSettings } from './RecipeSettings'
import { combineStacks, Stack } from './Stacks'

export default function transferTick({ machines }: State) {
  const deltasByMachineIndex = new Map<number, Stack[]>()
  machines.forEach((machine, key) => {
    if (machine.type === 'assembler') {
      const deltas = deltasByMachineIndex.get(key) || []
      const recipe = recipeSettings.recipes.find(
        (recipe) => recipe.key === machine.recipeKey,
      )!
      machines.forEach((other, otherKey) => {
        if (other.type === 'crate') {
          const otherDeltas = deltasByMachineIndex.get(otherKey) || []
          recipe.ingredients.forEach((ingredient) => {
            if (
              (other.stacks.find((stack) => stack.name === ingredient.name)
                ?.count || 0) > 0
            ) {
              deltas.push({ name: ingredient.name, count: 1 })
              otherDeltas.push({ name: ingredient.name, count: -1 })
            }
          })
          deltasByMachineIndex.set(otherKey, otherDeltas)
        }
      })
      deltasByMachineIndex.set(key, deltas)
    }
  })

  return {
    machines: machines.map((machine, key): Machine => {
      const deltas = deltasByMachineIndex.get(key) || []
      return machine.type === 'crate'
        ? { ...machine, stacks: combineStacks(machine.stacks, deltas) }
        : { ...machine, inStacks: combineStacks(machine.inStacks, deltas) }
    }),
  }
}
