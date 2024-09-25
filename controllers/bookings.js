const crypto = require('crypto');
const jsonRpcRequest = require('../util/jsonRpcRequest');
const getToken = require('../util/getToken');

async function fetchBookingDetails({ bookingId, bookingHash }) {
  try {
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
  } catch (error) {
    throw new Error(
      `Booking details for booking nr. ${bookingId} could not be fetched: ${error}`
    );
  }
}

module.exports = {
  fetchBookingDetails,
};
