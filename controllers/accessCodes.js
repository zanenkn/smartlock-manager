const { Seam } = require('seam');
const axios = require('axios');

const seam = new Seam();

async function createAccessCode({
  name,
  starts_at,
  ends_at,
  preferred_code_length,
}) {
  try {
    const response = await axios.post(
      'https://connect.getseam.com/access_codes/create',
      {
        device_id: process.env.SEAM_DEVICE_ID,
        name,
        starts_at,
        ends_at,
        preferred_code_length,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SEAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.info('SeamAPI: new access code created');

    return response.data.access_code;
  } catch (error) {
    throw new Error(
      `Access code could not be created: ${
        error.response ? error.response.data : error.message
      }`
    );
  }
}

async function getAccessCodeFromBookingId(bookingId) {
  try {
    const response = await axios.post(
      'https://connect.getseam.com/access_codes/list',
      {
        device_id: process.env.SEAM_DEVICE_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SEAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const accessCode = response.data.access_codes.find((accessCode) => {
      const match = accessCode.name.match(/Booking nr\.\s*(\d+)\s*for/);
      return match && match[1] === String(bookingId);
    });

    console.info(
      `SeamAPI: ${
        accessCode
          ? `access code located for booking ${bookingId}`
          : `no access code attached to booking ${bookingId}`
      }`
    );

    return accessCode;
  } catch (error) {
    throw new Error(
      `Access code for booking nr. ${bookingId} could not be found: ${error.message}`
    );
  }
}

async function updateAccessCode({ access_code_id, starts_at, ends_at }) {
  try {
    const updatedAccessCode = await seam.accessCodes.update({
      access_code_id,
      starts_at,
      ends_at,
    });

    console.info('SeamAPI: access code updated');

    return updatedAccessCode;
  } catch (error) {
    throw new Error(`Access code could not be updated: ${error.message}`);
  }
}

async function deleteAccessCode(id) {
  try {
    const deletedAccessCode = await seam.accessCodes.delete({
      access_code_id: id,
    });

    console.info('SeamAPI: access code deleted');

    return deletedAccessCode;
  } catch (error) {
    throw new Error(`Access code could not be deleted: ${error.message}`);
  }
}

module.exports = {
  createAccessCode,
  getAccessCodeFromBookingId,
  updateAccessCode,
  deleteAccessCode,
};
