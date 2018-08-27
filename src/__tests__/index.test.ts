import * as module from '..'

describe('@wyze/gatsby-plugin', () => {
  it('exports functions', () => {
    expect(module).toEqual(
      expect.objectContaining({
        onCreatePage: expect.any(Function),
      })
    )
  })
})
