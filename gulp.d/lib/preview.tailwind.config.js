const mainConfig = require('../../tailwind.config.js')

module.exports = { ...mainConfig, content: ['public/**/*.{html,js}', 'src/**/*.hbs'] }
