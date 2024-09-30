const axios = require('axios');

async function sendEmail({ clientName, clientEmail, code }) {
  const API_KEY = process.env.BREVO_API_KEY;

  const emailData = {
    sender: {
      name: "Chamois d'Or SPA",
      email: process.env.BREVO_EMAIL,
    },
    to: [
      {
        email: clientEmail,
        name: clientName,
      },
    ],
    subject: `Your SPA access code is ${code}`,
    htmlContent: `<html><head></head><body><p>Hello, ${clientName}, thank you for booking with Chamois d'Or SPA. Use this code to access the SPA: ${code}</p></body></html>`,
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          accept: 'application/json',
          'api-key': API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    console.info('BrevoAPI: email sent successfully');

    return response;
  } catch (error) {
    throw new Error(
      `Email could not be sent to ${clientEmail}: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
}

module.exports = {
  sendEmail,
};
