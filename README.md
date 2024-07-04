# payment-gateway

## Description:
An API payment gateway that is Responsible for validating requests, storing card information and forwarding 
payment requests and accepting payment responses to and from the acquiring bank.

## System components:
- **API Gateway**: This is the entry point for all incoming requests. It is responsible for routing requests to the appropriate service.
- **Payment Service**: This service is responsible for validating requests, forwarding payment requests and accepting payment responses to and from the acquiring bank. and storing payment information in the DB.
- **Acquiring Bank Service**: This service is responsible for processing payment requests and responding to the payment service.
- **Event Service**: This service is responsible for emitting events initiated by the acquiring bank service, also it is used to notify the payment service about the payment status.
- **Database Service**: This service is responsible for initializing the connection to the database, and initializing the database schema.
- **Payment DAO**: This DAO is responsible for interacting with the database, it is used to store, retrieve and update payment information.
- **Logger Service**: This service is responsible for logging incoming requests, system events and errors.

## How to run the project:
- Clone the repository.
- [Install node.js and npm](https://nodejs.org/en/download/package-manager).
- Under the project root directory, run `npm install` to install the project dependencies.
- Run the command `npm run build` to compile the project.
- Run the command `npm run start` to start the project.
- The project will be running on `http://localhost:3000`.
- To run the unit tests, run the command `npm run test:unit`.
- To run the e2e tests, run the command `npm run test:e2e`.
