const crypto = require('crypto');

const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-signature'];
  const payload = JSON.stringify(req.body);

  const calculatedSignature = crypto
    .createHmac('sha256', process.env.SIMPLYBOOK_SECRET_KEY)
    .update(payload)
    .digest('hex');

  if (signature === calculatedSignature) {
    next();
  } else {
    res.status(401).send('Invalid signature');
  }
};

module.exports = verifyWebhookSignature;
