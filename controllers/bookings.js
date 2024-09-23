const crypto = require('crypto');
const jsonRpcRequest = require('../util/jsonRpcRequest');
const getToken = require('../util/getToken');

async function fetchBookingDetails({ bookingId, bookingHash }) {
  const sign = crypto
    .createHash('md5')
    .update(`${bookingId}${bookingHash}${process.env.SIMPLYBOOK_SECRET_KEY}`)
    .digest('hex');

  const params = {
    id: bookingId,
    sign: sign,
  };

  const token = await getToken();

  return await jsonRpcRequest({ method: 'getBookingDetails', params, token });
}

module.exports = {
  fetchBookingDetails,
};
