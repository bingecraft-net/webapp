import { RecipeSettings } from '.'

export const recipeSettings: RecipeSettings = {
  recipes: [
    {
      ingredients: [
        { count: 2, name: 'gear' },
        { count: 1, name: 'rod' },
      ],
      key: 'widget',
      products: [{ count: 1, name: 'widget' }],
    },
    {
      ingredients: [{ count: 8, name: 'plate' }],
      key: 'machine hull',
      products: [{ count: 1, name: 'machine hull' }],
    },
  ],
}
