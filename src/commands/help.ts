module.exports = {
  name: 'help',
  alias: ['h'],
  run: async (context) => {
    const { print } = context

    print.info('')
    print.info('submarine CLI Help')
    print.info('Coming soon!')
    print.info('')
  }
}
