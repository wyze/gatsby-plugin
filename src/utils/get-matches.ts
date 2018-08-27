import { readFileSync } from 'fs'

const getMatches = (component: string) =>
  /var component = ReasonReact\.[^"]+"(\w+)/.exec(
    readFileSync(component, 'utf-8')
  )

export default getMatches
