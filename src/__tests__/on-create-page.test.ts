import * as mock from 'mock-fs'
import onCreatePage from '../on-create-page'

const setMock = () =>
  mock({
    '/pages': {
      'about.bs.js': 'var component = ReasonReact.statelessComponent("about")',
      'http404.bs.js': 'var component = ReasonReact.statelessComponent("404")',
      'index.bs.js': 'var component = ReasonReact.statelessComponent("index")',
    },
  })

const createGatsby = ({
  createPage = jest.fn(),
  deletePage = jest.fn(),
  page = {},
  panic = jest.fn(() => {
    expect('I have valid options.').toBe(true)
  }),
} = {}) => ({
  actions: {
    createPage,
    deletePage,
  },
  page,
  reporter: {
    panic,
  },
})

describe('onCreatePage', () => {
  it('creates a new page/delete old page when component is found', () => {
    const createPage = jest.fn()
    const deletePage = jest.fn()
    const page = { component: '/pages/index.bs.js' }
    const gatsby = createGatsby({ createPage, deletePage, page })

    setMock()

    onCreatePage(gatsby)

    mock.restore()

    expect(createPage).toHaveBeenCalledWith({
      component: '/pages/index.bs.js',
      path: '/',
    })
    expect(deletePage).toHaveBeenCalledWith({
      component: '/pages/index.bs.js',
    })
  })

  it('transforms path name from component name', () => {
    const createPage = jest.fn()
    const deletePage = jest.fn()
    const page = { component: '/pages/http404.bs.js' }
    const gatsby = createGatsby({ createPage, deletePage, page })

    setMock()

    onCreatePage(gatsby)

    mock.restore()

    expect(createPage).toHaveBeenCalledTimes(2)
    expect(createPage).toHaveBeenCalledWith({
      component: '/pages/http404.bs.js',
      path: '/404/',
    })
    expect(createPage).toHaveBeenCalledWith({
      component: '/pages/http404.bs.js',
      path: '/404.html',
    })
  })

  it('transforms index to / in path name', () => {
    const createPage = jest.fn()
    const deletePage = jest.fn()
    const page = { component: '/pages/index.bs.js' }
    const gatsby = createGatsby({ createPage, deletePage, page })

    setMock()

    onCreatePage(gatsby)

    mock.restore()

    expect(createPage).toHaveBeenCalledWith({
      component: '/pages/index.bs.js',
      path: '/',
    })
  })

  it('skips creating pages in __tests__ directory', () => {
    const createPage = jest.fn()
    const deletePage = jest.fn()
    const page = { component: '/pages/__tests__/index.test.bs.js' }
    const gatsby = createGatsby({ createPage, deletePage, page })

    setMock()

    onCreatePage(gatsby)

    mock.restore()

    expect(deletePage).toHaveBeenCalledWith({
      component: '/pages/__tests__/index.test.bs.js',
    })
  })

  it('skips creating pages in components directory', () => {
    const createPage = jest.fn()
    const deletePage = jest.fn()
    const page = { component: '/components/button.bs.js' }
    const gatsby = createGatsby({ createPage, deletePage, page })

    setMock()

    onCreatePage(gatsby)

    mock.restore()

    expect(deletePage).not.toHaveBeenCalled()
  })
})
