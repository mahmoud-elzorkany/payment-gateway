# payment-gateway

## Description:
An API payment gateway that is Responsible for validating requests, storing payment information and forwarding 
payment requests and accepting payment responses to and from the acquiring bank.

## System components:
- **API Gateway**: This is the entry point for all the payment requests. It is responsible for validating the requests and forward them to the payment service.
- **Payment Service**: This service is responsible for forwarding payment requests and accepting payment responses to and from the acquiring bank. and storing payment information in the DB.
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

## API Endpoints:
- **POST /api/payment**: This endpoint is used to initiate a payment request. It accepts a JSON object in the request body with the following properties:
- **GET /api/payment/:id**: This endpoint is used to get the payment information by its UUID.

Please refer to: `models/api/payment/params.ts` for the request and response body schema.

## Testing the API:
To receive a successful payment response, you can use the following card numbers:
* "378734493671000"
* "5610591081018250"
* "4111111111111111"
* "30569309025904"

To receive a failed payment response, you can use the following card numbers:
* "378282246310005"
* "371449635398431"
* "5200828282828210"
* "2223003122003222"

**note**: any card number that is not listed above will result in a pending payment response.