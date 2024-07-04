/**
 * This file is used to start the server before running the e2e tests.
 * It initializes the database and starts the server on the specified port.
 * It also closes the database connection after the tests are completed.
 *
 * Possible improvements:
 * - Separate the test and development environments.
 * - Deduplicate the code for initializing the database and starting the server.
 * - Add a function to seed the database with test data before running the tests.
 * - Add a function to clear the database after running the tests.
 * - Enable coverage reporting for the tests.
 * - Add a function to load test files dynamically.
 */

import * as fs from "fs-extra";
import * as Path from "path";
import { DATA_DIR, PORT_NUMBER } from "../../constants";
import DatabaseService from "../../services/databaseService";
import * as express from "express";
import * as paymentsRouter from "../../routes/payments";

before(async () => {
  const app = express();
  fs.ensureDirSync(Path.resolve(DATA_DIR));
  await DatabaseService.initializeDatabase();
  app.use(express.json());
  app.use("/payments", paymentsRouter);
  app.listen(PORT_NUMBER);
});

after(async () => {
  await DatabaseService.closeDatabase();
  process.exit(0);
});
