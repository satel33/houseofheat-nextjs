import commandLineUsage from 'command-line-usage'

import { optionDefinitions } from './options'

const sections = [
  {
    header: 'House of Heat: Algolia index utility',
    content: 'Command line utility to import articles into the Agolia index.'
  },
  {
    header: 'Options',
    optionList: [...optionDefinitions]
  }
]

export default commandLineUsage(sections)
