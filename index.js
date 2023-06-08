const app = require('./app')
const config = require('./ultils/config')
const logger = require('./ultils/logger')



app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})