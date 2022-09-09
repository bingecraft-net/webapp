import { State } from '.'
import transferTick from './transferTick'

describe('transfer tick', () => {
  test('tick no machines', () => {
    const actual = transferTick({ machines: [] })
    const expected: State = { machines: [] }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer one rod from crate to empty assembler', () => {
    const actual = transferTick({
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          key: 'crate1',
          inStacks: [],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [],
          type: 'crate',
        },
        {
          key: 'crate1',
          inStacks: [{ count: 1, name: 'rod' }],
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('dont transfer ingredients that dont match assembler recipe', () => {
    const actual = transferTick({
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'machine hull',
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer one per tick', () => {
    const actual = transferTick({
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [{ count: 2, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [{ count: 1, name: 'rod' }],
          type: 'crate',
        },
        {
          inStacks: [{ count: 1, name: 'rod' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('preserve assembler stacks', () => {
    const actual = transferTick({
      machines: [
        {
          inStacks: [{ count: 1, name: 'rod' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    })
    const expected: State = {
      machines: [
        {
          inStacks: [{ count: 1, name: 'rod' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })

  test('transfer two per two ticks', () => {
    const actual = transferTick(
      transferTick({
        machines: [
          {
            key: 'crate0',
            position: { x: 0, y: 0 },
            stacks: [{ count: 2, name: 'rod' }],
            type: 'crate',
          },
          {
            inStacks: [],
            key: 'assembler0',
            outStacks: [],
            position: { x: 0, y: 0 },
            potential: 0,
            recipeKey: 'widget',
            type: 'assembler',
          },
        ],
      }),
    )
    const expected: State = {
      machines: [
        {
          key: 'crate0',
          position: { x: 0, y: 0 },
          stacks: [],
          type: 'crate',
        },
        {
          inStacks: [{ count: 2, name: 'rod' }],
          key: 'assembler0',
          outStacks: [],
          position: { x: 0, y: 0 },
          potential: 0,
          recipeKey: 'widget',
          type: 'assembler',
        },
      ],
    }
    expect(actual).toStrictEqual(expected)
  })
})
