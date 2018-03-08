const path = require('path')

const initPlugins = () => {
  const pluginsMeta = require(path.join(global.appRoot, 'plugins.json'))
  let plugins = []

  pluginsMeta.forEach(pluginMeta => {
    const plugin = require(path.join(global.appRoot, 'plugins', pluginMeta.name, pluginMeta.entry))
    plugins.push(plugin)
  })

  return plugins
}

module.exports = initPlugins
