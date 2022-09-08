import { Machine, State } from '.'
import { recipeSettings as settings } from './RecipeSettings'
import { stackCountByName, stacks } from './Stacks'

export default function assembleTick({ machines }: State): State {
  return {
    machines: machines.map((machine): Machine => {
      if (machine.type !== 'assembler') return machine
      const recipe = settings.recipes.find(
        (recipe) => recipe.key === machine.recipeKey,
      )!

      const potential = Math.min(20, machine.potential + 1)
      if (potential < 20) return { ...machine, potential }

      const outCountByName = stackCountByName(machine.outStacks)
      const inCountByName = stackCountByName(machine.inStacks)

      for (const ingredient of recipe.ingredients) {
        const available = inCountByName.get(ingredient.name) || 0
        if (available < ingredient.count) return { ...machine, potential }
        inCountByName.set(ingredient.name, available - ingredient.count)
      }

      for (const product of recipe.products) {
        outCountByName.set(
          product.name,
          (outCountByName.get(product.name) || 0) + product.count,
        )
      }

      return {
        ...machine,
        inStacks: stacks(inCountByName),
        outStacks: stacks(outCountByName),
        potential: 0,
      }
    }),
  }
}
