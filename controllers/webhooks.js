const formatDate = require('../util/formatDate');
const { fetchBookingDetails } = require('./bookings');
const {
  createAccessCode,
  getAccessCodeFromBookingId,
  updateAccessCode,
  deleteAccessCode,
} = require('./accessCodes');
const { sendEmail } = require('./emails');

async function handleCreate(request, res) {
  console.info(`TRIGGER: a booking with id ${request.booking_id} was created`);
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

    await sendEmail({
      clientName: bookingDetails.client_name,
      clientEmail: bookingDetails.client_email,
      code: accessCode.code,
      templateId: 1,
    });

    console.info(
      `SUCCESS: Access code ${accessCode.code} successfully created for ${bookingDetails.client_name} and sent to their email address ${bookingDetails.client_email}`
    );
    return res.status(200).json(accessCode);
  } catch (error) {
    console.info(
      'ERROR: failed to handle webhook on trigger "create" due to the following error:',
      error
    );
    return res.status(500).json(error);
  }
}

async function handleUpdate(request, res) {
  console.info(`TRIGGER: a booking with id ${request.booking_id} was updated`);

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

    console.info(
      `SUCCESS: Access code ${
        accessCode.code
      } successfully updated, now active from ${formatDate(
        bookingDetails.start_date_time
      )} to ${formatDate(bookingDetails.end_date_time)}`
    );
    return res.status(200).json(updatedAccessCode);
  } catch (error) {
    console.info(
      'ERROR: failed to handle webhook on trigger "update" due to the following error:',
      error
    );
    return res.status(500).json(error);
  }
}

async function handleCancel(request, res) {
  console.info(
    `TRIGGER: a booking with id ${request.booking_id} was cancelled`
  );

  try {
    const accessCode = await getAccessCodeFromBookingId(request.booking_id);

    if (accessCode) {
      const deletedAccessCode = await deleteAccessCode(
        accessCode.access_code_id
      );

      console.info(
        `SUCCESS: Access code ${accessCode.code} successfully deleted!`
      );
      return res.status(200).json(deletedAccessCode);
    }
  } catch (error) {
    console.info(
      'ERROR: failed to handle webhook on trigger "cancel" due to the following error:',
      error
    );
    return res.status(500).json(error);
  }
}

module.exports = {
  handleCreate,
  handleUpdate,
  handleCancel,
};
