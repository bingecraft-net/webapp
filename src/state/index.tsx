import { Stack } from './Stacks'

export interface State {
  machines: Machine[]
}

export type MachineBase = {
  key: string
  position: { x: number; y: number }
}

export interface Assembler extends MachineBase {
  inStacks: Stack[]
  outStacks: Stack[]
  potential: number
  recipeKey: RecipeKey
  type: 'assembler'
}

export interface Crate extends MachineBase {
  stacks: Stack[]
  type: 'crate'
}

export type Machine = Assembler | Crate

export interface RecipeSettings {
  recipes: Recipe[]
}

export interface Recipe {
  key: RecipeKey
  ingredients: Stack[]
  potential: number
  products: Stack[]
}

export type RecipeKey = 'machine hull' | 'widget'

export function setRecipeKey(
  key: number,
  recipeKey: RecipeKey,
): (prevState: State) => State {
  return ({ machines }) => {
    return {
      machines: machines.map(
        (machine, _key): Machine =>
          _key !== key || machine.type !== 'assembler'
            ? machine
            : { ...machine, potential: 0, recipeKey },
      ),
    }
  }
}
