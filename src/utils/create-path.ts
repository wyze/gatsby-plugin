const createPath = (name: string) => (name === 'index' ? '/' : `/${name}/`)

export default createPath
