import * as express from 'express'
import * as fs from 'fs-extra'
import * as paymentsRouter from './routes/payments'
import DatabaseService from './services/databaseService'
import LoggerService from './services/loggerService'
import * as Path from 'path'
import { DATA_DIR, PORT_NUMBER } from './constants'

const app = express()

async function start (): Promise<void> {
  initializeDataFolder()
  await initializeDatabase()
  initializeServer()
}

function initializeDataFolder (): void {
  fs.ensureDirSync(Path.resolve(DATA_DIR))
  LoggerService.logInfo('Data folder initialized')
}

async function initializeDatabase (): Promise<void> {
  await DatabaseService.initializeDatabase()
}

function initializeServer (): void {
  loadRoutes()
  app.use(express.json())
  app.listen(PORT_NUMBER)
  LoggerService.logInfo(`Server is listening on port ${PORT_NUMBER}`)
}

function loadRoutes (): void {
  app.use('/payments', paymentsRouter)
  LoggerService.logInfo('Routes loaded')
}

start().then(() => {
  LoggerService.logInfo('Payment gateway started successfully')
}).catch((error: Error) => {
  LoggerService.logError(`Failed to start payment gateway: ${error.stack ?? error.toString()}`)
})
