import { Machine, State } from '.'
import { Stack, stackCountByName, stacks } from './Stacks'

interface Settings {
  recipes: Recipe[]
}

interface Recipe {
  ingredients: Stack[]
  products: Stack[]
}

export const settings: Settings = {
  recipes: [
    {
      ingredients: [
        { count: 2, name: 'gear' },
        { count: 1, name: 'rod' },
      ],
      products: [{ count: 1, name: 'widget' }],
    },
    {
      ingredients: [{ count: 8, name: 'plate' }],
      products: [{ count: 1, name: 'machine hull' }],
    },
  ],
}

export default function assembleTick({ machines }: State): State {
  return {
    machines: machines.map((machine): Machine => {
      if (machine.type !== 'assembler') return machine

      const potential = Math.min(20, machine.potential + 1)
      if (potential < 20) return { ...machine, potential }

      const outCountByName = stackCountByName(machine.outStacks)
      const inCountByName = stackCountByName(machine.inStacks)

      for (const recipe of settings.recipes) {
        if (
          recipe.ingredients.every(
            (ingredient) =>
              (inCountByName.get(ingredient.name) || 0) >=
              ingredient.count,
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
      }

      return { ...machine, potential }
    }),
  }
}
