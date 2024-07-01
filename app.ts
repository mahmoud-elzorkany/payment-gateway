import * as express from 'express'
import * as fs from 'fs-extra'
import * as paymentsRouter from './routes/payments'
import DatabaseService from './services/databaseService'
import LoggerService from './services/loggerService'
import * as Path from 'path'
import { DATA_DIR, PORT_NUMBER } from './constants'

const app = express()

/**
 * Start the payment gateway
 */
async function start (): Promise<void> {
  initializeDataFolder()
  await initializeDatabase()
  initializeServer()
}

/**
 * Stop the payment gateway
 */
function stop (): void {
  void (async () => {
    try {
      LoggerService.logInfo('Stopping payment gateway')
      await DatabaseService.closeDatabase()
    } catch (error: any) {
      LoggerService.logError(`Error while stopping the payment gateway: ${error.stack ?? error.toString()}`)
    }
  })()
  process.exit(0)
}

/**
 * Initialize the data folder
 */
function initializeDataFolder (): void {
  fs.ensureDirSync(Path.resolve(DATA_DIR))
  LoggerService.logInfo('Data folder initialized')
}

/**
 * Initialize the database
 */
async function initializeDatabase (): Promise<void> {
  await DatabaseService.initializeDatabase()
}

/**
 * Initialize the server
 */
function initializeServer (): void {
  configureServer()
  loadRoutes()
  startServer()
}

function configureServer (): void {
  app.use(express.json())
}

/**
 * Load the routes
 */
function loadRoutes (): void {
  app.use('/payments', paymentsRouter)
  LoggerService.logInfo('Routes loaded')
}

function startServer (): void {
  app.listen(PORT_NUMBER)
  LoggerService.logInfo(`Server is listening on port ${PORT_NUMBER}`)
}

// Start the payment gateway
start().then(() => {
  LoggerService.logInfo('Payment gateway started successfully')
}).catch((error: Error) => {
  LoggerService.logError(`Failed to start payment gateway: ${error.stack ?? error.toString()}`)
})

// Handle SIGINT and SIGTERM signals
process.on('SIGINT', () => { stop() })
process.on('SIGTERM', () => { stop() })
