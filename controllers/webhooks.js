const formatDate = require('../util/formatDate');
const { fetchBookingDetails } = require('./bookings');
const { createAccessCode } = require('./accessCodes');

async function handleCreate(request, res) {
  try {
    const bookingDetails = await fetchBookingDetails({
      bookingId: request.booking_id,
      bookingHash: request.booking_hash,
    });

    const accessCode = await createAccessCode({
      name: `Booking nr. ${request.booking_id} for ${bookingDetails.client_name}`,
      starts_at: formatDate(bookingDetails.start_date_time),
      ends_at: formatDate(bookingDetails.end_date_time),
      preferred_code_length: 4,
    });

    console.info(
      `Access code successfully created for ${bookingDetails.client_name}:`,
      accessCode.code
    );
    return res.status(200).json(accessCode);
  } catch (error) {
    console.info('Access code creation failed with an error:', error);
    return res.status(500).json(error);
  }
}

async function handleUpdate(request, res) {
  console.log(request);
}

async function handleCancel(request, res) {
  console.log(request);
}

module.exports = {
  handleCreate,
  handleUpdate,
  handleCancel,
};
