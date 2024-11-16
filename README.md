# Smartlock Manager

## About

This application is designed to handle webhooks from the [SimplyBook.me](https://simplybook.me/en/) booking system and integrates with various external APIs to manage access codes for bookings. When a booking is created, updated, or canceled, the application generates a time-bound access code valid only during the booking's active period. This code is then sent to a smart lock IoT device via WiFi bridge, enabling secure, time-limited access. Clients are also notified by email with the access code and booking details.

### APIs Used
* [SimplyBook API](https://simplybook.me/en/api/developer-api): Fetches detailed booking information.
* [Seam API](https://docs.seam.co/latest): Manages access codes for smart locks (create, update, and delete).
* [Brevo API](https://developers.brevo.com/): Sends email notifications with booking details and access codes.

## Solution Design

### How It Works
1. **Webhook Trigger:**  
   SimplyBook.me sends a webhook to `/webhook-catcher`.
2. **Signature Verification:**  
   The `verifyWebhookSignature` middleware ensures the request is valid.
3. **Route Handling:**  
   The `notification_type` field in the webhook determines the handler (`handleCreate`, `handleUpdate`, `handleCancel`).
4. **Handler Logic:**  
   The handler coordinates with the booking, access code, and email controllers to perform necessary actions (fetch booking details, create/update/delete access codes, send emails).
5. **Response:**  
   Each handler responds with success or error messages based on the operation's outcome.

### Create Booking Flow

![create-flow](https://github.com/user-attachments/assets/04d2fa68-ad56-4c1e-9a3e-fb4ac5924d37)

## Entry Point: `app.js`

The app initializes the Express.js server and defines a single route `/webhook-catcher` to handle webhook requests. The server:

* Parses incoming JSON requests.
* Verifies webhook signatures to ensure authenticity.
* Handles POST requests and uses the `notification_type` field in the request body to delegate the processing of each webhook type (create, change, cancel) to appropriate handlers: `handleCreate`, `handleUpdate`, and `handleCancel`.

## Webhook Handlers: `controllers/webhooks.js`

Webhook handlers process the logic for handling different booking events (create, update, cancel) by coordinating between bookings, access codes, and email controllers.

### handleCreate

* Triggered by a booking creation webhook.
* Fetches booking details.
* Creates a new access code.
* Sends an email to the client with the access code and booking details.

### handleUpdate

* Triggered by a booking update webhook.
* Updates the access code's active period.
* Sends an email to the client with updated booking and access code details.

### handleCancel

* Triggered by a booking cancellation webhook.
* Deletes the access code associated with the booking.

## Access Code Controller: `controllers/accessCodes.js`

Manages access codes for a device using Seam API. Functions include creating, retrieving, updating, and deleting access codes.

### createAccessCode

Sends a POST request to the Seam API to create a time-bound access code with specified properties. Returns the created access code.

### getAccessCodeFromBookingId

Uses Seam API to retrieve all access codes and filters by booking ID. Returns an access code associated with a booking ID.

### updateAccessCode

Updates an existing access code's active period using Seam API.

### deleteAccessCode

Deletes an access code by its ID using the Seam API.

## Bookings Controller: `controllers/bookings.js`

Using a booking ID and hash, fetches detailed booking information from SimplyBook API. Secures the JSON-RPC request with a signed hash and token.

## Emails Controller: `controllers/emails.js`

Using the Brevo API, sends email notifications to clients with booking details, access codes, and event information. Uses a specified email template for formatting.

## Running the App

Follow these steps to run the app locally and test it end-to-end.

### 1. Create an Account in [SimplyBook](https://simplybook.me/en/)
1. Activate API in Custom Features to create a secret key and API key.
2. Enable the following triggers: create, change, cancel.

### 2. Create an Account in [Brevo](https://www.brevo.com/)
1. Create two email templates: for new bookings and updated bookings. The params you can use are:
   * `clientName`
   * `code`
   * `bookingStart`
   * `bookingEnd`
   * `bookingEvent`
2. Generate an API key and store it somewhere safe.

### 3. Create an Account in [Seam](https://www.seam.co/)
1. Connect your device to Seam Console (or use the test device in the sandbox environment).
2. Generate an API key and store it somewhere safe.

### 4. ENV Variables

Create a `.env` file in the root of the project and add the following to it:

```
SIMPLYBOOK_SECRET_KEY= you will find it in Custom Features --> API
SIMPLYBOOK_API_KEY= you will find it in Custom Features --> API
SIMPLYBOOK_COMPANY_LOGIN= check the link for your SimplyBook backoffice: https://<this-is-your-company-login>.secure.simplybook.it/v2/
SIMPLYBOOK_BASE_URL=https://user-api.simplybook.me
BREVO_API_KEY= paste your Brevo API key here
SEAM_API_KEY= paste your Seam API key here
SEAM_DEVICE_ID= you will find it in Seam Console
```

### 5. Install the App

Run `npm install` in the terminal.

### 6. Run the App

Run `npm start` in the terminal.

### 7. Tunneling Service

[Ngrok](https://ngrok.com/) is a tool that provides secure tunnels to expose local servers or applications to the public internet. It allows developers to make their locally running web applications accessible to external services, clients, or collaborators without deploying them to a production environment. You will need this to test the application without deploying it. Follow [these instructions](https://download.ngrok.com/mac-os) to install and run ngrok (run it on the default port of the app: 3000). Note the URL that ngrok provides you with.

### 8. Providing the Callback URL for SimplyBook

In the SimplyBook back office, go to API Custom Feature and paste the URL `ngrok` has generated into the Callback URL field. Add `/webhook-catcher` at the end of it:

```
https://some-random-hash.ngrok-free.app/webhook-catcher
```

### 9. Test the Application

* Create a new booking: either through the SimplyBook back office or the Booking widget. 
* Observe the logs in the terminal. 
* Verify that the correct email is sent to the provided client's email address.
* Verify that the access code is added to the device in Seam Console.
* If you have connected an actual IoT device, verify that the code works during the assigned time bounds.
* Repeat the process for updating and deleting bookings.

## Smallprint

This code is open source: you are free to use, modify, and distribute it at your own discretion. The author assumes no responsibility for any bugs, errors, or inaccuracies in the code or its documentation, nor for any issues that arise from its use.
