import { GluegunRunContext } from 'gluegun'

module.exports = (context: GluegunRunContext): void => {
  context.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  context.cls = () => process.stdout.write('\x1B[2J')
}
