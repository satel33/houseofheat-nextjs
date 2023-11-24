import commandLineArgs from 'command-line-args'

export const optionDefinitions = [
  {
    name: 'add',
    alias: 'a',
    type: String,
    multiple: true,
    description: 'Adds an article to the index.',
    typeLabel: '{underline document id}'
  },
  {
    name: 'remove',
    alias: 'r',
    type: String,
    multiple: true,
    description: 'Removes an article from the index.',
    typeLabel: '{underline document id}'
  },
  {
    name: 'full',
    alias: 'f',
    description:
      'Runs a full import of the Algolia index, clearing everything first',
    type: Boolean
  },
  {
    name: 'clear',
    alias: 'c',
    description: 'Clears the Algolia index.',
    type: Boolean
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this usage guide.'
  }
]

export default commandLineArgs(optionDefinitions)
