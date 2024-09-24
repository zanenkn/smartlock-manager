const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');

const verifyWebhookSignature = require('./util/verifyWebhookSignature');

const {
  handleCreate,
  handleUpdate,
  handleCancel,
} = require('./controllers/webhooks');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook-catcher', verifyWebhookSignature, async (req, res) => {
  const request = req.body;

  switch (request.notification_type) {
    case 'create':
      return await handleCreate(request, res);
    case 'change':
      return await handleUpdate(request, res);
    case 'cancel':
      return await handleCancel(request, res);
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
