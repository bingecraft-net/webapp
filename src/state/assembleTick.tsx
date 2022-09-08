import { Machine, State } from '.'
import { recipeSettings as settings } from './RecipeSettings'
import { stackCountByName, stacks } from './Stacks'

export default function assembleTick({ machines }: State): State {
  return {
    machines: machines.map((machine): Machine => {
      if (machine.type !== 'assembler') return machine

      const potential = Math.min(20, machine.potential + 1)
      if (potential < 20) return { ...machine, potential }

      const outCountByName = stackCountByName(machine.outStacks)
      const inCountByName = stackCountByName(machine.inStacks)

      const recipe = settings.recipes.find(
        (recipe) => recipe.key === machine.recipeKey,
      )!
      if (
        recipe.ingredients.every(
          (ingredient) =>
            (inCountByName.get(ingredient.name) || 0) >= ingredient.count,
        )
      ) {
        recipe.ingredients.forEach((ingredient) =>
          inCountByName.set(
            ingredient.name,
            inCountByName.get(ingredient.name)! - ingredient.count,
          ),
        )
        recipe.products.forEach((product) =>
          outCountByName.set(
            product.name,
            (outCountByName.get(product.name) || 0) + product.count,
          ),
        )
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
