const axios = require('axios');

async function sendEmail({ clientName, clientEmail, code, templateId }) {
  const API_KEY = process.env.BREVO_API_KEY;

  const emailData = {
    to: [
      {
        email: clientEmail,
        name: clientName,
      },
    ],
    templateId,
    params: {
      clientName: clientName,
      code: code,
    },
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
