const formatDate = require('../util/formatDate');
const { fetchBookingDetails } = require('./bookings');
const {
  createAccessCode,
  getAccessCodeFromBookingId,
  updateAccessCode,
  deleteAccessCode,
} = require('./accessCodes');

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
  try {
    const bookingDetails = await fetchBookingDetails({
      bookingId: request.booking_id,
      bookingHash: request.booking_hash,
    });

    const accessCode = await getAccessCodeFromBookingId(request.booking_id);

    const updatedAccessCode = await updateAccessCode({
      access_code_id: accessCode.access_code_id,
      starts_at: formatDate(bookingDetails.start_date_time),
      ends_at: formatDate(bookingDetails.end_date_time),
    });

    console.info('Access code was successfully updated!');
    return res.status(200).json(updatedAccessCode);
  } catch (error) {
    console.info('Access code update failed with an error:', error);
    return res.status(500).json(error);
  }
}

async function handleCancel(request, res) {
  try {
    const accessCode = await getAccessCodeFromBookingId(request.booking_id);

    const deletedAccessCode = await deleteAccessCode(accessCode.access_code_id);

    console.info('Access code was successfully deleted!');
    return res.status(200).json(deletedAccessCode);
  } catch (error) {
    console.info('Access code could not be deleted:', error);
    return res.status(500).json(error);
  }
}

module.exports = {
  handleCreate,
  handleUpdate,
  handleCancel,
};
