const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');

const verifyWebhookSignature = require('./util/verifyWebhookSignature');

const { handleCreate } = require('./controllers/webhooks');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook-catcher', verifyWebhookSignature, async (req, res) => {
  const request = req.body;

  switch (request.notification_type) {
    case 'create':
      return await handleCreate(request, res);
    case 'change':
      console.info('A booking was updated!');
      break;
    case 'cancel':
      console.info('A booking was cancelled!');
      break;
    default:
      console.info(
        'Some other webhook was received:',
        request.notification_type
      );
  }
});

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
